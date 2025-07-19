const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// CORS Configuration - secure and production-ready
const allowedOrigins = [
  'https://jorgenaidhd.github.io',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Debug log helper
function logApiCall(label, data) {
  console.log(`\n==== ${label} ====`);
  console.log(JSON.stringify(data, null, 2));
  console.log("====================\n");
}

// Initialize Gemini AI with proper error handling
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in the environment variables.');
  console.error('Please create a .env file with GEMINI_API_KEY=your_api_key_here');
  process.exit(1);
}

// Validate UUID library is available
try {
  const testUuid = uuidv4();
  console.log('UUID library loaded successfully');
} catch (error) {
  console.error('Error loading UUID library:', error);
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Function schemas for Gemini function calling - CORRECTED STRUCTURE
const functionSchemas = [
  {
    name: "update_quest_parameters",
    description: "Updates attributes of an active quest (title, description, priority, etc.)",
    parameters: {
      type: "object",
      properties: {
        questId: { type: "string", description: "The unique ID of the quest to update." },
        newTitle: { type: "string", description: "New title for the quest." },
        newDescription: { type: "string", description: "New description for the quest." },
        newPriority: { type: "string", enum: ["low", "medium", "high"], description: "New priority level." },
        newEstimatedTime: { type: "number", description: "New estimated time in minutes." },
        newDifficultyLevel: { type: "number", description: "New difficulty level (1-5)." },
        newEnergyRequired: { type: "string", enum: ["low", "medium", "high"], description: "New energy requirement." },
        newAnxietyLevel: { type: "string", enum: ["comfortable", "challenging", "overwhelming"], description: "New anxiety level." },
        newTags: { type: "array", items: { type: "string" }, description: "New tags array." }
      },
      required: ["questId"]
    }
  },
  {
    name: "remove_quest",
    description: "Removes an active quest by its ID.",
    parameters: {
      type: "object",
      properties: {
        questId: { type: "string", description: "The unique ID of the quest to remove." }
      },
      required: ["questId"]
    }
  },
  {
    name: "get_quest_suggestions",
    description: "Returns a list of suggested quests based on context (category, difficulty, energy, anxiety).",
    parameters: {
      type: "object",
      properties: {
        category: { type: "string", enum: ["physical", "mental", "social", "nutrition", "other"], description: "Category of suggested quests." },
        difficulty: { type: "number", description: "Desired difficulty level (1-5)." },
        energyLevel: { type: "string", enum: ["low", "medium", "high"], description: "Required energy level." },
        anxietyTolerance: { type: "string", enum: ["comfortable", "challenging", "overwhelming"], description: "Preferred anxiety level." }
      },
      required: []
    }
  },
  {
    name: "set_main_quest",
    description: "Updates the main quest with a new title and description",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "The title of the new main quest." },
        description: { type: "string", description: "A detailed description of the new main quest." }
      },
      required: ["title", "description"]
    }
  },
  {
    name: "add_quest",
    description: "Adds a new quest to the active quests list.",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "The title of the quest." },
        description: { type: "string", description: "A detailed description of the quest." },
        type: { type: "string", enum: ["main", "daily", "side"], description: "The type of quest (main, daily, side)." },
        xpReward: { type: "number", description: "The experience points awarded upon quest completion." },
        priority: { type: "string", enum: ["low", "medium", "high"], description: "The priority level of the quest." },
        estimatedTime: { type: "number", description: "The estimated time in minutes to complete the quest." },
        difficultyLevel: { type: "number", description: "The difficulty level of the quest (1-5)." },
        energyRequired: { type: "string", enum: ["low", "medium", "high"], description: "The energy required for the quest." },
        anxietyLevel: { type: "string", enum: ["comfortable", "challenging", "overwhelming"], description: "The anxiety level associated with the quest." },
        tags: { type: "array", items: { type: "string" }, description: "An array of tags relevant to the quest." }
      },
      required: ["title", "description", "xpReward", "estimatedTime", "type", "priority", "difficultyLevel", "energyRequired", "anxietyLevel"]
    }
  },
  {
    name: "complete_quest",
    description: "Marks an active quest as completed and moves it to completed quests.",
    parameters: {
      type: "object",
      properties: {
        questId: { type: "string", description: "The unique ID of the quest to complete." },
        xpGained: { type: "number", description: "The XP gained from completing the quest." }
      },
      required: ["questId", "xpGained"]
    }
  },
  {
    name: "log_health_activity",
    description: "Logs a health-related activity, updating health and XP.",
    parameters: {
      type: "object",
      properties: {
        activityName: { type: "string", description: "The name of the health activity." },
        healthChange: { type: "number", description: "The change in health points (positive or negative)." },
        xpChange: { type: "number", description: "The change in XP points (positive or negative)." },
        category: { type: "string", enum: ["physical", "mental", "social", "nutrition"], description: "The category of the health activity." },
        duration: { type: "number", description: "The duration of the activity in minutes." },
        description: { type: "string", description: "An optional detailed description of the activity." },
        icon: { type: "string", description: "An optional emoji icon for the activity." }
      },
      required: ["activityName", "healthChange", "xpChange", "category", "duration"]
    }
  },
  {
    name: "get_player_status",
    description: "Retrieves the current status of the player, including health, XP, quests, and streaks.",
    parameters: {
      type: "object",
      properties: {}
    }
  }
];

// Placeholder for global game state (in a real app, this would be persistent storage)
let currentGameState = {
  player: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    currentStreak: 0,
    longestStreak: 0,
    skillPoints: 0
  },
  healthBar: {
    current: 100,
    maximum: 100,
    lastUpdated: new Date().toISOString()
  },
  mainQuest: {
    title: "No Main Quest Set",
    description: "Set your main quest to focus your efforts.",
    isActive: false
  },
  currentSeason: {
    title: "Season 1: The Beginning",
    description: "Start your adventure and build foundational habits.",
    progress: 0
  },
  activeQuests: [],
  completedQuests: 0,
  bonusXPActive: null,
  unlockedAchievements: 0,
  customHealthActivities: 0
};

// Helper to update game state based on function calls with improved error handling
const updateGameState = (functionName, args) => {
  try {
    switch (functionName) {
      case 'set_main_quest':
        if (!args.title || !args.description) {
          throw new Error('Missing required parameters for set_main_quest');
        }
        currentGameState.mainQuest = {
          title: args.title,
          description: args.description,
          isActive: true
        };
        console.log(`Main quest set: ${args.title}`);
        break;
        
      case 'add_quest':
        if (!args.title || !args.description || !args.xpReward || !args.estimatedTime) {
          throw new Error('Missing required parameters for add_quest');
        }
        // ...existing code...
        // Dynamic XP modifier logic
        let xpReward = args.xpReward;
        if (args.tags && args.tags.includes("anxiety")) {
          xpReward = Math.round(xpReward * 1.25);
        }
        // Example: boost XP if user has low energy and quest is medium/high energy
        if (currentGameState.player.energy && currentGameState.player.energy === "low" && ["medium","high"].includes(args.energyRequired)) {
          xpReward = Math.round(xpReward * 1.2);
        }
        const newQuest = {
          id: uuidv4(),
          title: args.title,
          description: args.description,
          type: args.type || 'daily',
          xpReward,
          priority: args.priority || 'medium',
          estimatedTime: args.estimatedTime,
          difficultyLevel: args.difficultyLevel || 2,
          energyRequired: args.energyRequired || 'medium',
          anxietyLevel: args.anxietyLevel || 'comfortable',
          tags: args.tags || [],
          status: "active"
        };
        currentGameState.activeQuests.push(newQuest);
        console.log(`Quest added: ${newQuest.title} (ID: ${newQuest.id})`);
        break;
        
      case 'complete_quest':
        if (!args.questId) {
          throw new Error('Missing questId for complete_quest');
        }
        const questIndex = currentGameState.activeQuests.findIndex(q => q.id === args.questId);
        if (questIndex > -1) {
          const completedQuest = currentGameState.activeQuests.splice(questIndex, 1)[0];
          currentGameState.completedQuests++;
          currentGameState.player.xp += args.xpGained || completedQuest.xpReward;
          // Improved leveling calculation
          currentGameState.player.level = Math.floor(currentGameState.player.xp / currentGameState.player.xpToNextLevel) + 1;
          console.log(`Quest completed: ${completedQuest.title}. XP gained: ${args.xpGained || completedQuest.xpReward}`);
        } else {
          console.warn(`Quest with ID ${args.questId} not found`);
        }
        break;
        
      case 'log_health_activity':
        if (!args.activityName || args.healthChange === undefined || args.xpChange === undefined) {
          throw new Error('Missing required parameters for log_health_activity');
        }
        // ...existing code...
        currentGameState.healthBar.current = Math.min(
          currentGameState.healthBar.maximum, 
          Math.max(0, currentGameState.healthBar.current + args.healthChange)
        );
        currentGameState.healthBar.lastUpdated = new Date().toISOString();
        // Dynamic XP modifier for health activities
        let xpChange = args.xpChange;
        if (args.category === "mental" && args.healthChange > 0) {
          xpChange = Math.round(xpChange * 1.15);
        }
        currentGameState.player.xp += xpChange;
        currentGameState.player.level = Math.floor(currentGameState.player.xp / currentGameState.player.xpToNextLevel) + 1;
        console.log(`Health activity logged: ${args.activityName}. Health change: ${args.healthChange}, XP change: ${xpChange}`);
        break;
        // Update attributes of an active quest
        const questToUpdate = currentGameState.activeQuests.find(q => q.id === args.questId);
        if (!questToUpdate) throw new Error('Quest not found for update');
        if (args.newTitle) questToUpdate.title = args.newTitle;
        if (args.newDescription) questToUpdate.description = args.newDescription;
        if (args.newPriority) questToUpdate.priority = args.newPriority;
        if (args.newEstimatedTime) questToUpdate.estimatedTime = args.newEstimatedTime;
        if (args.newDifficultyLevel) questToUpdate.difficultyLevel = args.newDifficultyLevel;
        if (args.newEnergyRequired) questToUpdate.energyRequired = args.newEnergyRequired;
        if (args.newAnxietyLevel) questToUpdate.anxietyLevel = args.newAnxietyLevel;
        if (args.newTags) questToUpdate.tags = args.newTags;
        console.log(`Quest updated: ${questToUpdate.title} (ID: ${questToUpdate.id})`);
        break;
        // Remove quest by ID
        const removeIndex = currentGameState.activeQuests.findIndex(q => q.id === args.questId);
        if (removeIndex > -1) {
          const removed = currentGameState.activeQuests.splice(removeIndex, 1)[0];
          console.log(`Quest removed: ${removed.title} (ID: ${removed.id})`);
        } else {
          throw new Error('Quest not found for removal');
        }
        break;
        // Suggest quests based on context
        // Example static suggestions, can be replaced with smarter logic
        const suggestions = [];
        if (args.category === "physical") {
          suggestions.push({ title: "Spacer na świeżym powietrzu", difficulty: 1, energyRequired: "low" });
          suggestions.push({ title: "Trening 15 minut", difficulty: 2, energyRequired: "medium" });
        }
        if (args.category === "mental") {
          suggestions.push({ title: "Medytacja 5 minut", difficulty: 1, energyRequired: "low" });
          suggestions.push({ title: "Ćwiczenia oddechowe", difficulty: 1, energyRequired: "low" });
        }
        if (args.category === "social") {
          suggestions.push({ title: "Zadzwoń do przyjaciela", difficulty: 1, energyRequired: "low" });
        }
        if (args.category === "nutrition") {
          suggestions.push({ title: "Przygotuj zdrowy posiłek", difficulty: 2, energyRequired: "medium" });
        }
        // Filter by difficulty, energy, anxiety if provided
        let filtered = suggestions;
        if (args.difficulty) filtered = filtered.filter(s => s.difficulty === args.difficulty);
        if (args.energyLevel) filtered = filtered.filter(s => s.energyRequired === args.energyLevel);
        // Return suggestions in a way Gemini can use
        console.log('Quest suggestions:', filtered);
        // For Gemini, you may want to return this as a text or functionCall result
        break;
        
      case 'get_player_status':
        // This function primarily retrieves, no state update needed
        console.log('Player status requested');
        break;
        
      default:
        console.warn(`Unknown function call: ${functionName}`);
        throw new Error(`Unknown function: ${functionName}`);
    }
  } catch (error) {
    console.error(`Error in updateGameState for function ${functionName}:`, error);
    throw error; // Re-throw to be handled by the calling function
  }
};


// Get the system instruction from the model's configuration
// (This is the instruction provided to the model to guide its behavior)
const getSystemInstruction = (gameState) => {
  const instructions = [
    "Jesteś AI Companienem dla gry RPG zaprojektowanej dla użytkowników z ADHD. Wspierasz użytkownika w zarządzaniu zadaniami i budowaniu produktywności.",

    "**KLUCZOWE: Odpowiadaj w TYM SAMYM JĘZYKU, w którym użytkownik zadał pytanie.**",

    `Aktualny Stan Gry: ${JSON.stringify(gameState, null, 2)}`,

    "**WAŻNE: Używaj dostępnych funkcji do modyfikowania stanu gry:**",
    "- get_player_status: sprawdź status gracza", 
    "- add_quest: dodaj nowe zadanie",
    "- complete_quest: ukończ zadanie",
    "- log_health_activity: zaloguj aktywność zdrowotną",
    "- set_main_quest: ustaw główne zadanie",

    "**Dla żądania typu 'Jaki jest mój status?' - wywołaj funkcję get_player_status**",
    "**Dla żądania typu 'Dodaj quest' - wywołaj funkcję add_quest z odpowiednimi parametrami**",
    "**Dla żądania typu 'Zrobiłem medytację' - wywołaj funkcję log_health_activity**",

    "Jeśli użytkownik prosi o kilka rzeczy naraz, wybierz najważniejszą i wywołaj odpowiednią funkcję.",
  ];
  return instructions.join('\n\n');
};


app.post('/chat', async (req, res) => {
  const { message, gameState, history } = req.body;
  logApiCall("Incoming Chat Request", { message, gameState, history });

  // Update the global game state with the latest from the client
  if (gameState) {
    currentGameState = { ...currentGameState, ...gameState };
  }

  // Retry logic for Gemini API
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries} to call Gemini API...`);
      
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        tools: [{ function_declarations: functionSchemas }], // Pass the function schemas as tools
      });


  // Normalize chat history to Gemini format
  let chatHistory = Array.isArray(history) && history.length > 0
    ? history.map(entry => {
        if (entry.parts && Array.isArray(entry.parts)) {
          // Already in correct format
          return { role: entry.role, parts: entry.parts };
        } else if (typeof entry.text === 'string') {
          // Convert {id, role, text} to {role, parts: [{text}]}
          return { role: entry.role, parts: [{ text: entry.text }] };
        } else {
          // Fallback: skip invalid entries
          return null;
        }
      }).filter(Boolean)
    : [
        { role: "user", parts: [
          { text: `Jesteś moim AI Companionem, zaprojektowanym dla użytkowników z ADHD, aby upraszczać zarządzanie zadaniami i redukować wysiłek poznawczy. Twoim głównym celem jest proaktywne pomaganie mi w organizacji i śledzeniu postępów w grze RPG.

          Zasady Działania:

          1. Działaj proaktywnie i minimalizuj interakcje: Jeśli Twoje narzędzia pozwalają na wykonanie prośby użytkownika (np. add_quest, log_health_activity, set_main_quest), wykonaj je natychmiast, uzupełniając brakujące parametry sensownymi wartościami domyślnymi, jeśli użytkownik ich nie podał.
          Przykłady domyślnych wartości (dla add_quest):
          type: daily (jeśli nie wskazano inaczej)
          estimatedTime: 15 (jeśli nie wskazano inaczej, w minutach)
          difficultyLevel: 2 (jeśli nie wskazano inaczej)
          xpReward: estimatedTime (w minutach) lub 15 (jeśli czas nie jest podany)
          energyRequired: medium (jeśli nie wskazano inaczej)
          anxietyLevel: comfortable (jeśli nie wskazano inaczej)
          tags: Wnioskuj na podstawie tytułu/opisu.
          NIE pytaj o potwierdzenie po uzupełnieniu wartości. Po prostu wykonaj zadanie i poinformuj o tym użytkownika.
          NIE pytaj o to, czy dodać jako osobne questy, jeśli użytkownik prosi o kilka rzeczy. Zawsze dodawaj jako osobne questy, chyba że kontekst jasno wskazuje na jedno złożone zadanie.` }
        ] }
      ];

  // Ensure first entry is always 'user' (Gemini API requirement)
  while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
    chatHistory.shift();
  }
  // If after shifting, no 'user' entry, add a default one
  if (chatHistory.length === 0) {
    chatHistory.push({ role: 'user', parts: [{ text: message || '' }] });
  }

      const chat = model.startChat({
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 1
        },
        history: chatHistory
      });

      const result = await chat.sendMessage(message);
      const response = result.response;


      // Zawsze loguj całą odpowiedź Gemini, nawet jeśli jest pusta lub nieoczekiwana
      console.log("[Gemini Raw Response]", JSON.stringify(response, null, 2));
      logApiCall("Raw Gemini Response", response);

      // Check if Gemini wants to call a function - improved handling
      console.log('Checking response for function calls...');
      console.log('response.functionCall type:', typeof response.functionCall);
      console.log('response.candidates:', response.candidates);
      
      // Check if response contains function calls in candidates
      const functionCalls = response.candidates?.[0]?.content?.parts?.filter(part => part.functionCall);
      console.log('Found function calls:', functionCalls);
      
      if (functionCalls && functionCalls.length > 0) {
        const functionCall = functionCalls[0].functionCall;
        const name = functionCall.name;
        const args = functionCall.args;
        console.log('Gemini requested function call:', name, 'with args:', args);

        // Execute the function on the server side
        updateGameState(name, args);

        // Return the function call back to the client so the UI can update
        return res.json({
          functionCall: {
            name: name,
            arguments: args
          },
          text: "" // No text response when a function is called
        });
      } else if (typeof response === 'string') {
        // If Gemini returns a plain string, treat it as text
        return res.json({
          text: response,
          functionCall: null
        });
      } else if (response && typeof response.text === 'function') {
        // If Gemini provides a text() method, use it
        return res.json({
          text: response.text(),
          functionCall: null
        });
      } else if (response && typeof response.text === 'string') {
        // If Gemini provides a text property (not a function), use it
        return res.json({
          text: response.text,
          functionCall: null
        });
      } else {
        // Fallback for unexpected or empty responses
        console.warn("Unexpected or empty response format from Gemini:", response);
        return res.json({
          text: "Przepraszam, nie otrzymałem odpowiedzi od AI. Spróbuj ponownie lub zmień zapytanie.",
          functionCall: null
        });
      }
    } catch (error) {
      console.error('Attempt', attempt, 'failed:', error.message);
      if (error.status === 503 && attempt < maxRetries) {
        console.log('Retrying in', retryDelay, 'ms...');
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      console.error('Error processing chat request:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        errorDetails: error.errorDetails
      });
      
      // Return more detailed error information for debugging
      let errorMessage = 'Failed to process chat request. Please try again.';
      if (error.status === 503) {
        errorMessage = 'Gemini API is temporarily overloaded. Please try again in a few moments.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request format. Please check the function schemas.';
      }
      
      return res.status(500).json({
        error: errorMessage,
        message: error.message,
        status: error.status,
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.errorDetails 
        })
      });
    }
  }
});

// Server status endpoint

// Root endpoint for health/info
app.get('/', (req, res) => {
  res.status(200).send('<h2>RPG ADHD API is running 🚀</h2><p>Endpoints: /status, /chat, /gameState</p>');
});

app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Server is running and healthy!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint to get the current game state (for client sync/debug)
app.get('/gameState', (req, res) => {
  console.log('GameState endpoint called');
  res.json({
    ...currentGameState,
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log('=== RPG ADHD Server Started ===');
  console.log('Server listening on port', port);
  console.log('Status endpoint: http://localhost:' + port + '/status');
  console.log('GameState endpoint: http://localhost:' + port + '/gameState');
  console.log('Chat endpoint: http://localhost:' + port + '/chat');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('CORS: Allow all origins (development mode)');
  console.log('================================');
});
