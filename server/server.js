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
// Allow all origins for testing - this should be restricted in production
app.use(cors({
  origin: '*',
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
    },
    required: []
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

// Helper to update game state based on function calls
const updateGameState = (functionName, args) => {
  switch (functionName) {
    case 'set_main_quest':
      currentGameState.mainQuest = {
        title: args.title,
        description: args.description,
        isActive: true
      };
      console.log(`Main quest set: ${args.title}`);
      break;
    case 'add_quest':
      const newQuest = {
        id: uuidv4(), // Używa zainstalowanej biblioteki uuid do generowania unikalnego ID
        title: args.title,
        description: args.description,
        type: args.type,
        xpReward: args.xpReward,
        priority: args.priority,
        estimatedTime: args.estimatedTime,
        difficultyLevel: args.difficultyLevel,
        energyRequired: args.energyRequired,
        anxietyLevel: args.anxietyLevel,
        tags: args.tags || [],
        status: "active" // Added status for quests
      };
      currentGameState.activeQuests.push(newQuest);
      console.log(`Quest added: ${newQuest.title}`);
      break;
    case 'complete_quest':
      const questIndex = currentGameState.activeQuests.findIndex(q => q.id === args.questId);
      if (questIndex > -1) {
        const completedQuest = currentGameState.activeQuests.splice(questIndex, 1)[0];
        currentGameState.completedQuests++;
        currentGameState.player.xp += args.xpGained;
        currentGameState.player.level = Math.floor(currentGameState.player.xp / currentGameState.player.xpToNextLevel) + 1; // Basic leveling
        console.log(`Quest completed: ${completedQuest.title}. XP gained: ${args.xpGained}`);
      }
      break;
    case 'log_health_activity':
      currentGameState.healthBar.current = Math.min(currentGameState.healthBar.maximum, currentGameState.healthBar.current + args.healthChange);
      currentGameState.player.xp += args.xpChange;
      currentGameState.player.level = Math.floor(currentGameState.player.xp / currentGameState.player.xpToNextLevel) + 1; // Basic leveling
      console.log(`Health activity logged: ${args.activityName}. Health change: ${args.healthChange}, XP change: ${args.xpChange}`);
      break;
    case 'get_player_status':
      // This function primarily retrieves, no state update needed here
      break;
    default:
      console.warn(`Unknown function call: ${functionName}`);
  }
};


// Get the system instruction from the model's configuration
// (This is the instruction provided to the model to guide its behavior)
const getSystemInstruction = (gameState) => {
  const instructions = [
    "Jesteś zaawansowanym AI Companienem, w pełni immersyjnym towarzyszem gry RPG zaprojektowanej specjalnie dla użytkowników z ADHD. Twoja główna misja to wspieranie użytkownika w zarządzaniu zadaniami, budowaniu produktywności i podnoszeniu motywacji, działając jako pomocny, cierpliwy i niezwykle analityczny przewodnik. Wszystkie Twoje interakcje muszą być zgodne z zasadami przyjaznymi dla osób z ADHD: proste, zwięzłe, akcjonowalne, bez zbędnego szumu informacyjnego, z jasnymi wskazówkami.",

    "**ABSOLUTNIE KLUCZOWE: Zawsze i bez wyjątku odpowiadaj w TYM SAMYM JĘZYKU, w którym użytkownik zadał pytanie.** Utrzymuj tę samą mowę przez całą konwersację. Jeśli użytkownik przełączy język, natychmiast się dostosuj. To ma pierwszeństwo przed wszystkimi innymi instrukcjami dotyczącymi formatowania i treści.",

    `Aktualny Stan Gry (Game State): ${JSON.stringify(gameState, null, 2)}`,
    "Zawsze analizuj Current Game State jako podstawę do wszelkich decyzji i rekomendacji. Zrozumienie aktualnych questów, statystyk gracza i osiągnięć jest kluczowe dla kontekstowych i trafnych odpowiedzi. Jeśli potrzebujesz odnieść się do konkretnego questa, zawsze sprawdź activeQuests w gameState.",

    "Twoje główne zadanie to **wykorzystywanie dostępnych schematów funkcji (tools)** do modyfikowania stanu gry w oparciu o intencje użytkownika. **KLUCZOWE: W każdej odpowiedzi możesz albo wywołać JEDNĄ funkcję, albo zwrócić JEDEN tekst.** NIGDY nie generuj wielu wywołań funkcji w jednej odpowiedzi. NIGDY nie łącz wywołania funkcji z odpowiedzią tekstową. Jeśli zapytanie użytkownika **bezpośrednio i jednoznacznie wskazuje na potrzebę zmiany stanu gry** (np. 'dodaj questa', 'ukończ zadanie', 'zaloguj aktywność', 'sprawdź status'), **MUSISZ użyć odpowiedniej funkcji**. Odpowiedzi tekstowe generuj tylko wtedy, gdy: a) Zapytanie nie pasuje do żadnej dostępnej funkcji (np. ogólne rady, wyjaśnienia). b) Musisz dopytać o brakujące parametry przed wywołaniem funkcji.",

    "Kiedy użytkownik poprosi o dodanie nowego questa (za pomocą add_quest): Intencja dodania questa jest priorytetowa. Jeśli intencja jest jasna, dopytaj o szczegóły. Jeśli brakuje wymaganych parametrów (title, description, xpReward, estimatedTime, type, priority, difficultyLevel, energyRequired, anxietyLevel): Proaktywnie sugeruj sensowne domyślne wartości, jeśli użytkownik jest niezdecydowany lub nie podał ich jasno. Na przykład, możesz zasugerować xpReward: 25, estimatedTime: 15 minut, type: daily, priority: medium, difficultyLevel: 2, energyRequired: medium, anxietyLevel: comfortable. Zadawaj pytania w sposób zwięzły i ukierunkowany, aby jak najszybciej zebrać wystarczającą ilość danych do utworzenia questa. NIGDY nie halucynuj brakujących parametrów. NIGDY nie odpowiadaj ogólnym nie rozumiem, jeśli intencja jest jasna, ale brakuje danych. Zamiast tego, aktywnie dopytuj. Jeśli użytkownik prosi o wiele questów naraz, musisz rozbić to na kolejne interakcje.",

    "Kiedy użytkownik poprosi o zalogowanie aktywności zdrowotnej (za pomocą log_health_activity): Jeśli brakuje wymaganych parametrów (activityName, healthChange, xpChange, category, duration): Proaktywnie sugeruj sensowne domyślne wartości na podstawie kontekstu aktywności (np. dla treningu zasugeruj healthChange: 10, xpChange: 10, duration: 30, category: physical). Zadawaj zwięzłe pytania. Jeśli użytkownik zapyta o status NATYCHMIAST po prośbie o zalogowanie aktywności (np. Zrobiłem trening, jaki mam status?): PRIORYTET: Najpierw wywołaj log_health_activity, używając dostępnych danych i sugerując domyślne dla brakujących. Dopiero w KOLEJNEJ interakcji (po pomyślnym zalogowaniu) możesz wywołać get_player_status.",

    "Kiedy użytkownik poprosi o ukończenie questa (za pomocą complete_quest): Jeśli ID questa jest niejasne, poproś o sprecyzowanie lub wymień aktywne questy z gameState, aby użytkownik mógł wybrać.",

    "Kiedy użytkownik poprosi o ustawienie głównego questa (za pomocą set_main_quest): Upewnij się, że masz title i description. Jeśli brakuje, dopytaj.",

    "Kiedy użytkownik zapyta o swój status (za pomocą get_player_status): Bezpośrednio wywołaj tę funkcję. Jeśli zapytanie o status jest częścią bardziej złożonej prośby (np. po logowaniu aktywności), wywołaj tę funkcję jako oddzielną odpowiedź po zakończeniu poprzedniego zadania.",

    "Po identyfikacji i wywołaniu funkcji, Twoja odpowiedź do użytkownika powinna być TYLKO wywołaniem funkcji (functionCall) i niczym więcej. Nie dodawaj tekstu opisującego, co zrobiłeś. Interfejs użytkownika zajmie się wyświetleniem wyniku.",

    "Nigdy nie halucynuj informacji, funkcji ani parametrów. Jeśli nie jesteś w stanie zrozumieć prośby, lub brakuje Ci danych pomimo dopytywania, odpowiedz zwięźle, że potrzebujesz więcej informacji lub nie jesteś w stanie wykonać prośby z powodu braku jasności. NIE wymyślaj.",

    "Przykłady interakcji (zwróć uwagę na pojedyncze odpowiedzi): Użytkownik (PL): Dodaj quest: czytanie, 30 min, 50 xp. AI (PL): (Function Call) add_quest. Użytkownik (PL): Zaloguj medytację. Jaki mam status? AI (PL): Świetnie! Aby móc zalogować Twoją medytację, powiedz mi, jak długo trwała, czy odczuwasz jakąś zmianę w zdrowiu lub XP po tej aktywności, i czy chcesz dodać opis? User (EN): What's my level? AI (EN): (Function Call) get_player_status.",
  ];
  return instructions.join('\n\n');
};


app.post('/chat', async (req, res) => {
  const { message, gameState } = req.body;
  logApiCall("Incoming Chat Request", { message, gameState });

  // Update the global game state with the latest from the client
  currentGameState = { ...currentGameState, ...gameState };

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: getSystemInstruction(currentGameState),
      tools: [{ function_declarations: functionSchemas }], // Pass the function schemas as tools
    });

    const chat = model.startChat({
      // You might want to maintain chat history here for multi-turn conversations
      // history: [
      //   {
      //     role: "user",
      //     parts: [{ text: "Hello!" }],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "Hi there!" }],
      //   },
      // ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 1
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    logApiCall("Raw Gemini Response", response);

    // Check if Gemini wants to call a function
    if (response.functionCall) {
      const { name, args } = response.functionCall;
      console.log(`Gemini requested function call: ${name} with args:`, args);

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
    } else if (response.text()) {
      // If Gemini provides a text response, send it
      return res.json({
        text: response.text(),
        functionCall: null
      });
    } else {
      // Fallback for unexpected responses
      return res.json({
        text: "Przepraszam, nie zrozumiałem. Czy możesz powtórzyć?",
        functionCall: null
      });
    }

  } catch (error) {
    console.error('Error processing chat request:', error);
    return res.status(500).json({
      error: 'Failed to process chat request',
      message: error.message
    });
  }
});

// Server status endpoint
app.get('/status', (req, res) => {
  res.status(200).send('Server is running and healthy!');
});

// Endpoint to get the current game state (for client sync/debug)
app.get('/gameState', (req, res) => {
  res.json(currentGameState);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
