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
    healthActivitiesLogged: 0
  },
  recentActivity: [],
  lastSaved: new Date(),
  customHealthActivities: [],
  unlockedAchievements: [],
  unlockedSkills: [],
  aiChatDefaultPrompt: '',
  aiChatHistory: [],
  healthActionTypes: [],
};
