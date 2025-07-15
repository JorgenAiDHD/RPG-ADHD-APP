const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// To restrict CORS to your GitHub Pages domain, use:
// app.use(cors({ origin: 'https://TWOJA_NAZWA_UZYTKOWNIKA_GITHUB.github.io' }));
// Replace with your actual GitHub Pages URL if needed.
app.use(cors());
app.use(express.json());

// Debug log helper
function logApiCall(label, data) {
  console.log(`\n==== ${label} ====`);
  console.log(JSON.stringify(data, null, 2));
  console.log("====================\n");
}

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Function schemas for Gemini function calling
const functionSchemas = [
  {
    name: "set_main_quest",
    description: "Updates the main quest with a new title and description",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the main quest"
        },
        description: {
          type: "string",
          description: "A detailed description of the main quest"
        }
      },
      required: ["title", "description"]
    }
  },
  {
    name: "add_quest",
    description: "Adds a new quest with the provided details",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the quest"
        },
        xpReward: {
          type: "number",
          description: "The amount of XP rewarded for completing the quest"
        }
      },
      required: ["title"]
    }
  },
  {
    name: "log_health_activity",
    description: "Logs a health-related activity with positive or negative effects on health and XP",
    parameters: {
      type: "object",
      properties: {
        activityName: {
          type: "string",
          description: "The name of the health activity being logged"
        },
        healthChange: {
          type: "number",
          description: "Change in health points from the activity (positive for gain, negative for loss)",
          default: 0
        },
        xpChange: {
          type: "number",
          description: "Change in XP from the activity (positive for gain, negative for loss)",
          default: 0
        },
        category: {
          type: "string",
          description: "The category of the health activity (physical, mental, social, creative)",
          enum: ["physical", "mental", "social", "creative"]
        },
        duration: {
          type: "number",
          description: "The duration of the activity in minutes",
          default: 30
        },
        description: {
          type: "string",
          description: "A brief description of the health activity"
        },
        icon: {
          type: "string",
          description: "An emoji icon representing the activity",
          default: "💪"
        }
      },
      required: ["activityName"]
    }
  }
];

// Chat endpoint to process messages via Gemini API
app.post('/chat', async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const { message, gameState } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Jeśli gameState jest dostępny, wykorzystajmy go w prompcie systemowym
    if (gameState) {
      console.log("Game state received, processing with context");
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
        });
        
        // Przygotuj skrócony systemowy prompt z najważniejszymi informacjami
        let systemPrompt = "You are an AI Companion for the RPG Quest Log app. ";
        systemPrompt += "Help users manage tasks, health, and progress. ";
        systemPrompt += "Be enthusiastic, supportive, and use RPG terminology. ";
        systemPrompt += "Use the available tools to modify game state when appropriate. ";
        
        // Dodaj tylko kluczowe informacje o stanie gry
        systemPrompt += "\n\nGAME STATUS:";
        systemPrompt += `\nPlayer Level: ${gameState.player.level}, XP: ${gameState.player.xp}/${gameState.player.xpToNextLevel}`;
        systemPrompt += `\nHealth: ${gameState.healthBar.current}/${gameState.healthBar.maximum}`;
        
        // Dodaj informację o głównym zadaniu, jeśli istnieje
        if (gameState.mainQuest && gameState.mainQuest.title) {
          systemPrompt += `\nMain Quest: "${gameState.mainQuest.title}"`;
        }
        
        // Informacja o aktywnych questach - tylko liczba
        if (gameState.activeQuests && gameState.activeQuests.length > 0) {
          systemPrompt += `\nActive Quests: ${gameState.activeQuests.length}`;
        } else {
          systemPrompt += "\nNo active quests.";
        }
        
        // Funkcja do bezpiecznego serializowania obiektów
        const safeStringify = (obj) => {
          if (!obj) return '';
          if (Array.isArray(obj)) {
            return `${obj.length} items`;
          }
          return 'available';
        };
        
        // Bezpieczne dodawanie dodatkowych informacji
        systemPrompt += `\nHealth Activities: ${safeStringify(gameState.customHealthActivities || [])}`;
        
        // Dodajemy instrukcję jak używać narzędzi
        systemPrompt += "\n\nFor health activities, you can use log_health_activity tool with both positive and negative health and XP changes.";
        
        // Teraz możemy używać systemu funkcji zamiast symulacji
        const chat = model.startChat({
          generationConfig: {
            temperature: 0.7,
          },
          tools: [{ functionDeclarations: functionSchemas }],
          systemInstruction: systemPrompt
        });

        console.log("Sending to Gemini with context:", { message, systemPrompt });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        console.log("Response from Gemini:", text);
        
        // Check for function calls
        let functionCall = null;
        if (response.candidates && response.candidates[0]?.content?.parts?.length > 0) {
          const parts = response.candidates[0].content.parts;
          for (const part of parts) {
            if (part.functionCall) {
              try {
                // Parse function arguments from JSON string
                const rawArgs = JSON.parse(part.functionCall.args);
                console.log("Raw function args:", rawArgs);
                
                // Convert numeric values to actual numbers when needed
                const processedArgs = {};
                
                // Handle each function differently based on its expected parameters
                if (part.functionCall.name === 'add_quest') {
                  processedArgs.title = rawArgs.title;
                  processedArgs.description = rawArgs.description || '';
                  processedArgs.type = rawArgs.type || 'side';
                  processedArgs.xpReward = rawArgs.xpReward ? Number(rawArgs.xpReward) : 20;
                  processedArgs.priority = rawArgs.priority || 'medium';
                  processedArgs.estimatedTime = rawArgs.estimatedTime ? Number(rawArgs.estimatedTime) : 30;
                  processedArgs.difficultyLevel = rawArgs.difficultyLevel ? Number(rawArgs.difficultyLevel) : 3;
                  processedArgs.energyRequired = rawArgs.energyRequired || 'medium';
                  processedArgs.anxietyLevel = rawArgs.anxietyLevel || 'comfortable';
                  processedArgs.tags = rawArgs.tags || ['general'];
                } 
                else if (part.functionCall.name === 'log_health_activity') {
                  processedArgs.activityName = rawArgs.activityName;
                  processedArgs.healthChange = rawArgs.healthChange ? Number(rawArgs.healthChange) : 0;
                  processedArgs.xpChange = rawArgs.xpChange ? Number(rawArgs.xpChange) : 0;
                  processedArgs.category = rawArgs.category || 'physical';
                  processedArgs.duration = rawArgs.duration ? Number(rawArgs.duration) : 30;
                  processedArgs.description = rawArgs.description || '';
                  processedArgs.icon = rawArgs.icon || '💪';
                }
                else {
                  // For other functions, use raw args but make a safe copy
                  Object.keys(rawArgs).forEach(key => {
                    processedArgs[key] = rawArgs[key];
                  });
                }
                
                console.log("Processed function args:", processedArgs);
                
                functionCall = {
                  name: part.functionCall.name,
                  arguments: processedArgs
                };
              } catch (argError) {
                console.error("Error processing function arguments:", argError);
                console.error("Original args:", part.functionCall.args);
                // Fallback to original behavior
                functionCall = {
                  name: part.functionCall.name,
                  arguments: JSON.parse(part.functionCall.args)
                };
              }
              break;
            }
          }
        }
        
        return res.json({
          text: text,
          functionCall: functionCall
        });
        
      } catch (apiError) {
        console.error("Error with Gemini API:", apiError);
        
        // Obsługa błędów specyficznych dla formatu instrukcji
        if (apiError.message && apiError.message.includes('Invalid value at \'system_instruction\'')) {
          console.log("Detected system instruction format error, falling back to simplified prompt");
          
          // Próba z bardziej uproszczonym promptem
          try {
            const simpleModel = genAI.getGenerativeModel({
              model: 'gemini-1.5-flash',
            });
            
            const simplePrompt = "You are an RPG Quest Log assistant. Help with quests and health activities.";
            
            const simpleChat = simpleModel.startChat({
              generationConfig: {
                temperature: 0.7,
              },
              tools: [{ functionDeclarations: functionSchemas }],
              systemInstruction: simplePrompt
            });
            
            console.log("Retrying with simplified prompt");
            const simpleResult = await simpleChat.sendMessage(message);
            const simpleResponse = await simpleResult.response;
            const simpleText = simpleResponse.text();
            
            // Próba przetworzenia odpowiedzi z funkcjami jak wcześniej
            let functionCall = null;
            if (simpleResponse.candidates && simpleResponse.candidates[0]?.content?.parts?.length > 0) {
              // Pozostała logika obsługi funkcji (taka sama jak w głównym bloku kodu)
              const parts = simpleResponse.candidates[0].content.parts;
              for (const part of parts) {
                if (part.functionCall) {
                  try {
                    const rawArgs = JSON.parse(part.functionCall.args);
                    const processedArgs = {};
                    
                    // Podobna obróbka argumentów jak wcześniej
                    if (part.functionCall.name === 'log_health_activity') {
                      processedArgs.activityName = rawArgs.activityName;
                      processedArgs.healthChange = rawArgs.healthChange ? Number(rawArgs.healthChange) : 0;
                      processedArgs.xpChange = rawArgs.xpChange ? Number(rawArgs.xpChange) : 0;
                      processedArgs.category = rawArgs.category || 'physical';
                      processedArgs.duration = rawArgs.duration ? Number(rawArgs.duration) : 30;
                      processedArgs.description = rawArgs.description || '';
                      processedArgs.icon = rawArgs.icon || '💪';
                    } else {
                      Object.keys(rawArgs).forEach(key => {
                        processedArgs[key] = rawArgs[key];
                      });
                    }
                    
                    functionCall = {
                      name: part.functionCall.name,
                      arguments: processedArgs
                    };
                    break;
                  } catch (innerError) {
                    console.error("Error in fallback function processing:", innerError);
                  }
                }
              }
            }
            
            return res.json({
              text: simpleText,
              functionCall: functionCall
            });
            
          } catch (fallbackError) {
            console.error("Even fallback approach failed:", fallbackError);
            // Kontynuuj do ogólnej obsługi błędów poniżej
          }
        }
        
        return res.status(500).json({ 
          error: 'Failed to process chat with AI',
          message: apiError.message 
        });
      }
    }
    
    // Fallback do testowej implementacji, jeśli nie mamy gameState lub wystąpił problem
    console.log("Falling back to test implementation");
    
    // Dla testów, symulujmy wywołanie funkcji add_quest z wartościami liczbowymi
    if (message.toLowerCase().includes("add quest") || message.toLowerCase().includes("dodaj zadanie")) {
      return res.json({ 
        text: "",
        functionCall: {
          name: "add_quest",
          arguments: {
            title: "Test Quest",
            description: "This is a test quest",
            type: "side",
            xpReward: 50, // Liczba, nie string
            priority: "medium",
            estimatedTime: 30, // Liczba, nie string
            difficultyLevel: 3, // Liczba, nie string
            energyRequired: "medium",
            anxietyLevel: "comfortable",
            tags: ["test", "debug"]
          }
        }
      });
    } 
    // Symulacja log_health_activity
    else if (message.toLowerCase().includes("health") || message.toLowerCase().includes("zdrowie")) {
      return res.json({ 
        text: "",
        functionCall: {
          name: "log_health_activity",
          arguments: {
            activityName: "Test Activity",
            healthChange: 15, // Liczba, nie string
            xpChange: 10,     // Dodano XP change
            category: "physical",
            duration: 45, // Liczba, nie string
            description: "Test health activity",
            icon: "🏃‍♂️"
          }
        }
      });
    }
    // Domyślna odpowiedź dla innych wiadomości
    else {
      return res.json({ 
        text: "I'm your AI companion in test mode. Try asking me to 'add quest' or log a 'health' activity.",
        functionCall: null
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      message: error.message 
    });
  }
});

// Server status endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port} (all interfaces)`);
});
