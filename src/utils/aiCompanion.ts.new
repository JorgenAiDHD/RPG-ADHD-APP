import { GameState } from "../types/game";

// Typy komend, które może rozpoznać i wykonać AI
export type CommandType = 
  | 'ADD_QUEST'
  | 'COMPLETE_QUEST' 
  | 'HEALTH_ACTION' 
  | 'UPDATE_STATS'
  | 'GET_INSIGHTS'
  | 'SET_MAIN_QUEST'
  | 'ACTIVATE_BONUS_XP'
  | 'UNKNOWN';

// Struktura komendy rozpoznanej przez AI
export interface AICommand {
  type: CommandType;
  params: Record<string, any>;
  rawText: string;
}

// Interfejs dla parsowania wiadomości
export interface AICommandHandlerContext {
  state: GameState;
  actions: Record<string, Function>;
}

// Interfejs wyniku analizy wiadomości
export interface AIResponse {
  reply: string;
  commandsToExecute: AICommand[];
}

// Pomocnicze wyrażenia regularne do rozpoznawania komend
const COMMAND_PATTERNS = {
  ADD_QUEST: /(?:add|create|make|new) (?:quest|task|mission|goal)(?:\s+called|\s+titled|\s+named)?\s+["']?([^"']+)["']?/i,
  COMPLETE_QUEST: /(?:complete|finish|mark done|accomplish|mark complete)(?:\s+quest|task|mission|goal)?\s+["']?([^"']+)["']?/i,
  HEALTH_ACTION: /(?:log|record|add|do)\s+health\s+activity\s+["']?([^"']+)["']?/i,
  SET_MAIN_QUEST: /(?:set|update|change|make|rewrite|napisz|write|modify|edit|improve)(?:\s+(?:the|lepiej|better))?\s+(?:main\s+quest|main\s+task|główne\s+zadanie)(?:\s+(?:to|as|so|that|it|is|suited|for|na))?\s+["']?([^"']+)["']?/i,
  ACTIVATE_BONUS_XP: /(?:activate|start|enable)\s+(?:bonus|extra)\s+(?:xp|experience)\s+(?:for|because|as|with|due to)\s+["']?([^"']+)["']?/i,
};

// Analizuj i generuj odpowiedź AI na wiadomość użytkownika
export async function processAIMessage(
  userMessage: string, 
  chatHistory: Array<{role: 'user' | 'ai', text: string}>, 
  context: AICommandHandlerContext
): Promise<AIResponse> {
  // Ekstrahowanie intencji i parametrów z wiadomości
  const commands = extractCommands(userMessage, context.state);
  
  // Przygotowanie odpowiedzi
  const playerName = context.state.player.name;
  const response: AIResponse = {
    reply: "",
    commandsToExecute: commands,
  };

  // Przygotowanie szablonów odpowiedzi zależnie od komend
  if (commands.length === 0) {
    // Przypadek gdy nie wykryto żadnej komendy - analizujemy ogólny stan
    response.reply = generateGenericResponse(userMessage, context.state, chatHistory);
  } else {
    // Generujemy odpowiedź dla każdej wykrytej komendy
    const commandResponses = commands.map(command => generateCommandResponse(command, context.state, playerName));
    response.reply = commandResponses.join("\n\n");
  }

  return response;
}

// Funkcja ekstrahująca komendy z wiadomości
function extractCommands(userMessage: string, state: GameState): AICommand[] {
  const commands: AICommand[] = [];
  
  // Sprawdzenie ADD_QUEST
  const addQuestMatch = userMessage.match(COMMAND_PATTERNS.ADD_QUEST);
  if (addQuestMatch && addQuestMatch[1]) {
    const questTitle = addQuestMatch[1].trim();
    
    // Ekstrakcja opisu questa (jeśli istnieje)
    let questDescription = "";
    const descMatch = userMessage.match(/with\s+description\s+["']?([^"']+)["']?/i) || 
                      userMessage.match(/description:\s+["']?([^"']+)["']?/i);
    if (descMatch && descMatch[1]) {
      questDescription = descMatch[1].trim();
    }
    
    // Ekstrakcja typu questa
    let questType: 'main' | 'side' | 'daily' | 'weekly' = 'side';
    if (userMessage.includes("daily") || userMessage.includes("each day")) {
      questType = 'daily';
    } else if (userMessage.includes("weekly") || userMessage.includes("each week")) {
      questType = 'weekly';
    } else if (userMessage.includes("main")) {
      questType = 'main';
    }
    
    // Ekstrakcja priorytetu
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    if (userMessage.includes("urgent") || userMessage.includes("critical")) {
      priority = 'urgent';
    } else if (userMessage.includes("high priority") || userMessage.includes("important")) {
      priority = 'high';
    } else if (userMessage.includes("low priority") || userMessage.includes("minor")) {
      priority = 'low';
    }
    
    // Ekstrakcja nagrody XP
    let xpReward = 20;  // Domyślnie
    const xpMatch = userMessage.match(/(?:with|worth|for)\s+(\d+)\s+xp/i);
    if (xpMatch && xpMatch[1]) {
      xpReward = parseInt(xpMatch[1]);
    }
    
    // Ekstrakcja czasu trwania
    let estimatedTime = 30; // Domyślnie 30 minut
    const timeMatch = userMessage.match(/(?:takes|for|lasts|estimated)\s+(\d+)\s+(?:min|minutes)/i);
    if (timeMatch && timeMatch[1]) {
      estimatedTime = parseInt(timeMatch[1]);
    }
    
    // Ekstrakcja poziomu trudności
    let difficultyLevel: 1 | 2 | 3 | 4 | 5 = 3;
    if (userMessage.includes("very easy") || userMessage.includes("trivial")) {
      difficultyLevel = 1;
    } else if (userMessage.includes("easy") || userMessage.includes("simple")) {
      difficultyLevel = 2;
    } else if (userMessage.includes("hard") || userMessage.includes("difficult")) {
      difficultyLevel = 4;
    } else if (userMessage.includes("very hard") || userMessage.includes("extremely difficult")) {
      difficultyLevel = 5;
    }

    // Ekstrakcja poziomu energii
    let energyRequired: 'low' | 'medium' | 'high' = 'medium';
    if (userMessage.includes("high energy") || userMessage.includes("lots of energy")) {
      energyRequired = 'high';
    } else if (userMessage.includes("low energy") || userMessage.includes("little energy")) {
      energyRequired = 'low';
    }

    // Ekstrakcja poziomu niepokoju
    let anxietyLevel: 'comfortable' | 'mild' | 'challenging' | 'daunting' = 'comfortable';
    if (userMessage.includes("comfortable") || userMessage.includes("relaxing")) {
      anxietyLevel = 'comfortable';
    } else if (userMessage.includes("mild anxiety") || userMessage.includes("slight discomfort")) {
      anxietyLevel = 'mild';
    } else if (userMessage.includes("challenging") || userMessage.includes("moderate anxiety")) {
      anxietyLevel = 'challenging';
    } else if (userMessage.includes("daunting") || userMessage.includes("high anxiety")) {
      anxietyLevel = 'daunting';
    }

    // Ekstrakcja tagów
    let tags: string[] = [];
    const tagsMatch = userMessage.match(/tags?:\s+\[([^\]]+)\]/i) || 
                       userMessage.match(/with\s+tags?\s+["']?([^"']+)["']?/i);
    if (tagsMatch && tagsMatch[1]) {
      tags = tagsMatch[1].split(",").map(tag => tag.trim());
    } else {
      // Próbujemy wywnioskować tagi z kontekstu
      if (userMessage.includes("work")) tags.push("work");
      if (userMessage.includes("study") || userMessage.includes("learn")) tags.push("learning");
      if (userMessage.includes("health") || userMessage.includes("exercise")) tags.push("health");
      if (userMessage.includes("chore") || userMessage.includes("clean")) tags.push("chores");
      if (userMessage.includes("social")) tags.push("social");
      if (userMessage.includes("hobby")) tags.push("hobby");
    }

    commands.push({
      type: 'ADD_QUEST',
      params: {
        title: questTitle,
        description: questDescription || `Complete "${questTitle}"`,
        type: questType,
        xpReward,
        priority,
        status: 'active',
        createdDate: new Date(),
        estimatedTime,
        difficultyLevel,
        energyRequired,
        anxietyLevel,
        tags: tags.length > 0 ? tags : ['general'],
      },
      rawText: userMessage
    });
  }
  
  // Sprawdzenie COMPLETE_QUEST
  const completeQuestMatch = userMessage.match(COMMAND_PATTERNS.COMPLETE_QUEST);
  if (completeQuestMatch && completeQuestMatch[1]) {
    const questTitle = completeQuestMatch[1].trim();
    
    // Znajdź quest o podobnym tytule
    const targetQuest = state.quests.find(q => 
      q.title.toLowerCase().includes(questTitle.toLowerCase()) || 
      questTitle.toLowerCase().includes(q.title.toLowerCase())
    );
    
    if (targetQuest) {
      commands.push({
        type: 'COMPLETE_QUEST',
        params: {
          questId: targetQuest.id,
          questTitle: targetQuest.title
        },
        rawText: userMessage
      });
    }
  }
  
  // Sprawdzenie HEALTH_ACTION
  const healthMatch = userMessage.match(COMMAND_PATTERNS.HEALTH_ACTION);
  if (healthMatch && healthMatch[1]) {
    const activityName = healthMatch[1].trim();
    
    // Znajdź odpowiednią aktywność zdrowotną
    const defaultActivity = state.customHealthActivities.find(a => 
      a.name.toLowerCase().includes(activityName.toLowerCase())
    );

    if (defaultActivity) {
      commands.push({
        type: 'HEALTH_ACTION',
        params: {
          activityId: defaultActivity.id,
          activityName: defaultActivity.name,
          healthChange: defaultActivity.healthChange
        },
        rawText: userMessage
      });
    } else {
      // Jeśli nie znaleziono, zakładamy pozytywną aktywność zdrowotną
      commands.push({
        type: 'HEALTH_ACTION',
        params: {
          activityId: `custom_${Date.now()}`,
          activityName: activityName,
          healthChange: 10, // Domyślna wartość
          category: 'physical' as const,
          duration: 30,
          description: `Custom activity: ${activityName}`,
          icon: '💪',
        },
        rawText: userMessage
      });
    }
  }

  // Sprawdzenie SET_MAIN_QUEST
  const mainQuestMatch = userMessage.match(COMMAND_PATTERNS.SET_MAIN_QUEST);
  
  // Obsługa specjalnego przypadku "rewrite Main Quest so it..."
  const rewriteMatch = userMessage.match(/(?:rewrite|napisz|write|modify|improve)(?:\s+(?:lepiej|better))?\s+(?:main\s+quest|main\s+task|główne\s+zadanie)\s+(?:so|that|it|is|suit|fits|works|for)\s+(.*)/i);
  
  if (rewriteMatch && rewriteMatch[1]) {
    // W tym przypadku, tekst po "rewrite Main Quest so..." jest traktowany jako opis
    commands.push({
      type: 'SET_MAIN_QUEST',
      params: {
        title: "Main Quest",  // Używamy generycznego tytułu
        description: rewriteMatch[1].trim() // Używamy całego tekstu po "so" jako opisu
      },
      rawText: userMessage
    });
  } else if (mainQuestMatch && mainQuestMatch[1]) {
    // Standardowa obsługa komendy SET_MAIN_QUEST
    const questTitle = mainQuestMatch[1].trim();
    
    // Ekstrakcja opisu questa (jeśli istnieje)
    let questDescription = "";
    const descMatch = userMessage.match(/with\s+description\s+["']?([^"']+)["']?/i) || 
                      userMessage.match(/description:\s+["']?([^"']+)["']?/i);
    if (descMatch && descMatch[1]) {
      questDescription = descMatch[1].trim();
    }
    
    commands.push({
      type: 'SET_MAIN_QUEST',
      params: {
        title: questTitle,
        description: questDescription || `Your main quest: ${questTitle}`
      },
      rawText: userMessage
    });
  } else if (userMessage.match(/(?:rewrite|napisz|write|modify|improve|update)(?:\s+(?:lepiej|better))?\s+(?:main\s+quest|main\s+task|główne\s+zadanie)/i)) {
    // Przypadek gdy chcemy zmienić Main Quest, ale nie podajemy konkretnej treści
    // Wtedy prosimy o sugestię dla osoby z ADHD
    commands.push({
      type: 'SET_MAIN_QUEST',
      params: {
        title: "Focus on One Thing at a Time",
        description: "Break down your goals into small, manageable tasks and focus on completing one before moving to the next. Remember: progress over perfection!"
      },
      rawText: userMessage
    });
  }

  // Sprawdzenie ACTIVATE_BONUS_XP
  const bonusXPMatch = userMessage.match(COMMAND_PATTERNS.ACTIVATE_BONUS_XP);
  if (bonusXPMatch && bonusXPMatch[1]) {
    const reason = bonusXPMatch[1].trim();
    
    // Ekstrakcja mnożnika
    let multiplier = 1.5; // Domyślnie
    const multiplierMatch = userMessage.match(/(\d+\.?\d*)x\s+(?:multiplier|bonus)/i);
    if (multiplierMatch && multiplierMatch[1]) {
      multiplier = parseFloat(multiplierMatch[1]);
      if (multiplier > 3) multiplier = 3; // Limity bezpieczeństwa
      if (multiplier < 1.1) multiplier = 1.1;
    }
    
    // Ekstrakcja czasu trwania
    let duration = 60; // Domyślnie 60 minut
    const durationMatch = userMessage.match(/for\s+(\d+)\s+(?:min|minutes|hour|hours)/i);
    if (durationMatch && durationMatch[1]) {
      const amount = parseInt(durationMatch[1]);
      duration = userMessage.includes('hour') ? amount * 60 : amount;
    }
    
    commands.push({
      type: 'ACTIVATE_BONUS_XP',
      params: {
        multiplier,
        duration,
        reason
      },
      rawText: userMessage
    });
  }
  
  return commands;
}

// Generowanie odpowiedzi dla konkretnej komendy
function generateCommandResponse(command: AICommand, _state: GameState, playerName: string): string {
  switch (command.type) {
    case 'ADD_QUEST':
      return `✨ Excellent, ${playerName}! I've added a new quest: **${command.params.title}**. ${
        command.params.description ? `Your mission is to ${command.params.description}.` : ''
      } This is a ${command.params.priority} priority ${command.params.type} quest worth ${command.params.xpReward} XP. Good luck on your journey!`;
      
    case 'COMPLETE_QUEST':
      return `🎉 Congratulations, ${playerName}! You've completed the quest: **${command.params.questTitle}**. Keep up the great work!`;
      
    case 'HEALTH_ACTION':
      const healthChangeText = command.params.healthChange > 0 ? 
        `gained ${command.params.healthChange} health points` : 
        `recorded ${Math.abs(command.params.healthChange)} health impact`;
      
      return `❤️ Health update: You've ${healthChangeText} from **${command.params.activityName}**. Taking care of yourself is an important part of your hero's journey!`;
      
    case 'SET_MAIN_QUEST':
      if (command.params.title === "Focus on One Thing at a Time" || 
          command.rawText.toLowerCase().includes("adhd") || 
          command.rawText.toLowerCase().includes("focus") ||
          command.params.description.toLowerCase().includes("adhd")) {
        return `🌟 I've updated your main quest to be more ADHD-friendly: **${command.params.title}**. ${command.params.description} Remember that breaking tasks into smaller steps and celebrating small wins is key!`;
      }
      return `🌟 I've updated your main quest to: **${command.params.title}**. This will be your guiding star on your journey. Focus on this epic mission!`;
      
    case 'ACTIVATE_BONUS_XP':
      return `⚡ Bonus XP activated! For the next ${command.params.duration} minutes, you'll earn ${command.params.multiplier}x XP for all completed quests because of "${command.params.reason}". Make the most of this power-up!`;
      
    default:
      return `I understood your request, but I'm not sure how to handle it yet. Let me know if you'd like me to try something else!`;
  }
}

// Generowanie ogólnej odpowiedzi gdy nie wykryto konkretnych komend
function generateGenericResponse(
  userMessage: string, 
  state: GameState, 
  _chatHistory: Array<{role: 'user' | 'ai', text: string}>
): string {
  const playerName = state.player.name;
  const activeQuests = state.quests.filter(q => q.status === 'active');
  const completedQuests = state.quests.filter(q => q.status === 'completed');
  
  // Sprawdź, o co pyta użytkownik
  if (userMessage.match(/how am i doing|status|progress|update me/i)) {
    return `
📊 **Status Update for ${playerName}**

You're currently **Level ${state.player.level}** with ${state.player.xp}/${state.player.xpToNextLevel} XP.
Health: ${state.healthBar.current}/${state.healthBar.maximum}
Current streak: ${state.player.currentStreak} days
Active quests: ${activeQuests.length}
Completed quests: ${completedQuests.length}

Your main quest is: "${state.mainQuest.title}"
${state.bonusXPActive ? `\n⚡ You have a ${state.bonusXPActive.multiplier}x XP bonus active until ${new Date(state.bonusXPActive.expiresAt).toLocaleTimeString()}!` : ''}

Is there anything specific you'd like to work on today?`;
  }
  
  if (userMessage.match(/what should i do|suggest|recommend|next task/i)) {
    // Priorytetyzacja questów
    const urgentQuests = activeQuests.filter(q => q.priority === 'urgent');
    const highPriorityQuests = activeQuests.filter(q => q.priority === 'high');
    const lowEnergyQuests = activeQuests.filter(q => q.energyRequired === 'low');
    
    let recommendation = '';
    
    if (urgentQuests.length > 0) {
      recommendation = `I recommend tackling **"${urgentQuests[0].title}"** as it's marked urgent.`;
    } else if (highPriorityQuests.length > 0) {
      recommendation = `A good next step would be **"${highPriorityQuests[0].title}"** as it's high priority.`;
    } else if (lowEnergyQuests.length > 0) {
      recommendation = `If you're looking for something lighter, try **"${lowEnergyQuests[0].title}"** which requires low energy.`;
    } else if (activeQuests.length > 0) {
      recommendation = `You could work on **"${activeQuests[0].title}"** next.`;
    } else {
      recommendation = `You don't have any active quests right now. Would you like me to create one for you?`;
    }
    
    return `🧭 ${recommendation}\n\nRemember, completing quests will earn you XP and help you level up!`;
  }
  
  if (userMessage.match(/help|how (do|can) i|commands|what can you do/i)) {
    return `
🤖 **AI Companion Help**

I can assist you with managing your quests and tracking your progress. Here are some things you can ask me to do:

• **Add a quest** - "Add a quest called 'Read for 30 minutes' with priority high"
• **Complete a quest** - "Mark the reading quest as complete"
• **Log health activity** - "Log health activity 'Morning meditation'"
• **Set main quest** - "Set main quest to 'Complete my project by Friday'"
• **Rewrite main quest** - "Rewrite main quest so it suits more for ADHD mind"
• **Activate bonus XP** - "Activate 2x bonus XP for focused work session"

You can also ask me:
• "How am I doing?" for a status update
• "What should I do next?" for quest recommendations
• "Tell me about my achievements" for achievement progress

How can I assist you today?`;
  }
  
  // Domyślna odpowiedź
  return `
Greetings, ${playerName}! I'm your AI Companion, here to assist you on your quest journey.

You currently have ${activeQuests.length} active quests and you're working towards level ${state.player.level + 1}.

How can I assist you today? You can ask me to create new quests, mark them complete, or provide insights about your progress.`;
}
