import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Send, Loader, Brain } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

/**
 * AICompanion Component
 * 
 * A local AI assistant that processes user commands and dispatches actions to the GameContext.
 * Uses the aiCompanion utility for natural language processing of commands.
 */
const AICompanion = () => {
  const AI_SERVER_PORT = 3001; // Port, na którym nasłuchuje Twój serwer AI

  // Determine the AI server URL based on the environment
  // In a deployed environment (e.g., GitHub Pages), REACT_APP_AI_SERVER_URL will be set to your PC's local IP.
  // In a local development environment, it will default to localhost.
  const serverUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_AI_SERVER_URL
    : `http://localhost:3001`;
  console.log(`AI Companion connecting to: ${serverUrl}`);
  const { state, actions } = useGame();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companionResponse, setCompanionResponse] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Check server status on component mount and periodically
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await axios.get(`${serverUrl}/status`);
        setServerStatus('connected');
        // Usuń błąd związany z brakiem połączenia, jeśli był wyświetlany
        const errorDiv = document.querySelector('.error-message');
        if (errorDiv && errorDiv.textContent?.includes('server')) {
          errorDiv.textContent = '';
        }
      } catch (err: any) {
        console.error("Error connecting to server:", err);
        setServerStatus('error');
        toast.error(
          "Nie można połączyć z serwerem AI", 
          { 
            description: "Uruchom plik start-server.bat lub wykonaj komendę 'npm start' w folderze server.", 
            duration: 6000,
            action: {
              label: "Rozumiem",
              onClick: () => {},
            }
          }
        );
      }
    };
    
    // Sprawdź status natychmiast
    checkServerStatus();
    
    // A potem co 15 sekund sprawdzaj ponownie
    const intervalId = setInterval(checkServerStatus, 15000);
    
    // Cleanup przy odmontowaniu komponentu
    return () => clearInterval(intervalId);
  }, []);

  // Funkcja do wzbogacania odpowiedzi AI o motywacyjne zwroty dla ADHD
  const enhanceAIResponse = (response: string): string => {
    // Don't modify error messages
    if (response.startsWith('⚠️')) return response;
    
    // Check if the response already contains ADHD-friendly elements
    const adhdfriendlyPatterns = [
      'ADHD', 'mikro-zadani', 'krótk', 'focus', 'skupi', 'krok', 'przerw',
      'dopamin', 'nagrad', 'success', 'sukces', 'wygran', 'win', 'momentum',
      'streak', 'ciąg', 'konsekwencj'
    ];
    
    const alreadyEnhanced = adhdfriendlyPatterns.some(pattern => 
      response.toLowerCase().includes(pattern.toLowerCase())
    );
    
    // If response is already enhanced, return it unchanged
    if (alreadyEnhanced) {
      return response;
    }
    
    // ADHD-friendly phrases (general productivity tips)
    const adhdfriendlyPhrases = [
      "\n\n💡 **ADHD-friendly wskazówka:** Pamiętaj, żeby rozbić to na mniejsze, konkretne kroki!",
      "\n\n💡 **ADHD-friendly wskazówka:** Ustaw timer na 25 minut i skupiaj się tylko na jednej rzeczy.",
      "\n\n💡 **ADHD-friendly wskazówka:** Każdy mały postęp to zwycięstwo - celebruj je!",
      "\n\n💡 **ADHD-friendly wskazówka:** Zacznij od zadania, które zajmie Ci tylko 5 minut.",
      "\n\n💡 **ADHD-friendly wskazówka:** Twórz zewnętrzne przypomnienia - zapiski, alarmy, kolorowe naklejki.",
      "\n\n💡 **ADHD-friendly wskazówka:** Eksperymentuj z różnymi metodami pracy - znajdź tę, która działa dla Ciebie.",
      "\n\n💡 **ADHD-friendly wskazówka:** Próbuj techniki \"body doubling\" - pracuj równolegle z kimś innym lub włącz timer fokusowania.",
      "\n\n💡 **ADHD-friendly wskazówka:** Jeśli czujesz się przytłoczony/a, zrób krótką przerwę - ruch fizyczny pomaga zresetować umysł!",
      "\n\n💡 **ADHD-friendly wskazówka:** Planując zadania, zawsze dodaj 50% więcej czasu niż myślisz, że potrzebujesz."
    ];
    
    // Streak-related encouragements
    const streakPhrases = [
      "\n\n🔥 **Streak tip:** Pamiętaj, że codzienna aktywność buduje Twój streak - nawet mały postęp się liczy!",
      "\n\n🔥 **Streak insight:** Utrzymanie dziennego streaku to jedna z najskuteczniejszych strategii dla mózgu z ADHD!",
      "\n\n🔥 **Streak motywacja:** Im dłuższy Twój streak, tym większe bonusy XP będziesz otrzymywać za swoje działania!",
      "\n\n🔥 **Streak wyzwanie:** Sprawdź, jak długi streak możesz utrzymać - to świetny sposób na budowanie konsekwencji!",
      "\n\n🔥 **Streak korzyść:** Dzienny streak to wizualny dowód Twojego zaangażowania - śledź go i bądź z niego dumny!"
    ];
    
    // Neuroscience insights for ADHD
    const neurosciencePhrases = [
      "\n\n🧠 **Neuro-insight:** Twój mózg z ADHD potrzebuje częstszej stymulacji układu nagrody - dlatego krótkie zadania z szybką nagrodą działają najlepiej!",
      "\n\n🧠 **Neuro-insight:** Regularne działania (jak codzienny streak) tworzą silniejsze połączenia neuronowe, które pomagają w budowaniu nawyków!",
      "\n\n🧠 **Neuro-insight:** Osoby z ADHD mają często trudność z wewnętrzną motywacją - zewnętrzne systemy jak ten licznik streaka są dlatego tak pomocne!",
      "\n\n🧠 **Neuro-insight:** Nawet dla neurotypowego mózgu nawyk tworzy się średnio w 66 dni - bądź cierpliwy/a i śledź swój streak!"
    ];
    
    // Different types of responses based on content
    if (response.toLowerCase().includes('ukończy') || 
        response.toLowerCase().includes('complet') || 
        response.toLowerCase().includes('done') ||
        response.toLowerCase().includes('zadanie')) {
      // Task completion responses
      const completionPhrases = [
        "\n\n🎯 **Osiągnięcie:** Wspaniale! Każde ukończone zadanie to dowód Twojej skuteczności i +1 do dziennego streaka!",
        "\n\n🎯 **Progress:** Brawo za ukończenie! Pamiętaj, że konsekwentne działania budują najsilniejszy streak!"
      ];
      return response + completionPhrases[Math.floor(Math.random() * completionPhrases.length)];
    }
    
    // Randomly choose between different types of enhancements
    const randomValue = Math.random();
    if (randomValue < 0.4) {
      // 40% chance for regular ADHD tip
      return response + adhdfriendlyPhrases[Math.floor(Math.random() * adhdfriendlyPhrases.length)];
    } else if (randomValue < 0.7) {
      // 30% chance for streak encouragement
      return response + streakPhrases[Math.floor(Math.random() * streakPhrases.length)];
    } else {
      // 30% chance for neuroscience insight
      return response + neurosciencePhrases[Math.floor(Math.random() * neurosciencePhrases.length)];
    }
  };

  // Type definition for function calls from Gemini API is handled by the response

  // Process the user's command via the backend server
  const processCommand = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setCompanionResponse(null);
    
    // Najpierw sprawdź, czy to prosta komenda dotycząca UI
    const isUICommand = handleUISettingCommand(input);
    if (isUICommand) {
      setIsLoading(false);
      setInput('');
      return;
    }
    
    // Sprawdź czy to komenda przypomnienia
    const isReminderCommand = handleReminderRequest(input);
    if (isReminderCommand) {
      setIsLoading(false);
      setInput('');
      return;
    }
    
    // Następnie sprawdź, czy użytkownik wykazuje negatywne emocje
    const isNegativeEmotion = detectNegativeSentiment(input);
    if (isNegativeEmotion) {
      setIsLoading(false);
      setInput('');
      return;
    }
    
    // Sprawdź, czy użytkownik prosi o trudne zadanie - w takim przypadku zasugeruj podział na mniejsze kroki
    const isDifficultTaskRequest = detectDifficultTaskRequest(input);
    if (isDifficultTaskRequest) {
      setIsLoading(false);
      setInput('');
      return;
    }
    
    try {
      // Przygotuj podsumowanie stanu gry do wysłania do LLM
      // Filtruj aktywne questy, aby LLM nie mylił ich z ukończonymi
      const activeQuests = state.quests.filter(q => q.status === 'active');
      const completedQuests = state.quests.filter(q => q.status === 'completed');
      
      const gameStateSummary = {
        player: {
          level: state.player.level,
          xp: state.player.xp,
          xpToNextLevel: state.player.xpToNextLevel,
          currentStreak: state.player.currentStreak,
          longestStreak: state.player.longestStreak,
          skillPoints: state.player.skillPoints
        },
        healthBar: {
          current: state.healthBar.current,
          maximum: state.healthBar.maximum,
          lastUpdated: state.healthBar.lastUpdated
        },
        mainQuest: {
          title: state.mainQuest.title,
          description: state.mainQuest.description,
          isActive: state.mainQuest.isActive
        },
        currentSeason: {
          title: state.currentSeason.title,
          description: state.currentSeason.description,
          progress: state.currentSeason.progress
        },
        activeQuests: activeQuests.map(q => ({
          id: q.id,
          title: q.title,
          description: q.description,
          type: q.type,
          xpReward: q.xpReward,
          priority: q.priority,
          estimatedTime: q.estimatedTime,
          difficultyLevel: q.difficultyLevel,
          energyRequired: q.energyRequired,
          anxietyLevel: q.anxietyLevel,
          tags: q.tags
        })),
        completedQuests: completedQuests.length,
        bonusXPActive: state.bonusXPActive ? {
          multiplier: state.bonusXPActive.multiplier,
          expiresAt: state.bonusXPActive.expiresAt
        } : null,
        unlockedAchievements: state.unlockedAchievements.length,
        customHealthActivities: state.customHealthActivities.length
      };
      
      console.log("Sending to server with state summary:", gameStateSummary);
      
      let response;
      try {
        response = await axios.post(`${serverUrl}/chat`, {
          message: input,
          gameState: gameStateSummary
        });
        console.log(`Successfully sent request to ${serverUrl}`);
      } catch (err) {
        console.warn(`Failed to connect to ${serverUrl}`, err);
      }

      if (!response || !response.data) {
        setCompanionResponse(`⚠️ I couldn't get a response from the AI server. Please make sure the server is running at ${serverUrl} and try again.`);
        setIsLoading(false);
        setInput('');
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
        return;
      }

      const responseData = response.data;
      console.log("Response from server:", responseData);

      // Dokładniejsze logowanie dla celów debugowania
      console.log("Backend response data (raw):", JSON.stringify(response.data));
      console.log("Response data content type:", typeof responseData);
      if (responseData.functionCall) {
        console.log("Function call details:", {
          name: responseData.functionCall.name,
          argsType: typeof responseData.functionCall.arguments,
          args: responseData.functionCall.arguments,
          xpRewardType: responseData.functionCall.arguments.xpReward ?
            typeof responseData.functionCall.arguments.xpReward : 'undefined',
          healthChangeType: responseData.functionCall.arguments.healthChange ?
            typeof responseData.functionCall.arguments.healthChange : 'undefined',
        });
      }

      // Czyszczenie wszelkich komunikatów o błędach
      const errorElement = document.querySelector('.error-message');
      if (errorElement) {
        errorElement.innerHTML = '';
        errorElement.classList.remove('visible');
      }

      // Upewniamy się, że stara odpowiedź nie będzie widoczna podczas przetwarzania
      if (companionResponse) {
        setCompanionResponse(null);
      }

      // Handle function call response
      if (responseData.functionCall) {
        const functionCall = responseData.functionCall;
        const functionName = functionCall.name;
        const functionArgs = functionCall.arguments;
        // Dodatkowy log dla lepszego debugowania
        console.log("Gemini suggested function call:", functionName, "with args:", functionArgs);
        console.log(`Executing function: ${functionName}`, functionArgs);
        // Execute function based on name returned from backend
        switch (functionName) {
          case 'add_quest':
            // Log all arguments to debug
            console.log("Adding quest with args:", functionArgs);
            
            // Enhance with ADHD-friendly attributes
            const isADHDFriendly = functionArgs.isADHDFriendly || 
                                   input.toLowerCase().includes("adhd") ||
                                   input.toLowerCase().includes("micro") ||
                                   input.toLowerCase().includes("szybki sukces") ||
                                   input.toLowerCase().includes("quick win") ||
                                   input.toLowerCase().includes("small") ||
                                   input.toLowerCase().includes("mały");
            
            // For micro-tasks, adjust time estimate and difficulty
            let estimatedTime = typeof functionArgs.estimatedTime === 'number' ? functionArgs.estimatedTime : 30;
            let difficultyLevel = typeof functionArgs.difficultyLevel === 'number' ? functionArgs.difficultyLevel : 3;
            let description = functionArgs.description || `Complete "${functionArgs.title}"`;
            
            if (isADHDFriendly) {
              // Dostosuj wartości dla przyjaznych ADHD zadań
              estimatedTime = Math.min(estimatedTime, 20); // Krótsze szacowanie czasu
              difficultyLevel = Math.min(difficultyLevel, 3); // Niższy poziom trudności
              
              // Popraw opis zadania, dodając strukturę ADHD-friendly
              if (!functionArgs.description) {
                description = `Complete "${functionArgs.title}"\n\nSugerowane kroki:\n1. Przygotuj potrzebne materiały\n2. Rozpocznij od najłatwiejszej części\n3. Zrób krótką przerwę po 15 minutach\n4. Dokończ zadanie`;
              } else if (!functionArgs.description.includes("kroki") && !functionArgs.description.includes("steps")) {
                description = `${functionArgs.description}\n\nRozbij to zadanie na mniejsze kroki, aby łatwiej było zacząć.`;
              }
            }
            
            // Stwórz payload i zapisz go do zmiennej dla lepszego debugowania
            const questPayload = {
              id: crypto.randomUUID(),
              title: functionArgs.title,
              description: description,
              type: functionArgs.type || 'side',
              xpReward: typeof functionArgs.xpReward === 'number' ? functionArgs.xpReward : 20,
              priority: functionArgs.priority || 'medium',
              status: 'active' as 'active' | 'completed' | 'failed' | 'paused',
              createdDate: new Date(),
              estimatedTime: estimatedTime,
              difficultyLevel: difficultyLevel as (1|2|3|4|5),
              energyRequired: functionArgs.energyRequired || (isADHDFriendly ? 'low' : 'medium'),
              anxietyLevel: functionArgs.anxietyLevel || (isADHDFriendly ? 'comfortable' : 'moderate'),
              tags: functionArgs.tags || (isADHDFriendly ? ['adhd-friendly', 'micro-task'] : ['general'])
            };
            
            // Log payloadu przed akcją
            console.log("Dispatching ADD_QUEST with payload:", questPayload);
            console.log("xpReward type:", typeof questPayload.xpReward);
            console.log("estimatedTime type:", typeof questPayload.estimatedTime);
            console.log("difficultyLevel type:", typeof questPayload.difficultyLevel);
            
            // Wykonaj akcję
            actions.addQuest(questPayload);
            
            // Przygotuj odpowiednie komunikaty w zależności od typu zadania
            let responseMessage = '';
            
            if (isADHDFriendly) {
              responseMessage = `✨ Świetnie! Dodałem nowe mikro-zadanie: **${functionArgs.title}**.

To jest ${functionArgs.priority || 'medium'} priorytetowe zadanie typu ${functionArgs.type || 'side'}, warte ${questPayload.xpReward} XP.

**ADHD-friendly wskazówki:**
• Zadanie powinno zająć tylko około ${estimatedTime} minut
• Rozpocznij od najmniejszego możliwego kroku
• Ustaw timer, aby utrzymać fokus
• Celebruj każdy postęp!

Powodzenia! 💪`;
            } else {
              responseMessage = `✨ Excellent! Dodałem nowe zadanie: **${functionArgs.title}**. 
To jest ${functionArgs.priority || 'medium'} priorytetowe zadanie typu ${functionArgs.type || 'side'}, warte ${questPayload.xpReward} XP.

Czy chcesz, żebym rozbił to zadanie na mniejsze kroki? Mogę pomóc stworzyć bardziej przyjazną dla ADHD wersję.`;
            }
            
            setCompanionResponse(responseMessage);
            
            toast.success(`Dodano nowe zadanie: ${functionArgs.title}`);
            break;
            
          case 'complete_quest':
            // Find quest by title
            console.log("Looking for quest to complete:", functionArgs.questTitle);
            console.log("Available quests:", state.quests.map(q => q.title));
            
            const questToComplete = state.quests.find(q => 
              q.title.toLowerCase().includes(functionArgs.questTitle.toLowerCase()) || 
              functionArgs.questTitle.toLowerCase().includes(q.title.toLowerCase())
            );
            
            if (questToComplete) {
              console.log("Found quest to complete:", questToComplete);
              actions.completeQuest(questToComplete.id);
              
              // Celebrowanie małych zwycięstw - odpowiedzi dostosowane do typu zadania
              const celebrationMessages = [
                `🎉 Brawo! Ukończyłeś zadanie: **${questToComplete.title}**. Każdy sukces, nawet mały, przybliża Cię do Twoich celów!`,
                `🏆 Wspaniale! Zadanie **${questToComplete.title}** ukończone! Jak się z tym czujesz? Doceń ten moment sukcesu!`,
                `💪 Imponujące! Wykonałeś zadanie: **${questToComplete.title}**. To dowód, że potrafisz pokonać przeszkody!`,
                `✨ Doskonale! Zadanie **${questToComplete.title}** jest już za Tobą. Nawet małe zwycięstwa budują poczucie sprawczości!`,
                `🌟 Super robota! Ukończenie **${questToComplete.title}** to powód do dumy! Doceniaj każdy krok na swojej drodze!`
              ];
              
              // Dodatkowe komunikaty dla mikro-zadań
              const microTaskMessages = [
                `🚀 Szybki sukces! Ukończenie mikro-zadania **${questToComplete.title}** pokazuje, że możesz pokonać prokrastynację!`,
                `⚡ Błyskawicznie wykonane! Każde ukończone mikro-zadanie jak **${questToComplete.title}** buduje twój rozpęd!`
              ];
              
              // Wybierz odpowiednią wiadomość
              let responseMessage = '';
              
              if (questToComplete.tags.includes('micro-task') || 
                  questToComplete.tags.includes('adhd-friendly') || 
                  questToComplete.estimatedTime <= 15) {
                responseMessage = microTaskMessages[Math.floor(Math.random() * microTaskMessages.length)];
              } else {
                responseMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
              }
              
              // Dodaj sugestię następnego kroku dla podtrzymania rozpędu
              const nextStepMessages = [
                `\n\nCo sądzisz o wykonaniu kolejnego małego zadania, aby podtrzymać dobrą passę?`,
                `\n\nChcesz, żebym zaproponował kolejne zadanie, żeby utrzymać ten rozpęd?`,
                `\n\nMoże to dobry moment, aby zaplanować małą nagrodę za ten sukces?`,
                `\n\nPamiętaj, aby docenić ten moment i dać sobie chwilę na cieszenie się sukcesem!`
              ];
              
              responseMessage += nextStepMessages[Math.floor(Math.random() * nextStepMessages.length)];
              
              setCompanionResponse(responseMessage);
              toast.success(`Ukończono zadanie: ${questToComplete.title}`);
            } else {
              console.warn("Quest not found:", functionArgs.questTitle);
              // Wyraźnie oznacz, że to błąd, ale w przyjazny sposób
              setCompanionResponse(`❓ I couldn't find a quest matching "${functionArgs.questTitle}". Please check the quest name and try again. You can see your active quests in the quests panel.`);
              
              // Dodaj informację o dostępnych questach, jeśli są
              if (state.quests.length > 0) {
                const activeQuestNames = state.quests
                  .filter(q => q.status === 'active')
                  .map(q => `"${q.title}"`)
                  .join(", ");
                  
                if (activeQuestNames) {
                    const errorEl = document.querySelector('.error-message')!;
                  errorEl.innerHTML = `<span class="flex items-center gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9v4m0 3h.01M10.2998 3.32001L2.84976 17C1.83976 19 3.24976 21.5 5.54976 21.5H18.4498C20.7498 21.5 22.1598 19 21.1498 17L13.6998 3.32001C12.6898 1.33001 11.3098 1.33001 10.2998 3.32001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Available active quests: ${activeQuestNames}</span>`;
                  errorEl.classList.add('visible');
                  errorEl.classList.remove('hidden');
                }
              }
            }
            break;
            
          case 'log_health_activity':
            console.log("Logging health activity with args:", functionArgs);
            
            const activityId = `custom_${Date.now()}`;
            const healthChange = typeof functionArgs.healthChange === 'number' ? functionArgs.healthChange : 0;
            const xpChange = typeof functionArgs.xpChange === 'number' ? functionArgs.xpChange : 0;
            
            // Create and add new health activity
            const newActivity = {
              id: activityId,
              name: functionArgs.activityName,
              healthChange: healthChange,
              category: functionArgs.category || 'physical',
              duration: typeof functionArgs.duration === 'number' ? functionArgs.duration : 30,
              description: functionArgs.description || `Custom activity: ${functionArgs.activityName}`,
              icon: functionArgs.icon || '💪',
            };
            
            // Log for debugging
            console.log("Dispatching ADD_HEALTH_ACTIVITY with payload:", newActivity);
            console.log("healthChange type:", typeof healthChange);
            console.log("xpChange type:", typeof xpChange);
            console.log("duration type:", typeof newActivity.duration);
            
            // Perform actions
            actions.addHealthActivity(newActivity);
            actions.updateHealth(healthChange, newActivity);
            
            // Add XP if specified
            if (xpChange !== 0) {
              actions.addXP({
                amount: xpChange,
                reason: `Health activity: ${functionArgs.activityName}`
              });
            }
            
            // Log activity
            actions.logActivity({
              id: crypto.randomUUID(),
              type: 'health_activity',
              description: `${healthChange >= 0 ? '✅' : '⚠️'} ${functionArgs.activityName}`,
              timestamp: new Date(),
              xpGained: xpChange,
              healthChanged: healthChange,
              activityType: activityId
            });
            
            // Create appropriate response message
            let message;
            if (healthChange >= 0) {
              message = `❤️ Health update: You gained ${healthChange} health ${xpChange !== 0 ? `and ${xpChange} XP` : ''} from **${functionArgs.activityName}**!`;
            } else {
              message = `💔 Health update: You lost ${Math.abs(healthChange)} health ${xpChange !== 0 ? `and ${xpChange} XP` : ''} from **${functionArgs.activityName}**!`;
            }
            
            setCompanionResponse(message);
            toast.success(`Logged health activity: ${functionArgs.activityName}`);
            break;
            
          case 'set_main_quest':
            console.log("Setting main quest with args:", functionArgs);
            
            // Update main quest
            actions.setMainQuest(functionArgs.title, functionArgs.description);
            
            // Check if this is ADHD-related and customize response
            if (functionArgs.title.toLowerCase().includes("focus") || 
                input.toLowerCase().includes("adhd") || 
                input.toLowerCase().includes("focus") ||
                (functionArgs.description && functionArgs.description.toLowerCase().includes("adhd"))) {
              setCompanionResponse(`🌟 I've updated your main quest to be more ADHD-friendly: **${functionArgs.title}**. ${functionArgs.description} Remember that breaking tasks into smaller steps and celebrating small wins is key!`);
            } else {
              setCompanionResponse(`🌟 I've updated your main quest to: **${functionArgs.title}**. This will be your guiding star on your journey. Focus on this epic mission!`);
            }
            toast.success(`Updated main quest to: ${functionArgs.title}`);
            break;
            
          case 'set_season_name':
            console.log("Setting season name with args:", functionArgs);
            
            // Update season using the updateSeason action
            const updatedSeason = {
              ...state.currentSeason,
              title: functionArgs.name
            };
            actions.updateSeason(updatedSeason);
            setCompanionResponse(`🏆 A new season begins! I've updated your season name to: **${functionArgs.name}**. May this season bring great adventures and accomplishments!`);
            toast.success(`Updated season name: ${functionArgs.name}`);
            break;
            
          case 'get_player_status':
            const activeQuests = state.quests.filter(q => q.status === 'active');
            const completedQuests = state.quests.filter(q => q.status === 'completed');
            
            setCompanionResponse(`
📊 **Status Update**

You're currently **Level ${state.player.level}** with ${state.player.xp}/${state.player.xpToNextLevel} XP.
Health: ${state.healthBar.current}/${state.healthBar.maximum}
Current streak: ${state.player.currentStreak} days
Active quests: ${activeQuests.length}
Completed quests: ${completedQuests.length}

Your main quest is: "${state.mainQuest.title}"
${state.bonusXPActive ? `\n⚡ You have a ${state.bonusXPActive.multiplier}x XP bonus active until ${new Date(state.bonusXPActive.expiresAt).toLocaleTimeString()}!` : ''}

Is there anything specific you'd like to work on today?`);
            break;
            
          case 'suggest_next_task':
            console.log("Suggesting next task");
            
            // ADHD-przyjazna priorytetyzacja questów
            const microTasks = state.quests.filter(q => q.status === 'active' && 
              (q.tags.includes('micro-task') || q.tags.includes('adhd-friendly') || q.estimatedTime <= 15));
            
            const urgentQuests = state.quests.filter(q => q.status === 'active' && q.priority === 'urgent');
            const highPriorityQuests = state.quests.filter(q => q.status === 'active' && q.priority === 'high');
            const lowEnergyQuests = state.quests.filter(q => q.status === 'active' && q.energyRequired === 'low');
            const lowAnxietyQuests = state.quests.filter(q => q.status === 'active' && q.anxietyLevel === 'comfortable');
            const allActiveQuests = state.quests.filter(q => q.status === 'active');
            
            let recommendation = '';
            let supportingTip = '';
            
            // Wybierz odpowiednie zadanie w oparciu o usprawnioną logikę dla ADHD
            if (microTasks.length > 0) {
              // Preferuj mikro-zadania jako najbardziej przyjazne ADHD
              const selectedTask = microTasks[0];
              recommendation = `Sugeruję zacząć od mikro-zadania: **"${selectedTask.title}"**.\n\nTo szybki sukces (około ${selectedTask.estimatedTime} minut), który pomoże Ci zbudować poczucie osiągnięć!`;
              supportingTip = `💡 **Wskazówka ADHD:** Ustaw timer na ${selectedTask.estimatedTime} minut i fokusuj się tylko na tym zadaniu. Nagradzaj się po każdym ukończonym mikro-zadaniu!`;
            } else if (urgentQuests.length > 0) {
              const selectedTask = urgentQuests[0];
              recommendation = `Zalecam zajęcie się zadaniem: **"${selectedTask.title}"**, ponieważ jest oznaczone jako pilne.`;
              
              // Jeśli zadanie jest zbyt złożone, zaproponuj rozbicie go
              if (selectedTask.estimatedTime > 30 || selectedTask.difficultyLevel >= 4) {
                supportingTip = `💡 **Wskazówka ADHD:** To zadanie może wydawać się przytłaczające. Spróbuj rozbić je na mniejsze części - mogę Ci w tym pomóc! Powiedz "podziel zadanie ${selectedTask.title} na kroki".`;
              } else {
                supportingTip = `💡 **Wskazówka ADHD:** Ustal konkretny czas rozpoczęcia i zakończenia. Krótkie, zaplanowane sesje pracy zwiększają szanse na sukces.`;
              }
            } else if (lowEnergyQuests.length > 0) {
              const selectedTask = lowEnergyQuests[0];
              recommendation = `Jeśli masz dziś mniej energii, wypróbuj zadanie: **"${selectedTask.title}"**, które wymaga mniej wysiłku.`;
              supportingTip = `💡 **Wskazówka ADHD:** Zadania wymagające mniej energii są świetne, gdy czujesz się zmęczony/a lub przytłoczony/a. Pamiętaj, że każdy postęp się liczy!`;
            } else if (lowAnxietyQuests.length > 0) {
              const selectedTask = lowAnxietyQuests[0];
              recommendation = `Dla komfortowego rozpoczęcia dnia, spróbuj zadania: **"${selectedTask.title}"**, które nie wywołuje niepokoju.`;
              supportingTip = `💡 **Wskazówka ADHD:** Rozpoczęcie dnia od komfortowego zadania buduje poczucie sprawczości i toruje drogę do trudniejszych zadań później.`;
            } else if (highPriorityQuests.length > 0) {
              const selectedTask = highPriorityQuests[0];
              recommendation = `Dobrym krokiem byłoby zadanie: **"${selectedTask.title}"**, ponieważ ma wysoki priorytet.`;
              
              // Jeśli zadanie jest złożone, zaproponuj technikę Pomodoro
              supportingTip = `💡 **Wskazówka ADHD:** Dla tego zadania wypróbuj technikę Pomodoro - 25 minut pracy, 5 minut przerwy. Nasz Timer Fokusowania może Ci w tym pomóc!`;
            } else if (allActiveQuests.length > 0) {
              const selectedTask = allActiveQuests[0];
              recommendation = `Możesz zająć się zadaniem: **"${selectedTask.title}"**.`;
              supportingTip = `💡 **Wskazówka ADHD:** Czasem najlepszym sposobem jest po prostu zacząć. Daj sobie pozwolenie na pracę przez tylko 5 minut - często to wystarcza, aby przełamać blokadę.`;
            } else {
              recommendation = `Nie masz obecnie aktywnych zadań. Chcesz, abym pomógł Ci stworzyć nowe, przyjazne dla ADHD zadanie?`;
              supportingTip = `Mogę zaproponować mikro-zadanie, które zajmie tylko 5-10 minut i da Ci szybkie poczucie sukcesu!`;
            }
            
            // Dodaj element losowości, aby uniknąć powtarzania tych samych rad
            const celebrationPhrases = [
              "Ukończenie zadania to powód do świętowania!",
              "Każde ukończone zadanie to wygrana bitwa!",
              "Pamiętaj, że nawet mały postęp to zwycięstwo!",
              "Sukces to suma małych wysiłków powtarzanych każdego dnia!",
              "Świętuj każdy ukończony krok - buduje to motywację!"
            ];
            
            const randomCelebration = celebrationPhrases[Math.floor(Math.random() * celebrationPhrases.length)];
            
            setCompanionResponse(`🧭 ${recommendation}\n\n${supportingTip}\n\n✨ ${randomCelebration}`);
            break;
            
          case 'provide_help':
            console.log("Providing help");
            setCompanionResponse(`
🤖 **AI Companion Help - ADHD-przyjazny Asystent**

Witaj, podróżniku! Jestem Twoim towarzyszem AI. Mogę pomóc Ci tworzyć zadania dostosowane do Twoich potrzeb, proponować strategie, a nawet dodawać motywacji. Jak mogę Ci dziś pomóc?

• **Dodaj zadanie** - "Dodaj mikro-zadanie 'Przeczytaj przez 10 minut'"
• **Ukończ zadanie** - "Oznacz zadanie czytania jako ukończone"
• **Zapisz aktywność zdrowotną** - "Zapisz aktywność 'Poranna medytacja'"
• **Ustaw główną misję** - "Ustaw główne zadanie 'Ukończ projekt do piątku'"
• **Przepisz główną misję** - "Przepisz główną misję w sposób przyjazny dla ADHD"
• **Aktywuj bonus XP** - "Aktywuj 2x bonus XP za sesję skupienia"

Możesz także poprosić o:
• "Jak mi idzie?" - aby uzyskać aktualizację statusu
• "Co powinienem zrobić dalej?" - dla rekomendacji mikro-zadań
• "Opowiedz o moich osiągnięciach" - aby zobaczyć swój postęp
• "Czuję się przytłoczony/a" - dla wsparcia emocjonalnego
• "Mam trudności ze skupieniem" - dla strategii koncentracji

**ADHD-przyjazne funkcje:**
• Mikro-zadania dla szybkich sukcesów
• Rozbijanie złożonych zadań na mniejsze kroki
• Dostosowane techniki skupiania z Timerem Fokusowym
• Przypomnienia o przerwach i dbaniu o siebie
• System nagród dla zwiększenia motywacji

W jaki sposób mogę Ci dziś pomóc?`);
            break;
            
          default:
            // Unknown function
            console.warn("Unknown function call:", functionName);
            const defaultResponse = `I understood your request as "${functionName}", but I'm not sure how to handle it yet. Let me know if you'd like me to try something else!`;
            setCompanionResponse(enhanceAIResponse(defaultResponse));
            
            // Log additional debug info to help diagnose
            console.log("Known function names:", [
              'add_quest', 'complete_quest', 'log_health_activity', 
              'set_main_quest', 'set_season_name', 'get_player_status',
              'suggest_next_task', 'provide_help'
            ]);
            break;
        }
      } 
      // Handle text response
      else if (responseData.text) {
        // Use enhanceAIResponse to improve the response with ADHD-friendly tips
        const enhancedResponse = enhanceAIResponse(responseData.text);
        setCompanionResponse(enhancedResponse);
      } 
      // Handle unexpected response
      else {
        setCompanionResponse("I received an unexpected response from the server. Please try again later.");
      }
      
    } catch (err: any) {
      console.error("Error processing command:", err);
      
      // Bardziej szczegółowa informacja o błędzie
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNREFUSED' || !err.response) {
          setCompanionResponse(`⚠️ I couldn't connect to the AI server. Please make sure the server is running at ${serverUrl} and try again.`);
        } else if (err.response && err.response.status === 429) {
          setCompanionResponse("⚠️ The API rate limit has been exceeded. Please wait a moment and try again.");
        } else {
          setCompanionResponse(`⚠️ Server error (${err.response?.status || 'unknown'}): ${err.message}`);
        }
      } else {
        setCompanionResponse("⚠️ I encountered an error while processing your request. Please try again or check the console for details.");
      }
    } finally {
      setIsLoading(false);
      setInput('');
      
      // Focus back on the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Funkcja do obsługi prostych komend dotyczących ustawień UI
  const handleUISettingCommand = (input: string): boolean => {
    const lowerInput = input.toLowerCase();
    
    // Zmiana rozmiaru czcionki
    if (lowerInput.includes('zwiększ czcionkę') || 
        lowerInput.includes('większa czcionka') || 
        lowerInput.includes('większy tekst') ||
        lowerInput.includes('increase font') ||
        lowerInput.includes('larger font')) {
      
      document.documentElement.style.fontSize = '110%';
      setCompanionResponse(`✅ Zwiększyłem rozmiar czcionki dla lepszej czytelności. Czy tak jest lepiej?`);
      return true;
    }
    
    if (lowerInput.includes('zmniejsz czcionkę') || 
        lowerInput.includes('mniejsza czcionka') || 
        lowerInput.includes('mniejszy tekst') ||
        lowerInput.includes('decrease font') ||
        lowerInput.includes('smaller font')) {
      
      document.documentElement.style.fontSize = '90%';
      setCompanionResponse(`✅ Zmniejszyłem rozmiar czcionki. Czy tak jest lepiej?`);
      return true;
    }
    
    if (lowerInput.includes('normalna czcionka') || 
        lowerInput.includes('resetuj czcionkę') || 
        lowerInput.includes('domyślna czcionka') ||
        lowerInput.includes('reset font') ||
        lowerInput.includes('default font')) {
      
      document.documentElement.style.fontSize = '100%';
      setCompanionResponse(`✅ Przywróciłem domyślny rozmiar czcionki.`);
      return true;
    }
    
    // Zwiększanie kontrastu
    if (lowerInput.includes('zwiększ kontrast') || 
        lowerInput.includes('więcej kontrastu') ||
        lowerInput.includes('increase contrast') ||
        lowerInput.includes('higher contrast')) {
      
      // Dodajemy klasę z większym kontrastem do body
      document.body.classList.add('high-contrast');
      setCompanionResponse(`✅ Zwiększyłem kontrast dla lepszej czytelności. Jeśli chcesz wrócić do normalnego widoku, powiedz "normalny kontrast".`);
      return true;
    }
    
    if (lowerInput.includes('normalny kontrast') || 
        lowerInput.includes('resetuj kontrast') ||
        lowerInput.includes('normal contrast') ||
        lowerInput.includes('reset contrast')) {
      
      document.body.classList.remove('high-contrast');
      setCompanionResponse(`✅ Przywróciłem normalny poziom kontrastu.`);
      return true;
    }
    
    // Ułatwienia dla dysleksji
    if (lowerInput.includes('tryb dysleksji') || 
        lowerInput.includes('dla dysleksji') ||
        lowerInput.includes('dyslexic mode') ||
        lowerInput.includes('dyslexia mode')) {
      
      // Dodaj klasę dla trybu dysleksji
      document.body.classList.add('dyslexia-friendly');
      setCompanionResponse(`✅ Włączyłem tryb przyjazny dla dysleksji, który używa specjalnej czcionki i odstępów. Aby wrócić do normalnego widoku, powiedz "wyłącz tryb dysleksji".`);
      return true;
    }
    
    if (lowerInput.includes('wyłącz tryb dysleksji') || 
        lowerInput.includes('turn off dyslexia') ||
        lowerInput.includes('disable dyslexia')) {
      
      document.body.classList.remove('dyslexia-friendly');
      setCompanionResponse(`✅ Wyłączyłem tryb dla dysleksji.`);
      return true;
    }
    
    // Jeśli nie obsłużono komendy
    return false;
  };

  // Funkcja do wykrywania trudnych zadań i sugerowania ich podziału na mniejsze kroki
  const detectDifficultTaskRequest = (input: string): boolean => {
    const lowerInput = input.toLowerCase();
    
    // Wzorce związane z trudnymi zadaniami
    const difficultTaskPatterns = [
      'trudne zadanie', 'skomplikowane zadanie', 'złożone zadanie',
      'duży projekt', 'trudny projekt', 'trudna misja', 'duża misja',
      'skomplikowany projekt', 'złożony projekt', 'trudne wyzwanie',
      'difficult task', 'complex task', 'big project', 'large project',
      'challenging task', 'challenging project', 'hard task', 'hard project',
      'trudna rzecz', 'big assignment', 'complex assignment'
    ];
    
    // Sprawdź, czy użytkownik prosi o trudne zadanie
    const isDifficultTaskRequest = difficultTaskPatterns.some(pattern => lowerInput.includes(pattern));
    
    if (!isDifficultTaskRequest) return false;
    
    // Odpowiedzi z propozycjami podziału na mniejsze kroki
    const taskBreakdownResponses = [
      `Zauważyłem, że chcesz podjąć się trudnego zadania. Dla osób z ADHD, **podział na mniejsze kroki** jest kluczem do sukcesu! Oto moja propozycja:
      
1. **Rozpocznij od małego zadania** - zajmie tylko 5 minut, ale uruchomi momentum
2. **Wyznacz konkretny cel** dla każdej sesji pracy (np. "napiszę jeden paragraf" zamiast "będę pisać pracę")
3. **Używaj timera** - pracuj w krótszych interwałach (15-25 minut) z krótkimi przerwami
4. **Nagradzaj się** po każdym ukończonym kroku
5. **Wizualizuj postęp** - odhaczaj ukończone elementy

Jakie konkretnie trudne zadanie masz na myśli? Pomogę Ci je rozbić na wykonalne kroki.`,

      `Widzę, że zamierzasz zmierzyć się z trudnym zadaniem. To świetnie! Dla mózgu z ADHD, duże zadania mogą być przytłaczające, ale mam na to sposób:

1. **Rozbij zadanie na mikro-kroki** - każdy powinien zajmować maksymalnie 10-15 minut
2. **Zacznij od czegoś przyjemnego** związanego z zadaniem, żeby zbudować dopaminę
3. **Stwórz wizualne przypomnienia** każdego kroku (np. kolorowe karteczki)
4. **Zablokuj rozpraszacze** podczas pracy nad każdym krokiem
5. **Używaj techniki "szwajcarskiego sera"** - pracuj nad małymi, łatwymi częściami w dowolnej kolejności

Powiedz mi więcej o tym zadaniu, a pomogę Ci stworzyć plan działania dostosowany do Twojego stylu pracy.`,

      `Trudne zadanie? Rozumiem doskonale! Z ADHD, duże projekty mogą być jak góra nie do zdobycia. Ale spokojnie, mam dla Ciebie **strategię ADHD-friendly**:

1. **Metoda "płatków śniegu"** - zacznij od absolutnie najmniejszej części zadania
2. **Technika "body doubling"** - pracuj przy kimś lub włącz sesję fokusowania
3. **Wykorzystaj hiperfokus** - znajdź najbardziej interesującą część zadania i zacznij od niej
4. **Strukturyzuj chaos** - użyj mapy myśli zamiast liniowego planu
5. **Zasada "dwa minuty"** - jeśli jakiś krok zajmuje mniej niż 2 minuty, zrób go od razu

Opisz mi to trudne zadanie, a wspólnie stworzymy plan, który będzie pasował do Twojego unikalnego sposobu działania.`
    ];

    // Wybierz losową odpowiedź i wyświetl ją
    const randomResponse = taskBreakdownResponses[Math.floor(Math.random() * taskBreakdownResponses.length)];
    setCompanionResponse(randomResponse);
    
    return true;
  };

  // Funkcja do wykrywania negatywnych emocji i zapewniania wsparcia
  const detectNegativeSentiment = (input: string): boolean => {
    const lowerInput = input.toLowerCase();
    const negativePatterns = [
      'nie mogę', 'nie potrafię', 'trudne', 'ciężkie', 'zniechęcony', 
      'poddaję się', 'nie dam rady', 'frustrujące', 'beznadziejne', 
      'bezsensu', 'niemożliwe', 'odpuszczam', 'nienawidzę', 'zły', 
      'smutny', 'przytłoczony', 'zmęczony', 'stresujące', 'boję się',
      'anxious', 'overwhelmed', 'frustrated', 'depressed', 'sad', 'angry',
      'exhausted', 'hopeless', 'worried', 'stressed', 'can\'t focus',
      'distracted', 'give up', 'too difficult', 'too hard', 'failing',
      'nie skupić', 'rozproszony', 'rozpraszam się', 'zagubiony', 'chaos',
      'nie wiem jak', 'nie umiem', 'skomplikowane', 'złożone', 'przerasta mnie',
      'brak motywacji', 'nie widzę sensu', 'porażka', 'niepowodzenie',
      'za dużo', 'zbyt wiele', 'przeszkody', 'problem', 'ciężki dzień',
      'nie mam siły', 'nie mam energii', 'zapomniałem', 'zapomniałam', 
      'straciłem', 'straciłam', 'zawaliłem', 'zawaliłam', 'nie zdążę',
      'rozkojarzony', 'rozkojarzona', 'nie mogę się skupić'
    ];
    
    // Sprawdź czy występuje jakiś wzorzec negatywny
    const hasNegativeSentiment = negativePatterns.some(pattern => lowerInput.includes(pattern));
    
    if (!hasNegativeSentiment) return false;
    
    // Lista odpowiedzi wspierających
    const supportResponses = [
      `Widzę, że mierzysz się z trudnościami. Pamiętaj, że każdy ma dni, kiedy jest ciężko, zwłaszcza z ADHD. Może spróbujmy rozbić to zadanie na **naprawdę małe** kroki? Nawet 5 minut skupienia może być dobrym początkiem. Utrzymanie dziennego streaka to też mała wygrana!`,
      
      `Rozumiem Twoją frustrację. Czy mogę zaproponować krótką przerwę? Czasami najlepszym rozwiązaniem jest odejść na chwilę, zaczerpnąć świeżego powietrza i wrócić z nową energią. **Twój mózg potrzebuje tego odpoczynku**, to nie jest lenistwo! Pamiętaj, że nawet krótka sesja fokusowa pomaga utrzymać Twój streak.`,
      
      `To zupełnie normalne czuć się czasem przytłoczonym. Twój mózg pracuje inaczej i to jest w porządku! Pamiętaj, że już samo podjęcie próby jest dużym osiągnięciem. Co by pomogło Ci teraz najbardziej: rozbicie zadania na **mikro-kroki**, zmiana zadania na coś łatwiejszego, czy może krótka przerwa? Codzienne małe kroki budują Twój streak!`,
      
      `Każdy bohater napotyka przeszkody na swojej drodze. Twoje ADHD może być wyzwaniem, ale jest też **źródłem kreatywności i wyjątkowych pomysłów**. Może spróbujmy podejść do tego zadania w bardziej kreatywny sposób, który pasuje do Twojego stylu myślenia? Zobaczmy, jak możemy utrzymać Twój streak i zdobyć dzisiejsze doświadczenie!`,
      
      `Czasami ciężko jest ruszyć z miejsca. Co powiesz na technikę "5 minut"? Zobowiąż się do pracy nad zadaniem tylko przez 5 minut. Często, gdy już zaczniemy, łatwiej jest kontynuować. A nawet jeśli zrobisz tylko te 5 minut - **to i tak zwycięstwo i punkt do dzisiejszego streaka!**`,
      
      `Zauważyłem, że czujesz się niepewnie. Pamiętaj, że osoby z ADHD często doświadczają "niemożliwości rozpoczęcia" - to jak niewidzialna ściana między tobą a zadaniem. **To nie jest lenistwo ani brak silnej woli** - to rzeczywista neurobiologiczna bariera. Spróbuj jedną z technik "body doubling" - włącz timer fokusowania albo pracuj równolegle z kimś innym. Każde ukończone zadanie to +1 do Twojego streaka!`,
      
      `Wyzwania są częścią podróży. Gdy mózg z ADHD napotyka trudności, często reaguje silniejszym stresem niż u neurotypowych osób. To **nie jest twoja wina**, to po prostu inny sposób funkcjonowania. Zacznij od **najmniejszej możliwej części zadania** - tak małej, że nie wymaga prawie żadnego wysiłku. Sukces buduje się na małych zwycięstwach, a codzienna aktywność buduje Twój streak!`,
      
      `Rozumiem, że czujesz się przytłoczony/a. Osoby z ADHD często mają trudności z rozbijaniem dużych zadań na mniejsze części. Pozwól, że pomogę ci stworzyć **plan krok po kroku**. Jakie zadanie sprawia ci trudność? Pamiętaj, że ukończenie nawet małego zadania dziś pomoże utrzymać Twój streak i poczucie ciągłości!`,
      
      `Ciężki dzień? To normalne. Mózg z ADHD ma swoje wzloty i upadki. W takie dni **szczególnie ważne są mikro-zadania** - coś tak małego, że nie wymaga prawie żadnego wysiłku. Może to być 2-minutowy spacer, wypicie szklanki wody, czy jedna strona książki. To wystarczy, aby podtrzymać Twój streak i nie stracić rozpędu!`,
      
      `Widzę, że dzisiaj energia nie dopisuje. Pamiętaj, że w cyklu ADHD są dni lepsze i gorsze. To **część Twojej podróży, nie porażka**. Co możemy zrobić absolutnie minimalnego dzisiaj, aby podtrzymać Twój streak? Czasem wystarczy nawet 5-minutowa sesja fokusowa, aby zachować ciągłość.`
    ];
    
    // Wybierz losową odpowiedź wspierającą
    const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
    // Nie stosuj enhanceAIResponse tutaj, ponieważ te odpowiedzi są już ADHD-przyjazne
    setCompanionResponse(randomResponse);
    
    return true;
  };

  // Funkcja do obsługi przypomnień o zadaniach
  const handleReminderRequest = (input: string): boolean => {
    const reminderPatterns = [
      /przypomni?j.{1,10}o.{1,30}za (\d+) (minut|godzin|dni)/i,
      /remind.{1,10}(about|to).{1,30}in (\d+) (minutes?|hours?|days?)/i,
      /ustaw.{1,10}przypomnienie.{1,30}za (\d+) (minut|godzin|dni)/i,
      /set.{1,10}reminder.{1,30}in (\d+) (minutes?|hours?|days?)/i
    ];
    
    let matchFound = false;
    let timeAmount = 0;
    let timeUnit = '';
    let task = '';
    
    // Sprawdzamy, czy któryś z wzorców pasuje
    for (const pattern of reminderPatterns) {
      const match = input.match(pattern);
      if (match) {
        matchFound = true;
        
        // W zależności od wzorca, indeksy grup mogą się różnić
        if (pattern.toString().includes('remind')) {
          timeAmount = parseInt(match[2]);
          timeUnit = match[3].toLowerCase();
          task = match[0].split('about')[1]?.split('in')[0] || 'your task';
        } else {
          timeAmount = parseInt(match[1]);
          timeUnit = match[2].toLowerCase();
          task = match[0].split('o')[1]?.split('za')[0] || 'twoje zadanie';
        }
        break;
      }
    }
    
    if (!matchFound) {
      return false;
    }
    
    // Przelicz czas na milisekundy
    let timeInMs = 0;
    if (timeUnit.includes('minut') || timeUnit.includes('minute')) {
      timeInMs = timeAmount * 60 * 1000;
    } else if (timeUnit.includes('godzin') || timeUnit.includes('hour')) {
      timeInMs = timeAmount * 60 * 60 * 1000;
    } else if (timeUnit.includes('dni') || timeUnit.includes('day')) {
      timeInMs = timeAmount * 24 * 60 * 60 * 1000;
    }
    
    // Ustaw przypomnienie (tu używamy setTimeout i toast)
    if (timeInMs > 0) {
      const reminderTime = new Date(Date.now() + timeInMs);
      const formattedTime = reminderTime.toLocaleTimeString();
      
      setCompanionResponse(`✅ Ustawiłem przypomnienie o ${task.trim()} na ${formattedTime} (za ${timeAmount} ${timeUnit}):

Gdy nadejdzie czas, wyświetlę powiadomienie. Pamiętaj, że aby otrzymać powiadomienie, aplikacja musi być otwarta.

💡 **Wskazówka ADHD:** Rozważ też ustawienie alarmu w telefonie jako dodatkowe zabezpieczenie!`);
      
      // Ustaw setTimeout, który wyświetli toast
      setTimeout(() => {
        toast.success(`⏰ Przypomnienie!`, {
          description: `Przypomnienie o: ${task.trim()}`,
          duration: 10000, // Dłuższy czas trwania dla przypomnienia
          action: {
            label: "OK",
            onClick: () => console.log("Reminder acknowledged")
          }
        });
        
        // Także zmień odpowiedź AI, jeśli użytkownik wciąż jest na stronie
        setCompanionResponse(`⏰ **Czas na przypomnienie!**

Przypomnienie o: ${task.trim()}

Czy chcesz teraz zająć się tym zadaniem? Mogę pomóc Ci rozbić je na mniejsze, bardziej wykonalne kroki.`);
      }, timeInMs);
      
      return true;
    }
    
    return false;
  };



  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Najpierw spróbuj obsłużyć jako komendę UI
    if (handleUISettingCommand(input)) {
      setInput('');
      return;
    }
    
    // Sprawdź, czy nie ma negatywnego nastawienia przed przetworzeniem komendy
    if (detectNegativeSentiment(input)) {
      setInput('');
      return;
    }
    
    // Sprawdź, czy to komenda przypomnienia
    if (handleReminderRequest(input)) {
      setInput('');
      return;
    }
    
    processCommand();
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processCommand();
    }
  };

  return (
    <Card className="bg-white dark:bg-gradient-to-br dark:from-indigo-900/90 dark:to-zinc-900 border border-gray-200 dark:border-indigo-700 text-gray-900 dark:text-white shadow-lg dark:shadow-indigo-900/30 w-full max-w-3xl mx-auto rounded-3xl overflow-hidden">
      <CardHeader className="pb-4 bg-indigo-50 dark:bg-indigo-950/40 border-b border-gray-200 dark:border-indigo-800/50">
        <CardTitle className="flex items-center justify-between gap-2 text-xl font-bold text-indigo-800 dark:text-indigo-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800/80 dark:to-indigo-900/80 rounded-full shadow-md border border-indigo-200 dark:border-indigo-700/50">
              <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span>AI Companion</span>
          </div>
          {serverStatus === 'error' && (
            <Badge variant="destructive" className="text-xs font-normal px-3 py-1 rounded-full">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Offline
              </span>
            </Badge>
          )}
          {serverStatus === 'connected' && (
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Connected
              </span>
            </Badge>
          )}
          {serverStatus === 'checking' && (
            <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs px-3 py-1 rounded-full">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                Connecting...
              </span>
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-5">
        {/* Server error notice - clearly visible but not overwhelming */}
        {serverStatus === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 px-5 py-4 rounded-xl mb-4 shadow-inner shadow-red-50 dark:shadow-red-900/10 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p className="font-medium mb-1">Cannot connect to AI Server</p>
              <p className="text-red-600 dark:text-red-300">To use the AI assistant, start the server by running 
                <span className="font-mono bg-red-100 dark:bg-red-950/40 px-2 mx-1 rounded">start-server.bat</span> 
                file or 
                <span className="font-mono bg-red-100 dark:bg-red-950/40 px-2 mx-1 rounded">npm start</span> 
                in the server folder.
              </p>
            </div>
          </div>
        )}
        
        {/* Response Area - with responsive height for scrolling */}
        <div className="h-60 sm:h-72 bg-gray-50 dark:bg-indigo-950/30 border border-gray-200 dark:border-indigo-800/50 rounded-2xl shadow-inner overflow-hidden">
          {companionResponse ? (
            <div className="h-full p-3 sm:p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-indigo-800/50 scrollbar-track-transparent">
              <div className="text-gray-800 dark:text-indigo-100 whitespace-pre-wrap text-sm sm:text-base" 
                dangerouslySetInnerHTML={{ 
                  __html: companionResponse.replace(
                    /\*\*(.*?)\*\*/g, 
                    '<span class="font-semibold text-indigo-700 dark:text-indigo-300">$1</span>'
                  ) 
                }} 
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-indigo-400/70 px-3 sm:px-4 text-center">
              <Brain className="h-8 w-8 sm:h-10 sm:w-10 mb-2 sm:mb-3 opacity-40" />                
              <p className="font-medium text-base sm:text-lg mb-1">Witaj, niezwykły poszukiwaczu przygód!</p>
              <div className="text-xs sm:text-sm max-w-md space-y-2 sm:space-y-3">
                <p>Jestem twoim spersonalizowanym asystentem ADHD w tej przygodzie. Rozumiem, jak działa twój wyjątkowy umysł i jestem tu, by pomóc ci wykorzystać jego moc! <span className="text-indigo-500 dark:text-indigo-300 font-medium">Każdy dzień aktywności buduje twój streak!</span></p>
                <ul className="space-y-1 sm:space-y-1.5 text-left list-disc list-inside">
                  <li>Zaproponować <span className="font-medium text-indigo-600 dark:text-indigo-300">mikro-zadania</span> dopasowane do twojego poziomu energii</li>
                  <li>Podzielić skomplikowane projekty na <span className="font-medium text-indigo-600 dark:text-indigo-300">osiągalne kroki</span></li>
                  <li>Pomóc w przełamaniu <span className="font-medium text-indigo-600 dark:text-indigo-300">prokrastynacji i blokady</span></li>
                  <li>Dostarczyć <span className="font-medium text-indigo-600 dark:text-indigo-300">strategii i wsparcia</span> gdy czujesz się przytłoczony/a</li>
                  <li>Świętować twoje <span className="font-medium text-indigo-600 dark:text-indigo-300">sukcesy i postępy</span>, duże czy małe</li>
                  <li>Śledzić twój <span className="font-medium text-indigo-600 dark:text-indigo-300">dzienny streak</span> i motywować do utrzymania go</li>
                </ul>
                <p>Pamiętaj: Twój mózg jest jak supermoc - czasem nieprzewidywalna, ale zawsze niezwykła. Od czego zaczynamy dzisiaj?</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Error message area - visible only when needed */}
        <div className="error-message text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg hidden"></div>
        
        {/* Input form with clearer styling */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a command or ask a question (e.g., 'add quest Read a book', 'how am I doing?')"
            className="min-h-20 sm:min-h-24 bg-white dark:bg-indigo-950/30 border-gray-300 dark:border-indigo-700 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-indigo-400/70 resize-none p-3 sm:p-4 rounded-xl shadow-sm dark:shadow-inner dark:shadow-indigo-900/20 focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm sm:text-base"
            disabled={isLoading || serverStatus !== 'connected'}
          />
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between items-center">
            <div className="text-xs bg-gray-100 dark:bg-indigo-950/30 text-gray-600 dark:text-indigo-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-gray-200 dark:border-indigo-800/30 w-full sm:w-auto">
              Press <span className="font-medium">Enter</span> to submit, <span className="font-medium">Shift+Enter</span> for new line
            </div>
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-md dark:shadow-lg dark:shadow-indigo-900/30 px-4 sm:px-6 py-2 sm:py-2.5 h-auto rounded-xl border border-indigo-500 text-sm"
              disabled={isLoading || !input.trim() || serverStatus !== 'connected'}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> 
                  Processing...
                </>
              ) : serverStatus !== 'connected' ? (
                <>
                  <Loader className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                  Server Offline
                </>
              ) : (
                <>
                  <Send className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 dark:border-indigo-800/50 pt-4 pb-6 px-6 text-xs text-gray-600 dark:text-indigo-400/80">
        <div className="w-full">
          <p className="mb-2">
            Your AI Companion is powered by Google Gemini and understands a wide range of natural language requests.
            Try asking for help, status updates, or managing your quests and activities.
          </p>
          <div className="flex items-center justify-end">
            <div className={`flex items-center ${
              serverStatus === 'connected' ? 'text-green-600 dark:text-green-400' : 
              serverStatus === 'error' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                serverStatus === 'connected' ? 'bg-green-500' : 
                serverStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              {serverStatus === 'connected' ? 'Server connected' : 
               serverStatus === 'error' ? 'Server disconnected' : 'Checking connection...'}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AICompanion;
