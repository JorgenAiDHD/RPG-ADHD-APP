import { useReducer, useEffect, useContext, createContext, ReactNode, useState } from 'react';
import { GameState, XPGain, Quest, HealthActivity, HealthActivityType, Collectible, Season, ActivityLog, ChatMessage, EnergySystem, EmotionRealm } from '../types/game';
import { playerReducer } from '../reducers/playerReducer';
import { questReducer } from '../reducers/questReducer';
import { healthReducer } from '../reducers/healthReducer';
import { collectiblesReducer } from '../reducers/collectiblesReducer';
import { generalReducer } from '../reducers/generalReducer';
import { repeatableActionsReducer, RepeatableActionsAction } from '../reducers/repeatableActionsReducer';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { DEFAULT_HEALTH_ACTIVITIES } from '../data/healthActivities';
import { RepeatableActionsSystem } from '../utils/repeatableActions';
import { SkillChartSystem } from '../utils/characterClasses';
import { InnerRealmSystem } from '../utils/innerRealmSystem';
import { MoodEnvironmentEngine } from '../utils/moodEnvironmentEngine';
import ManageHealthActivitiesDialog from '../components/ManageHealthActivitiesDialog';

import type { PlayerAction } from '../reducers/playerReducer';
import type { QuestAction } from '../reducers/questReducer';
import type { HealthAction } from '../reducers/healthReducer';
import type { CollectiblesAction } from '../reducers/collectiblesReducer';
import type { GeneralAction } from '../reducers/generalReducer';
import { analyticsReducer, type AnalyticsAction } from '../reducers/analyticsReducer';
import type { GameAction } from '../types/game';

// Główny reducer, który deleguje akcje do mniejszych reducerów

const initialState: GameState = {
  player: {
    id: 'player_1',
    name: 'Hero',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    skillPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString(), // Store as ISO string for better serialization
    gold: 0, // Początkowa ilość złota
    streakGoal: 7, // Cel ciągu to 7 dni
    streakReward: 50, // Nagroda 50 złota za osiągnięcie celu ciągu
    lastStreakRewardClaimed: 0 // Początkowo nie ma nagrodzonych ciągów
  },
  healthActionTypes: [], // Initialize empty array that will be filled with DEFAULT_HEALTH_ACTIVITIES
  mainQuest: {
    title: 'Begin Your Journey',
    description: 'Complete your first quest to start building momentum',
    isActive: true
  },
  activeQuestId: null, // New: No active quest initially
  currentSeason: {
    id: 'season_1',
    title: 'Foundation Building',
    description: 'Establish core systems and routines',
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dni od teraz
    progress: 0,
    goals: [
      'Complete 10 daily quests',
      'Collect your first rare item',
      'Maintain 7-day streak',
      'Unlock the collectibles system'
    ]
  },
  quests: [
    {
      id: crypto.randomUUID(),
      title: 'Set Up Your Workspace',
      description: 'Organize your desk and digital workspace for maximum productivity',
      type: 'main',
      category: 'work',
      xpReward: 50,
      priority: 'high',
      status: 'active',
      createdDate: new Date(),
      estimatedTime: 30,
      difficultyLevel: 2,
      energyRequired: 'medium',
      anxietyLevel: 'comfortable',
      tags: ['productivity', 'setup', 'environment']
    },
    {
      id: crypto.randomUUID(),
      title: 'Daily Reflection',
      description: 'Write 3 things you accomplished today and 1 thing you learned',
      type: 'daily',
      category: 'personal',
      xpReward: 15,
      priority: 'medium',
      status: 'active',
      createdDate: new Date(),
      estimatedTime: 10,
      difficultyLevel: 1,
      energyRequired: 'low',
      anxietyLevel: 'comfortable',
      tags: ['reflection', 'growth', 'mindfulness']
    },
    {
      id: crypto.randomUUID(),
      title: 'Tackle That Dreaded Task',
      description: 'Pick one task you\'ve been avoiding and just start it (even for 5 minutes)',
      type: 'side',
      category: 'personal',
      xpReward: 35,
      priority: 'high',
      status: 'active',
      createdDate: new Date(),
      estimatedTime: 15,
      difficultyLevel: 4,
      energyRequired: 'high',
      anxietyLevel: 'challenging',
      tags: ['anxiety', 'avoidance', 'breakthrough']
    }
  ],
  repeatableActions: [], // Will be populated with default actions
  undoHistory: [], // New: Undo system for accidental clicks
  collectibles: [],
  healthBar: {
    current: 100,
    maximum: 100,
    lastUpdated: new Date()
  },
  energySystem: {
    current: 80,
    maximum: 100,
    dailyRating: 4,
    sleepHours: 7,
    moodLevel: 7,
    anxietyLevel: 3,
    stressLevel: 4,
    lastUpdated: new Date()
  },
  settings: {
    soundEnabled: true,
    animationsEnabled: true,
    notificationsEnabled: false,
    theme: 'dark',
    dailyXPGoal: 100,
    maxActiveQuests: 5
  },
  statistics: {
    totalXPEarned: 0,
    totalQuestsCompleted: 0,
    longestStreak: 0,
    currentStreak: 0,
    averageTaskCompletionTime: 0,
    favoriteQuestTypes: [],
    collectiblesFound: 0,
    healthActivitiesLogged: 0,
    // Enhanced Statistics for UX/UI Enhancements v0.2
    longestFocusSession: 0,
    taskSwitchesInDay: 0,
    creativeTasksThisWeek: 0,
    quickTasksCompleted: 0,
    maxTaskCombo: 0,
    bigTasksCompleted: 0,
    morningActivitiesStreak: 0,
    movementForFocus: 0,
    systemImprovements: 0,
    automatedSystems: 0,
    routineConsistency: 0,
    specialInterestHours: 0,
    sensoryManagement: 0
  },
  recentActivity: [],
  lastSaved: new Date(),
  customHealthActivities: [],
  unlockedAchievements: [],
  unlockedSkills: [],
  aiChatDefaultPrompt: '',
  aiChatHistory: [],
  // Character Classes & Stats for v0.2
  currentCharacterClass: 'novice', // Start with Novice class
  playerSkills: SkillChartSystem.getDefaultSkills(), // Initialize with default skills
  skillChart: SkillChartSystem.generateSkillChart(SkillChartSystem.getDefaultSkills()), // Generate initial chart
  // Super Challenges & Habit Bosses for v0.2
  activeChallenges: [], // No active challenges initially
  completedChallenges: [], // No completed challenges
  habitBosses: [], // Will be populated with active habit bosses
  dailyChallenge: undefined, // Will be set daily
  
  // Enhanced Tracking & Analytics v0.2
  journals: [], // Multi-journal system
  streakChallenges: [], // Streak challenges
  
  // v0.3 Inner Realms Expansion - Emotion-to-RPG World System 🌌
  emotionRealms: InnerRealmSystem.getDefaultRealms(), // Initialize with default realms
  currentRealmState: {
    currentMood: 3,
    currentEmotion: 'calm',
    activeRealm: null,
    transitionDuration: 0,
    lastMoodUpdate: new Date()
  }, // Default neutral mood state
  realmProgress: [], // Empty array of RealmProgress objects
  activeRealmEvents: [] // No active realm events initially
};

function gameReducer(state: GameState, action: GameAction): GameState {
  const MOTIVATIONAL_QUOTES = [
    'You are capable of amazing things!',
    'Small steps every day lead to big results.',
    'Progress, not perfection!',
    'You can do hard things.',
    'Stay curious, stay motivated!',
    'Your effort matters more than you think.',
    'Celebrate every win, no matter how small.'
  ];
  let updates: Partial<GameState> = {};

  switch (action.type) {
    case 'TOGGLE_COLORBLIND_MODE':
      return { ...state, colorblindMode: !state.colorblindMode };
    case 'TOGGLE_LARGE_FONT':
      return { ...state, largeFont: !state.largeFont };
    case 'SHOW_MOTIVATIONAL_QUOTE':
      return { ...state, lastMotivationalQuote: MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)] };
    case 'UPDATE_STREAK':
    case 'ADD_XP':
    case 'ACTIVATE_BONUS_XP':
    case 'SPEND_SKILL_POINTS':
    case 'ADD_HEALTH':
    case 'ADD_GOLD':      // Dodanie obsługi złota
    case 'SPEND_GOLD':    // Dodanie obsługi wydawania złota
    case 'CLAIM_STREAK_REWARD': // Dodanie obsługi nagrody za streak
      updates = playerReducer(state, action as PlayerAction);
      break;
    case 'COMPLETE_QUEST':
    case 'ADD_QUEST':
    case 'SET_MAIN_QUEST':
    case 'SET_ACTIVE_QUEST':
      updates = questReducer(state, action as QuestAction);
      break;
    case 'UPDATE_HEALTH':
    case 'UPDATE_ENERGY_SYSTEM': // Dodana nowa akcja
      updates = healthReducer(state, action as HealthAction);
      break;
    case 'ADD_COLLECTIBLE':
      updates = collectiblesReducer(state, action as CollectiblesAction);
      break;
    case 'ADD_JOURNAL_ENTRY':
    case 'INITIALIZE_JOURNALS':
    case 'ADD_STREAK_CHALLENGE':
    case 'UPDATE_STREAK_CHALLENGE':
      updates = analyticsReducer(state, action as AnalyticsAction);
      break;
    case 'UPDATE_REPEATABLE_ACTION':
    case 'ADD_REPEATABLE_ACTION':
    case 'REMOVE_REPEATABLE_ACTION':
      updates = repeatableActionsReducer(state, action as RepeatableActionsAction);
      break;
    case 'LOAD_GAME_STATE':
    case 'UPDATE_SEASON_PROGRESS':
    case 'LOG_ACTIVITY':
    case 'UPDATE_SEASON':
    case 'ADD_HEALTH_ACTIVITY':
    case 'UPDATE_HEALTH_ACTIVITY':
    case 'REMOVE_HEALTH_ACTIVITY':
    case 'UNLOCK_ACHIEVEMENT':
    case 'UNLOCK_SKILL':
    case 'SET_AI_CHAT_PROMPT':
    case 'ADD_CHAT_MESSAGE':
    case 'CLEAR_CHAT_HISTORY':
      updates = generalReducer(state, action as GeneralAction);
      break;
    
    // v0.3 Inner Realms Actions
    case 'UPDATE_MOOD_ENVIRONMENT':
      updates = {
        currentRealmState: InnerRealmSystem.generateMoodEnvironmentSync(
          action.payload.mood,
          action.payload.emotion as import('../types/game').EmotionRealm['emotionType'],
          state.emotionRealms
        )
      };
      break;
      
    case 'SELECT_REALM':
      const selectedRealm = state.emotionRealms.find(realm => realm.id === action.payload);
      if (selectedRealm) {
        // Update realm intensity and progress
        const updatedRealms = state.emotionRealms.map(realm => 
          realm.id === action.payload 
            ? { ...realm, currentIntensity: InnerRealmSystem.updateRealmIntensity(realm, 'visit') }
            : realm
        );
        
        // Update or create realm progress
        const existingProgress = state.realmProgress.find(p => p.realmId === action.payload);
        const updatedProgress = existingProgress 
          ? state.realmProgress.map(p => 
              p.realmId === action.payload 
                ? { ...p, visitCount: p.visitCount + 1, lastVisited: new Date() }
                : p
            )
          : [...state.realmProgress, {
              realmId: action.payload,
              visitCount: 1,
              totalTimeSpent: 0,
              eventsTriggered: [],
              narrativesUnlocked: [],
              masteryLevel: 5,
              lastVisited: new Date()
            }];
        
        updates = {
          emotionRealms: updatedRealms,
          realmProgress: updatedProgress,
          currentRealmState: {
            ...state.currentRealmState,
            activeRealm: action.payload
          }
        };
      }
      break;
      
    case 'UPDATE_REALM_INTENSITY':
      updates = {
        emotionRealms: state.emotionRealms.map(realm => 
          realm.id === action.payload.realmId
            ? { 
                ...realm, 
                currentIntensity: InnerRealmSystem.updateRealmIntensity(
                  realm, 
                  action.payload.activity as any,
                  action.payload.duration
                ) 
              }
            : realm
        )
      };
      break;
      
    case 'TRIGGER_REALM_EVENT':
      updates = {
        emotionRealms: state.emotionRealms.map(realm => 
          realm.id === action.payload.realmId
            ? {
                ...realm,
                realmEvents: realm.realmEvents.map(event =>
                  event.id === action.payload.eventId
                    ? { ...event, isActive: true }
                    : event
                )
              }
            : realm
        ),
        activeRealmEvents: [...state.activeRealmEvents, action.payload.eventId]
      };
      break;
      
    case 'UNLOCK_NARRATIVE':
      updates = {
        emotionRealms: state.emotionRealms.map(realm => 
          realm.id === action.payload.realmId
            ? {
                ...realm,
                narrativeFragments: realm.narrativeFragments.map(fragment =>
                  fragment.id === action.payload.narrativeId
                    ? { ...fragment, isUnlocked: true }
                    : fragment
                )
              }
            : realm
        )
      };
      break;
      
    default:
      return state;
  }
  return {
    ...state,
    ...updates,
    lastSaved: new Date()
  };
}

interface GameContextType {
  state: GameState;
  actions: {
    completeQuest: (questId: string) => void;
    addXP: (xpGain: XPGain) => void;
    addQuest: (quest: Quest) => void;
    editQuest: (quest: Quest) => void;
    updateHealth: (change: number, activity?: HealthActivity) => void;
    updateEnergySystem: (energySystem: EnergySystem) => void; // Nowa akcja
    setMainQuest: (title: string, description: string) => void;
    setActiveQuest: (questId: string | null) => void;
    updateSeasonProgress: (progress: number) => void;
    addCollectible: (collectible: Collectible) => void;
    updateStreak: (date?: Date) => void;
    activateBonusXP: (multiplier: number, duration: number, reason: string) => void;
    updateSeason: (season: Season) => void;
    addHealthActivity: (activity: HealthActivity) => void;
    updateHealthActivity: (activity: HealthActivity) => void;
    removeHealthActivity: (activityId: string) => void;
    addHealthActionType: (activityType: HealthActivityType) => void;
    updateHealthActionType: (activityType: HealthActivityType) => void;
    removeHealthActionType: (activityTypeId: string) => void;
    logActivity: (activity: ActivityLog) => void;
    unlockAchievement: (achievementId: string) => void;
    unlockSkill: (skillId: string) => void;
    spendSkillPoints: (amount: number) => void;
    addHealth: (amount: number) => void;
    setAIChatPrompt: (prompt: string) => void;
    openAIChat: (prompt?: string) => void;
    closeAIChat: () => void;
    addChatMessage: (message: ChatMessage) => void;
    clearChatHistory: () => void;
    openManageHealthActivitiesDialog: () => void;
    closeManageHealthActivitiesDialog: () => void;
    addGold: (amount: number, reason: string) => void;
    spendGold: (amount: number, reason: string) => void;
    claimStreakReward: (streakCount: number) => void;
    
    // Enhanced Tracking & Analytics v0.2
    addJournalEntry: (journalId: string, entry: any) => void;
    initializeJournals: () => void;
    addStreakChallenge: (challenge: any) => void;
    updateStreakChallenge: (challengeId: string, updates: any) => void;
    
    // v0.3 Inner Realms Expansion Actions 🌌
    updateMoodEnvironment: (mood: number, emotion: EmotionRealm['emotionType']) => void;
    selectRealm: (realmId: string) => void;
    updateRealmIntensity: (realmId: string, activity: string, duration?: number) => void;
    triggerRealmEvent: (realmId: string, eventId: string) => void;
    unlockNarrative: (realmId: string, narrativeId: string) => void;
    
    // Repeatable Actions methods
    updateRepeatableAction: (actionId: string, updates: any) => void;
    addRepeatableAction: (action: any) => void;
    removeRepeatableAction: (actionId: string) => void;

    // ADHD-friendly quick actions
    toggleColorblindMode: () => void;
    toggleLargeFont: () => void;
    showMotivationalQuote: () => void;
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);

function GameProvider({ children }: { children: ReactNode }) {
  // Create a modified initial state with default health action types and repeatable actions
  const initialStateWithHealthActions = {
    ...initialState,
    healthActionTypes: DEFAULT_HEALTH_ACTIVITIES,
    repeatableActions: RepeatableActionsSystem.getDefaultRepeatableActions(),
    journals: [],
    streakChallenges: []
  };
  
  const [state, dispatch] = useReducer(gameReducer, initialStateWithHealthActions);
  
  // Dialog states
  const [isManageHealthActivitiesOpen, setManageHealthActivitiesOpen] = useState(false);

  // Inicjalizacja streaka przy starcie aplikacji
  useEffect(() => {
    const now = new Date();
    console.log(`Initializing streak with current date: ${now.toISOString()}`);
    dispatch({ type: 'UPDATE_STREAK', payload: { date: now } });
  }, []);

  // Initialize color palette on app start
  useEffect(() => {
    import('../styles/colorPalettes').then(({ getSavedPalette, applyColorPalette }) => {
      const savedPalette = getSavedPalette();
      applyColorPalette(savedPalette);
    });
  }, []);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        parsedState.currentSeason.startDate = new Date(parsedState.currentSeason.startDate);
        parsedState.currentSeason.endDate = new Date(parsedState.currentSeason.endDate);
        parsedState.healthBar.lastUpdated = new Date(parsedState.healthBar.lastUpdated);
        parsedState.lastSaved = new Date(parsedState.lastSaved);
        parsedState.player.lastActiveDate = new Date(parsedState.player.lastActiveDate);
        if (parsedState.bonusXPActive) {
          parsedState.bonusXPActive.expiresAt = new Date(parsedState.bonusXPActive.expiresAt);
        }
        parsedState.quests = parsedState.quests.map((q: any) => ({
          ...q,
          createdDate: new Date(q.createdDate),
          completedDate: q.completedDate ? new Date(q.completedDate) : undefined,
          deadline: q.deadline ? new Date(q.deadline) : undefined,
          category: q.category || 'personal' // Add default category for existing quests
        }));
        parsedState.collectibles = parsedState.collectibles?.map((c: any) => ({
          ...c,
          dateCollected: new Date(c.dateCollected)
        })) || [];
        parsedState.recentActivity = parsedState.recentActivity?.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        })) || [];
        parsedState.statistics = parsedState.statistics || {
          totalXPEarned: 0,
          totalQuestsCompleted: 0,
          longestStreak: 0,
          currentStreak: 0,
          averageTaskCompletionTime: 0,
          favoriteQuestTypes: [],
          collectiblesFound: 0,
          healthActivitiesLogged: 0
        };
        parsedState.customHealthActivities = parsedState.customHealthActivities || [];
        parsedState.healthActionTypes = parsedState.healthActionTypes || [...initialStateWithHealthActions.healthActionTypes];
        parsedState.repeatableActions = parsedState.repeatableActions || [...initialStateWithHealthActions.repeatableActions];
        parsedState.undoHistory = parsedState.undoHistory || [];
        parsedState.unlockedAchievements = parsedState.unlockedAchievements || [];
        parsedState.unlockedSkills = parsedState.unlockedSkills || [];
        parsedState.aiChatDefaultPrompt = parsedState.aiChatDefaultPrompt || '';
        if (parsedState.aiChatHistory && Array.isArray(parsedState.aiChatHistory)) {
          const uniqueChatHistory: ChatMessage[] = [];
          const seenIds = new Set<string>();
          parsedState.aiChatHistory.forEach((msg: ChatMessage) => {
            if (msg.id && typeof msg.id === 'string' && !seenIds.has(msg.id)) {
              uniqueChatHistory.push(msg);
              seenIds.add(msg.id);
            } else if (msg.id) {
              console.warn("Duplicate or invalid chat message ID found in localStorage, skipping:", msg.id);
            }
          });
          parsedState.aiChatHistory = uniqueChatHistory;
        } else {
          parsedState.aiChatHistory = [];
        }
        dispatch({ type: 'LOAD_GAME_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

  // v0.3 Inner Realms - Initialize MoodEnvironmentEngine
  useEffect(() => {
    MoodEnvironmentEngine.initialize(state.emotionRealms);
  }, [state.emotionRealms]);

  useEffect(() => {
    ALL_ACHIEVEMENTS.forEach((achievement) => {
      if (
        achievement.criteria(state) && !state.unlockedAchievements.includes(achievement.id)
      ) {
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement.id });
        dispatch({
          type: 'LOG_ACTIVITY',
          payload: {
            id: crypto.randomUUID(),
            type: 'achievement_unlocked',
            description: `Achievement unlocked: "${achievement.name}"`,
            timestamp: new Date(),
          }
        });
      }
    });
  }, [state.player.level, state.statistics.totalQuestsCompleted, state.player.longestStreak, state.collectibles.length, state.statistics.healthActivitiesLogged, state.unlockedAchievements]);

  const actions = {
    toggleColorblindMode: () => dispatch({ type: 'TOGGLE_COLORBLIND_MODE' }),
    toggleLargeFont: () => dispatch({ type: 'TOGGLE_LARGE_FONT' }),
    showMotivationalQuote: () => dispatch({ type: 'SHOW_MOTIVATIONAL_QUOTE' }),
    editQuest: (quest: Quest) => dispatch({ type: 'EDIT_QUEST', payload: quest }),
    completeQuest: (questId: string) => dispatch({ type: 'COMPLETE_QUEST', payload: questId }),
    addXP: (xpGain: XPGain) => dispatch({ type: 'ADD_XP', payload: xpGain }),
    addQuest: (quest: Quest) => dispatch({ type: 'ADD_QUEST', payload: quest }),
    updateHealth: (change: number, activity?: HealthActivity) => dispatch({ type: 'UPDATE_HEALTH', payload: { change, activity } }),
    updateEnergySystem: (energySystem: EnergySystem) => dispatch({ type: 'UPDATE_ENERGY_SYSTEM', payload: energySystem }),
    setMainQuest: (title: string, description: string) => dispatch({ type: 'SET_MAIN_QUEST', payload: { title, description } }),
    updateSeasonProgress: (progress: number) => dispatch({ type: 'UPDATE_SEASON_PROGRESS', payload: progress }),
    addCollectible: (collectible: Collectible) => dispatch({ type: 'ADD_COLLECTIBLE', payload: collectible }),
    updateStreak: (date?: Date) => dispatch({ type: 'UPDATE_STREAK', payload: date ? { date } : undefined }),
    activateBonusXP: (multiplier: number, duration: number, reason: string) => dispatch({ type: 'ACTIVATE_BONUS_XP', payload: { multiplier, duration, reason } }),
    updateSeason: (season: Season) => dispatch({ type: 'UPDATE_SEASON', payload: season }),
    addHealthActivity: (activity: HealthActivity) => dispatch({ type: 'ADD_HEALTH_ACTIVITY', payload: activity }),
    updateHealthActivity: (activity: HealthActivity) => dispatch({ type: 'UPDATE_HEALTH_ACTIVITY', payload: activity }),
    removeHealthActivity: (activityId: string) => dispatch({ type: 'REMOVE_HEALTH_ACTIVITY', payload: activityId }),
    addHealthActionType: (activityType: HealthActivityType) => dispatch({ type: 'ADD_HEALTH_ACTION_TYPE', payload: activityType }),
    updateHealthActionType: (activityType: HealthActivityType) => dispatch({ type: 'UPDATE_HEALTH_ACTION_TYPE', payload: activityType }),
    removeHealthActionType: (activityTypeId: string) => dispatch({ type: 'REMOVE_HEALTH_ACTION_TYPE', payload: activityTypeId }),
    logActivity: (activity: ActivityLog) => dispatch({ type: 'LOG_ACTIVITY', payload: activity }),
    unlockAchievement: (achievementId: string) => dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievementId }),
    unlockSkill: (skillId: string) => dispatch({ type: 'UNLOCK_SKILL', payload: skillId }),
    spendSkillPoints: (amount: number) => dispatch({ type: 'SPEND_SKILL_POINTS', payload: { amount } }),
    setActiveQuest: (questId: string | null) => dispatch({ type: 'SET_ACTIVE_QUEST', payload: questId }),
    addHealth: (amount: number) => dispatch({ type: 'ADD_HEALTH', payload: amount }),
    setAIChatPrompt: (prompt: string) => { dispatch({ type: 'SET_AI_CHAT_PROMPT', payload: prompt }); },
    openAIChat: (prompt?: string) => { if (prompt) { dispatch({ type: 'SET_AI_CHAT_PROMPT', payload: prompt }); } },
    closeAIChat: () => {
      dispatch({ type: 'SET_AI_CHAT_PROMPT', payload: '' });
      dispatch({ type: 'CLEAR_CHAT_HISTORY' });
    },
    addChatMessage: (message: ChatMessage) => dispatch({ type: 'ADD_CHAT_MESSAGE', payload: message }),
    clearChatHistory: () => dispatch({ type: 'CLEAR_CHAT_HISTORY' }),
    openManageHealthActivitiesDialog: () => setManageHealthActivitiesOpen(true),
    closeManageHealthActivitiesDialog: () => setManageHealthActivitiesOpen(false),
    // Nowe akcje dla systemu złota i ciągów
    addGold: (amount: number, reason: string) => dispatch({ type: 'ADD_GOLD', payload: { amount, reason } }),
    spendGold: (amount: number, reason: string) => dispatch({ type: 'SPEND_GOLD', payload: { amount, reason } }),
    claimStreakReward: (streakCount: number) => dispatch({ type: 'CLAIM_STREAK_REWARD', payload: { streakCount } }),
    
    // Enhanced Tracking & Analytics v0.2 actions
    addJournalEntry: (journalId: string, entry: any) => dispatch({ 
      type: 'ADD_JOURNAL_ENTRY', 
      payload: { journalId, entry } 
    }),
    initializeJournals: () => dispatch({ type: 'INITIALIZE_JOURNALS' }),
    addStreakChallenge: (challenge: any) => dispatch({ 
      type: 'ADD_STREAK_CHALLENGE', 
      payload: challenge 
    }),
    updateStreakChallenge: (challengeId: string, updates: any) => dispatch({ 
      type: 'UPDATE_STREAK_CHALLENGE', 
      payload: { challengeId, updates } 
    }),
    
    // v0.3 Inner Realms Expansion Actions 🌌
    updateMoodEnvironment: (mood: number, emotion: EmotionRealm['emotionType']) => {
      dispatch({ type: 'UPDATE_MOOD_ENVIRONMENT', payload: { mood, emotion } });
      // Apply environment changes via MoodEnvironmentEngine
      MoodEnvironmentEngine.applyMoodEnvironment(mood, emotion, state.emotionRealms, true);
    },
    selectRealm: (realmId: string) => dispatch({ type: 'SELECT_REALM', payload: realmId }),
    updateRealmIntensity: (realmId: string, activity: string, duration?: number) => 
      dispatch({ type: 'UPDATE_REALM_INTENSITY', payload: { realmId, activity, duration } }),
    triggerRealmEvent: (realmId: string, eventId: string) => 
      dispatch({ type: 'TRIGGER_REALM_EVENT', payload: { realmId, eventId } }),
    unlockNarrative: (realmId: string, narrativeId: string) => 
      dispatch({ type: 'UNLOCK_NARRATIVE', payload: { realmId, narrativeId } }),
    
    // Repeatable Actions methods
    updateRepeatableAction: (actionId: string, updates: any) => {
      dispatch({ type: 'UPDATE_REPEATABLE_ACTION', payload: { actionId, updates } });
    },
    addRepeatableAction: (action: any) => {
      dispatch({ type: 'ADD_REPEATABLE_ACTION', payload: action });
    },
    removeRepeatableAction: (actionId: string) => {
      dispatch({ type: 'REMOVE_REPEATABLE_ACTION', payload: actionId });
    }
  };

  return (
    <GameContext.Provider value={{ state, actions }}>
      {children}
      <ManageHealthActivitiesDialog 
        open={isManageHealthActivitiesOpen} 
        onOpenChange={setManageHealthActivitiesOpen} 
      />
    </GameContext.Provider>
  );
}

function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export { useGame, GameProvider };
