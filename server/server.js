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

// Function schemas for Gemini function calling (expanded)
const functionSchemas = [
  {
    name: "set_main_quest",
    description: "Updates the main quest with a new title and description",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "New title for the main quest" },
        description: { type: "string", description: "New description for the main quest" },
      },
      required: ["title", "description"],
    },
  },
  {
    name: "add_quest",
    description: "Adds a new quest for the player",
    parameters: {
      type: "object",
      properties: {
        title: { type: "string", description: "Title of the quest" },
        description: { type: "string", description: "Detailed description of the quest" },
        xpReward: { type: "number", description: "Experience points awarded upon completion" },
        estimatedTime: { type: "number", description: "Estimated time in minutes to complete the quest" },
        category: { type: "string", description: "Category of the quest (e.g., 'main', 'side', 'daily', 'skill')" },
        difficulty: { type: "string", description: "Difficulty of the quest (e.g., 'easy', 'medium', 'hard', 'epic')" },
        anxietyLevel: { type: "string", description: "Perceived anxiety level for the quest (e.g., 'low', 'medium', 'high', 'comfortable')" },
        tags: { type: "array", items: { type: "string" }, description: "Relevant tags for the quest" },
      },
      required: ["title", "description", "xpReward", "estimatedTime", "category", "difficulty"],
    },
  },
  {
    name: "complete_quest",
    description: "Marks a quest as complete, identifying it by its title",
    parameters: {
      type: "object",
      properties: {
        questTitle: { type: "string", description: "The exact title of the quest to be completed" },
      },
      required: ["questTitle"],
    },
  },
  {
    name: "log_health_activity",
    description: "Logs a health-related activity and applies changes to player health and XP",
    parameters: {
      type: "object",
      properties: {
        activityName: { type: "string", description: "Name of the health activity (e.g., 'meditation', 'workout')" },
        healthChange: { type: "number", description: "Change in health points (positive for healing, negative for damage)" },
        xpChange: { type: "number", description: "Change in XP points (positive for gain, negative for loss)" },
        category: { type: "string", description: "Category of the activity (e.g., 'physical', 'mental', 'social')" },
        duration: { type: "number", description: "Duration of the activity in minutes" },
        description: { type: "string", description: "Brief description of the activity" },
        icon: { type: "string", description: "Emoji icon representing the activity" },
      },
      required: ["activityName", "healthChange", "xpChange", "category", "duration"],
    },
  },
  {
    name: "get_player_status",
    description: "Retrieves the current status of the player, including level, XP, health, streak, active quests, and main quest.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// Custom system instruction parts for Gemini
const customParts = (gameState) => [
  { text: "You are an AI game companion for an RPG-themed productivity app designed to help users with ADHD. Your primary goal is to help the user manage their quests and activities, provide motivational support, and offer status updates. Always respond in character as a helpful and encouraging companion." },
  { text: `Current Game State: ${JSON.stringify(gameState, null, 2)}` },
  { text: "Your available tools are defined by the function schemas. Use these tools to update the game state based on user requests. If a user asks to add, complete, or modify a quest or log a health activity, use the appropriate function call. If a user asks for their status, use the 'get_player_status' function." },
  { text: "When asked to create new quests, if the user doesn't specify all parameters for `add_quest` (like xpReward, estimatedTime, category, difficulty, anxietyLevel), ask clarifying questions to get the necessary details. For `xpReward` and `estimatedTime`, suggest reasonable numerical defaults if the user is unsure. For `category`, suggest 'side', 'daily', or 'skill'. For `difficulty`, suggest 'easy', 'medium', or 'hard'. For `anxietyLevel`, suggest 'comfortable', 'low', 'medium', or 'high'. If the user asks for multiple quests, call `add_quest` for each one." },
  { text: "When asked to log health activities, if the user doesn't specify all parameters for `log_health_activity` (like healthChange, xpChange, category, duration), ask clarifying questions. For `healthChange` and `xpChange`, suggest reasonable numerical defaults based on the activity. For `category`, suggest 'physical', 'mental', or 'social'. For `duration`, suggest a reasonable number." },
  { text: "If the user asks to complete a quest, use the `complete_quest` function. If the exact quest title is unclear, ask for clarification or provide a list of active quests for them to choose from." },
  { text: "If the user asks for general help or information not covered by direct function calls, provide a helpful text response based on the game context." },
  { text: "When a function is called, your response should be a function call, not a text response describing what you've done." },
  { text: "Example: User: 'Add a new quest to read a book.' AI: functionCall: {name: 'add_quest', arguments: {title: 'Read a book', description: 'Read a fantasy novel for 30 minutes', xpReward: 50, estimatedTime: 30, category: 'skill', difficulty: 'easy', anxietyLevel: 'comfortable', tags: ['reading', 'learning']}}" },
  { text: "Example: User: 'I meditated for 15 minutes.' AI: functionCall: {name: 'log_health_activity', arguments: {activityName: 'Meditation', healthChange: 5, xpChange: 5, category: 'mental', duration: 15, description: 'Mindfulness session', icon: '🧘'}}" },
  { text: "Example: User: 'What's my status?' AI: functionCall: {name: 'get_player_status', arguments: {}}" },
];

// Chat endpoint to process messages via Gemini API
app.post('/chat', async (req, res) => {
  const { message, gameState } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Debugging: Log incoming message and game state
  logApiCall("Incoming Chat Request", { message, gameState });

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ function_declarations: functionSchemas }],
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
      },
      systemInstruction: customParts(gameState).map(p => p.text).join("\n\n"),
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    // Debugging: Log raw response from Gemini
    logApiCall("Raw Gemini Response", response);

    // Check for function call
    if (response.functionCall) {
      logApiCall("Function Call Detected", response.functionCall);
      return res.json({
        text: "",
        functionCall: response.functionCall,
      });
    } else if (response.text()) {
      logApiCall("Text Response Detected", response.text());
      return res.json({
        text: response.text(),
        functionCall: null,
      });
    } else {
      // No function call or text
      console.warn("Gemini returned no function call and no text response.");
      return res.json({
        text: "I couldn't process your request. Could you please rephrase it or try something else?",
        functionCall: null,
      });
    }

  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({
      error: 'Failed to process chat request from Gemini API',
      message: error.message,
      details: error.stack,
    });
  }
});

// Server status endpoint
app.get('/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start the server
// Listen on all network interfaces for LAN/mobile access
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port} (all interfaces)`);
});
