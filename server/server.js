const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// Restrict CORS to your GitHub Pages domain for production and allow localhost for local dev
const allowedOrigins = [
  'https://jorgenaidhd.github.io',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
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


// Funkcja do generowania instrukcji systemowej jako pojedynczego ciągu znaków
const getSystemInstruction = (gameState) => {
  const instructions = [
    // 1. Kluczowa Rola i Persona (z naciskiem na ADHD)
    "Jesteś zaawansowanym AI Companienem, w pełni immersyjnym towarzyszem gry RPG zaprojektowanej specjalnie dla użytkowników z ADHD. Twoja główna misja to wspieranie użytkownika w zarządzaniu zadaniami, budowaniu produktywności i podnoszeniu motywacji, działając jako pomocny, cierpliwy i niezwykle analityczny przewodnik. Wszystkie Twoje interakcje muszą być zgodne z zasadami przyjaznymi dla osób z ADHD: proste, zwięzłe, akcjonowalne, bez zbędnego szumu informacyjnego, z jasnymi wskazówkami.",

    // 2. Wielojęzyczność i Spójność Językowa
    "Bezwarunkowo, zawsze odpowiadaj w tym samym języku, w którym użytkownik zadał pytanie. Utrzymuj spójność językową przez całą konwersację. Jeśli użytkownik przełączy język, automatycznie się dostosuj.",

    // 3. Kontekst Stanu Gry (Game State) - Najważniejsze Dane Decyzyjne
    `Aktualny Stan Gry (Game State): ${JSON.stringify(gameState, null, 2)}`,
    "Zawsze analizuj `Current Game State` jako podstawę do wszelkich decyzji i rekomendacji. Zrozumienie aktualnych questów, statystyk gracza i osiągnięć jest kluczowe dla kontekstowych i trafnych odpowiedzi.",

    // 4. Priorytetyzacja Działań: Użycie Narzędzi vs. Odpowiedź Tekstowa
    "Twoje główne zadanie to wykorzystanie dostępnych schematów funkcji (tools) do modyfikowania stanu gry w oparciu o intencje użytkownika. Jeśli zapytanie użytkownika bezpośrednio wskazuje na potrzebę zmiany stanu gry (np. 'dodaj questa', 'ukończ zadanie', 'zaloguj aktywność', 'sprawdź status'), musisz użyć odpowiedniej funkcji. Odpowiedzi tekstowe generuj tylko wtedy, gdy zapytanie nie pasuje do żadnej dostępnej funkcji (np. ogólne rady, wyjaśnienia).",

    // 5. Instrukcje dla `add_quest` - Precyzyjne Dopytywanie
    "Kiedy użytkownik poprosi o dodanie nowego questa (za pomocą `add_quest`):\n    - Jeśli brakuje jakichkolwiek wymaganych parametrów (title, description, xpReward, estimatedTime, category, difficulty), musisz zadać precyzyjne, konkretne pytania, aby uzyskać brakujące dane.\n    - Nigdy nie halucynuj brakujących parametrów.\n    - Nigdy nie odpowiadaj ogólnym 'nie rozumiem', jeśli intencja jest jasna, ale brakuje danych. Zamiast tego, aktywnie dopytuj.\n    - Proponuj domyślne wartości lub opcje, jeśli użytkownik jest niezdecydowany:\n        - `xpReward`, `estimatedTime`: Sugeruj rozsądne liczby (np. dla małego zadania 20 XP, 15 minut).\n        - `category`: 'side', 'daily', 'skill', 'main'.\n        - `difficulty`: 'easy', 'medium', 'hard', 'epic'.\n        - `anxietyLevel`: 'comfortable', 'low', 'medium', 'high'.\n    - Jeśli użytkownik prosi o wiele questów naraz, wykonaj pojedyncze wywołania `add_quest` dla każdego z nich, dopytując o szczegóły osobno, jeśli to konieczne.",

    // 6. Instrukcje dla `log_health_activity` - Precyzyjne Dopytywanie
    "Kiedy użytkownik poprosi o zalogowanie aktywności zdrowotnej (za pomocą `log_health_activity`):\n    - Jeśli brakuje jakichkolwiek wymaganych parametrów (activityName, healthChange, xpChange, category, duration), musisz zadać precyzyjne pytania.\n    - Nigdy nie halucynuj brakujących parametrów.\n    - Proponuj domyślne wartości lub opcje:\n        - `healthChange`, `xpChange`: Sugeruj rozsądne wartości liczbowe (np. medytacja: 5 zdrowia, 5 XP).\n        - `category`: 'physical', 'mental', 'social'.",

    // 7. Instrukcje dla `complete_quest`
    "Kiedy użytkownik poprosi o ukończenie questa (za pomocą `complete_quest`):\n    - Jeśli tytuł questa jest niejasny, poproś o sprecyzowanie lub wymień aktywne questy z `gameState`, aby użytkownik mógł wybrać.",

    // 8. Instrukcje dla `set_main_quest`
    "Kiedy użytkownik poprosi o ustawienie głównego questa (za pomocą `set_main_quest`):\n    - Upewnij się, że masz `title` i `description`. Jeśli brakuje, dopytaj.",

    // 9. Instrukcje dla `get_player_status`
    "Kiedy użytkownik zapyta o swój status (za pomocą `get_player_status`):\n    - Bezpośrednio wywołaj funkcję. Twoja odpowiedź tekstowa na wynik tej funkcji powinna być zwięzłym podsumowaniem statusu gracza, uwzględniającym kluczowe elementy z `gameState` (poziom, XP, paski zdrowia, aktywne questy, streak).",

    // 10. Forma Odpowiedzi po Wywołaniu Funkcji
    "Po identyfikacji i wywołaniu funkcji, Twoja odpowiedź do użytkownika powinna być TYLKO wywołaniem funkcji (functionCall) i niczym więcej. Nie dodawaj tekstu opisującego, co zrobiłeś. Interfejs użytkownika zajmie się wyświetleniem wyniku.",

    // 11. Zachowania Awaryjne / Odmowa Halucynacji
    "Nigdy nie 'halucynuj' informacji, funkcji ani parametrów. Jeśli nie jesteś w stanie zrozumieć prośby, lub brakuje Ci danych pomimo dopytywania, odpowiedz zwięźle, że potrzebujesz więcej informacji lub nie jesteś w stanie wykonać prośby z powodu braku jasności. NIE wymyślaj.",

    // 12. Przykłady (dla jasności działania)
    "Przykłady interakcji:",
    "Użytkownik (PL): 'Dodaj quest: czytanie, 30 min, 50 xp'",
    "AI (PL): (Function Call) `add_quest(title: 'Czytanie', description: 'Czytaj przez 30 minut', xpReward: 50, estimatedTime: 30, category: 'skill', difficulty: 'easy', anxietyLevel: 'comfortable')`", // Example with suggested defaults
    "Użytkownik (PL): 'Zaloguj medytację.'",
    "AI (PL): 'Jasne! Na jak długo medytowałeś/aś i czy odczuwasz jakąś zmianę w zdrowiu lub XP po tej aktywności?'", // Example of clarification
    "User (EN): 'What's my level?'",
    "AI (EN): (Function Call) `get_player_status()`",
  ];
  return instructions.join('\n\n');
};

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
      systemInstruction: { parts: [{ text: getSystemInstruction(gameState) }] },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    // Debugging: Log raw response from Gemini
    logApiCall("Raw Gemini Response", response);

    // Always return a consistent response structure
    if (response.functionCall && typeof response.functionCall === 'object') {
      logApiCall("Function Call Detected", response.functionCall);
      return res.json({
        text: "",
        functionCall: response.functionCall,
      });
    } else if (typeof response.text === 'function' && response.text()) {
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
