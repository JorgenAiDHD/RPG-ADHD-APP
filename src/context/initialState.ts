import { GameState } from '../types/game';

export const initialState: GameState = {
  player: {
    id: 'player_1',
    name: 'Hero',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    skillPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date(),
    gold: 0,
    streakGoal: 7,
    streakReward: 100,
    lastStreakRewardClaimed: 0
  },
  mainQuest: {
    title: 'Begin Your Journey',
    description: 'Complete your first quest to start building momentum',
    isActive: true
  },
  currentSeason: {
    id: 'season_1',
    title: 'Foundation Building',
    description: 'Establish core systems and routines',
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    progress: 0,
    goals: [
      'Complete 10 daily quests',
      'Collect your first rare item',
      'Maintain 7-day streak',
      'Unlock the collectibles system'
    ]
  },
  quests: [],
  collectibles: [],
  healthBar: {
    current: 100,
    maximum: 100,
    lastUpdated: new Date()
  },
  energySystem: {
    current: 80,          // Start with good energy
    maximum: 100,
    dailyRating: 4,       // 4/5 stars default
    sleepHours: 7,        // Default sleep hours
    moodLevel: 7,         // Good mood (1-10)
    anxietyLevel: 3,      // Low anxiety (1-10)
    stressLevel: 4,       // Moderate stress (1-10)
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
    longestFocusSession: 0, // in minutes
    taskSwitchesInDay: 0,
    creativeTasksThisWeek: 0,
    quickTasksCompleted: 0, // tasks completed in <5 min
    maxTaskCombo: 0, // consecutive tasks without breaks
    bigTasksCompleted: 0, // major/difficult tasks
    morningActivitiesStreak: 0,
    movementForFocus: 0, // times exercise was used for focus
    systemImprovements: 0, // bugs fixed/systems improved
    automatedSystems: 0, // automated habits/systems
    routineConsistency: 0, // days of consistent routine
    specialInterestHours: 0, // hours on special interests
    sensoryManagement: 0 // successful sensory environment management
  },
  recentActivity: [],
  lastSaved: new Date(),
  customHealthActivities: [],
  unlockedAchievements: [],
  unlockedSkills: [],
  aiChatDefaultPrompt: '',
  aiChatHistory: [],
  healthActionTypes: [],
  
  // v0.2 New Fields
  skillChart: {
    skills: [
      { 
        id: 'focus', 
        name: 'Focus', 
        level: 1, 
        experience: 0,
        maxLevel: 50,
        category: 'mental',
        icon: '🎯',
        description: 'Ability to maintain concentration and avoid distractions'
      },
      { 
        id: 'meditation', 
        name: 'Meditation', 
        level: 1, 
        experience: 0,
        maxLevel: 50,
        category: 'mental',
        icon: '🧘',
        description: 'Practice of mindfulness and inner peace'
      },
      { 
        id: 'exercise', 
        name: 'Exercise', 
        level: 1, 
        experience: 0,
        maxLevel: 50,
        category: 'physical',
        icon: '💪',
        description: 'Physical fitness and strength training'
      },
      { 
        id: 'diet', 
        name: 'Diet', 
        level: 1, 
        experience: 0,
        maxLevel: 50,
        category: 'physical',
        icon: '🥗',
        description: 'Healthy eating habits and nutrition'
      },
      { 
        id: 'learning', 
        name: 'Learning', 
        level: 1, 
        experience: 0,
        maxLevel: 50,
        category: 'creative',
        icon: '📚',
        description: 'Acquiring new knowledge and skills'
      },
      { 
        id: 'creativity', 
        name: 'Creativity', 
        level: 1, 
        experience: 0,
        maxLevel: 50,
        category: 'creative',
        icon: '🎨',
        description: 'Artistic expression and innovative thinking'
      }
    ],
    overallLevel: 1,
    strongestSkill: 'focus',
    weakestSkill: 'creativity',
    balance: 100
  },
  activeQuestId: null,
  repeatableActions: [],
  undoHistory: [],
  currentCharacterClass: undefined,
  playerSkills: [],
  activeChallenges: [],
  completedChallenges: [],
  habitBosses: [],
  
  // Enhanced Tracking & Analytics v0.2
  journals: [],
  streakChallenges: [],

  // v0.3 Inner Realms Expansion 🌌
  emotionRealms: [],
  currentRealmState: {
    currentMood: 3,
    currentEmotion: 'focus',
    activeRealm: null,
    transitionDuration: 2,
    lastMoodUpdate: new Date()
  },
  realmProgress: [],
  activeRealmEvents: []
};
