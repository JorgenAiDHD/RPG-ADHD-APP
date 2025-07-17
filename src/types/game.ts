// Typy akcji z reducerów
import type { PlayerAction } from '../reducers/playerReducer';
import type { QuestAction } from '../reducers/questReducer';
import type { HealthAction } from '../reducers/healthReducer';
import type { CollectiblesAction } from '../reducers/collectiblesReducer';
import type { GeneralAction } from '../reducers/generalReducer';

export type GameAction = PlayerAction | QuestAction | HealthAction | CollectiblesAction | GeneralAction;

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}
// Definicje typów dla całej aplikacji.
import type { RepeatableAction } from '../utils/repeatableActions';

export interface Player {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  skillPoints: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date | string | null; // Now can be Date, ISO string format, or null
  gold: number; // Dodanie złota do gracza
  streakGoal: number; // Dodanie celu ciągu (np. 7 dni)
  streakReward: number; // Nagroda za osiągnięcie celu ciągu
  lastStreakRewardClaimed: number; // Ostatni nagrodzony ciąg
}

export interface MainQuest {
  title: string;
  description: string;
  isActive: boolean;
}

export interface Season {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  goals: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'weekly';
  category: 'work' | 'personal' | 'health' | 'learning' | 'creative' | 'social';
  xpReward: number;
  goldReward?: number; // Added goldReward property
  skillTreeCategory?: string;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'completed' | 'failed' | 'paused';
  completedDate?: Date;
  createdDate: Date;
  estimatedTime: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  energyRequired: 'low' | 'medium' | 'high';
  anxietyLevel: 'comfortable' | 'mild' | 'challenging' | 'daunting';
  tags: string[];
  prerequisites?: string[];
  parentQuestId?: string;
}

export interface Collectible {
  id: string;
  name: string;
  type: 'knowledge' | 'skill' | 'insight';
  xpValue: number;
  skillPoints?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
  description: string;
  dateCollected: Date;
  category: string;
  source?: string;
  icon?: string;
}

export interface HealthBar {
  current: number;
  maximum: number;
  lastUpdated: Date;
}

// New Energy & Mood System for v0.2
export interface EnergySystem {
  current: number;        // Current energy level (0-100)
  maximum: number;        // Maximum energy (usually 100)
  dailyRating: number;    // Daily energy rating (1-5 stars)
  sleepHours: number;     // Hours slept last night
  moodLevel: number;      // Current mood (1-10 scale)
  anxietyLevel: number;   // Anxiety level (1-10 scale)
  stressLevel: number;    // Stress level (1-10 scale)
  lastUpdated: Date;
}

// Enhanced Health Activity with Energy impact
export interface HealthActivityType {
  id: string;
  name: string;
  healthChangeAmount: number; // Changed from healthChange to healthChangeAmount
  energyChangeAmount: number; // New: Energy impact
  xpChangeAmount?: number;    // Added XP change amount
  category: 'physical' | 'mental' | 'social' | 'creative';
  duration: number;
  description: string;
  icon: string;
  isPositive: boolean;       // Added to identify if action is positive or negative
  affectsMood?: boolean;     // Whether this activity affects mood
  reducesAnxiety?: boolean;  // Whether this reduces anxiety
}

export interface HealthActivity {
  id: string;
  name: string;
  healthChange: number;
  category: 'physical' | 'mental' | 'social' | 'creative';
  duration: number;
  description: string;
  icon: string;
}

export interface Settings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light';
  dailyXPGoal: number;
  maxActiveQuests: number;
}

export interface Statistics {
  totalXPEarned: number;
  totalQuestsCompleted: number;
  longestStreak: number;
  currentStreak: number;
  averageTaskCompletionTime: number;
  favoriteQuestTypes: string[];
  collectiblesFound: number;
  healthActivitiesLogged: number;
  
  // Enhanced Statistics for UX/UI Enhancements v0.2
  longestFocusSession: number; // in minutes
  taskSwitchesInDay: number;
  creativeTasksThisWeek: number;
  quickTasksCompleted: number; // tasks completed in <5 min
  maxTaskCombo: number; // consecutive tasks without breaks
  bigTasksCompleted: number; // major/difficult tasks
  morningActivitiesStreak: number;
  movementForFocus: number; // times exercise was used for focus
  systemImprovements: number; // bugs fixed/systems improved
  automatedSystems: number; // automated habits/systems
  routineConsistency: number; // days of consistent routine
  specialInterestHours: number; // hours on special interests
  sensoryManagement: number; // successful sensory environment management
}

export interface ActivityLog {
  id: string;
  type: 'quest_completed' | 'collectible_found' | 'health_activity' | 'level_up' | 'achievement_unlocked' | 'focus_session' | 'gold_earned' | 'gold_spent' | 'streak_milestone' | 'streak_reward';
  description: string;
  timestamp: Date;
  xpGained?: number;
  healthChanged?: number;  // Added to track health changes in activity log
  activityType?: string;   // Added to identify the activity type
  focusDuration?: number;  // Added to track focus session duration
  goldGained?: number;     // Added to track gold earned
  goldSpent?: number;      // Added to track gold spent
  streakMilestone?: number; // Added to track streak milestones
}

export interface BonusXPActive {
  multiplier: number;
  expiresAt: Date;
  reason: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: (state: GameState) => boolean;
  
  // Enhanced Achievement Properties for UX/UI Enhancements v0.2
  category?: 'milestone' | 'adhd_strength' | 'gamer' | 'athlete' | 'developer' | 'neurodivergent';
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tips?: string[];
  adhdBenefit?: string;
  unlockedAt?: Date;
  progressNotification?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  unlocked: boolean;
  effect: (state: GameState, xpAmount: number, quest?: Quest, healthActivity?: HealthActivity) => number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

// Undo System for v0.2
export interface UndoAction {
  id: string;
  type: 'quest_completed' | 'health_activity' | 'repeatable_action' | 'xp_gained' | 'gold_spent';
  timestamp: Date;
  description: string;
  revertAction: () => void;
  originalState: any; // Store original state for reverting
  canUndo: boolean;
  undoTimeLimit: number; // Minutes after which undo is no longer available
}

// Character Classes & Stats System for v0.2
export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'basic' | 'advanced' | 'master';
}

export interface PlayerSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxLevel: number;
  category: 'physical' | 'mental' | 'social' | 'creative' | 'technical';
  icon: string;
  description: string;
}

export interface SkillChart {
  skills: PlayerSkill[];
  overallLevel: number;
  strongestSkill: string;
  weakestSkill: string;
  balance: number; // 0-100, how balanced the skills are
}

// Super Challenges & Habit Bosses for v0.2
export interface SuperChallenge {
  id: string;
  title: string;
  description: string;
  type: 'mind_control' | 'creative' | 'memory' | 'focus' | 'physical' | 'social' | 'habit_boss';
  category: 'instant' | 'daily' | 'weekly' | 'progressive';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'legendary';
  duration: number;
  xpReward: number;
  goldReward: number;
  unlockLevel: number;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  instructions?: string[];
  successCriteria?: string[];
  tips?: string[];
  adhdBenefits?: string[];
  skillBoosts?: SkillBoost[];
  tags?: string[];
}

export interface SkillBoost {
  skillId: string;
  boost: number;
  duration: number; // minutes
}

export interface ActiveChallenge {
  challengeId: string;
  startTime: Date;
  progress: number;
  currentStep: number;
  timeRemaining: number;
  isCompleted: boolean;
  attempts: number;
  bestScore?: number;
}

export interface HabitBoss {
  id: string;
  name: string;
  description: string;
  icon: string;
  health: number;
  maxHealth: number;
  level: number;
  habitType: string;
  defeatedDate?: Date;
  weaknesses?: string[];
}

export interface GameState {
  player: Player;
  mainQuest: MainQuest;
  activeQuestId?: string | null; // New: ID of currently active quest
  currentSeason: Season;
  quests: Quest[];
  repeatableActions: RepeatableAction[]; // New: Repeatable actions with counters
  undoHistory: UndoAction[]; // New: Undo system for accidental clicks
  collectibles: Collectible[];
  healthBar: HealthBar;
  energySystem: EnergySystem; // New Energy & Mood system
  settings: Settings;
  statistics: Statistics;
  recentActivity: ActivityLog[];
  lastSaved: Date;
  customHealthActivities: HealthActivity[];
  healthActionTypes: HealthActivityType[]; // Added health action types array
  bonusXPActive?: BonusXPActive;
  unlockedAchievements: string[];
  unlockedSkills: string[];
  aiChatDefaultPrompt: string;
  aiChatHistory: ChatMessage[];
  // Character Classes & Stats for v0.2
  currentCharacterClass?: string; // Current player's character class ID
  playerSkills: PlayerSkill[]; // Player's skill progression
  skillChart: SkillChart; // Current skill chart data
  // Super Challenges & Habit Bosses for v0.2
  activeChallenges: ActiveChallenge[]; // Currently active challenges
  completedChallenges: string[]; // IDs of completed challenges
  habitBosses: HabitBoss[]; // Current habit bosses
  dailyChallenge?: string; // Today's recommended challenge ID
  // Enhanced Tracking & Analytics for v0.2
  journals: Journal[]; // Multi-journal system
  streakChallenges: StreakChallenge[]; // No-sugar, no-alcohol etc challenges
  progressAnalytics?: ProgressAnalytics; // Advanced analytics data
  
  // v0.3 Inner Realms Expansion 🌌
  emotionRealms: EmotionRealm[]; // Inner realm system
  currentRealmState: MoodEnvironmentSync; // Active mood-environment sync
  realmProgress: RealmProgress[]; // Progress tracking per realm
  activeRealmEvents: string[]; // Currently active realm events
}

// Enhanced Tracking & Analytics for v0.2 - Multi-Journal System
export interface JournalEntry {
  id: string;
  type: 'gratitude' | 'good_deeds' | 'savings' | 'ideas' | 'reflection' | 'goals';
  title: string;
  content: string;
  date: Date;
  mood?: number; // 1-10 scale
  tags?: string[];
  category?: string;
  amount?: number; // For savings tracker
  priority?: 'low' | 'medium' | 'high'; // For ideas and goals
}

// v0.3 Inner Realms Expansion - New Core Types 🌌

export interface EmotionRealm {
  id: string;
  name: string;
  emotionType: 'anxiety' | 'focus' | 'creativity' | 'calm' | 'energy' | 'motivation' | 'confidence';
  displayName: string;
  description: string;
  environment: {
    bgColor: string;
    textColor: string;
    accentColor: string;
    ambientEffect: 'fog' | 'clarity' | 'sparkles' | 'rain' | 'sunshine' | 'storm' | 'aurora';
    musicSuggestion?: string;
  };
  unlockConditions: {
    streakDays?: number;
    completedQuests?: number;
    totalXP?: number;
    specificAchievements?: string[];
  };
  isUnlocked: boolean;
  currentIntensity: number; // 0-100
  realmEvents: RealmEvent[];
  narrativeFragments: NarrativeFragment[];
}

export interface RealmEvent {
  id: string;
  title: string;
  description: string;
  triggerCondition: {
    moodRange: [number, number]; // [min, max] 1-5
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
    streakDay?: number;
    realmIntensity?: [number, number];
  };
  effects: {
    environmentChange?: Partial<EmotionRealm['environment']>;
    xpMultiplier?: number;
    buffDuration?: number; // minutes
    narrativeUnlock?: string;
  };
  isActive: boolean;
  lastTriggered?: Date;
}

export interface NarrativeFragment {
  id: string;
  title: string;
  content: string;
  unlockCondition: {
    moodTrend: 'improving' | 'stable' | 'declining';
    realmVisits: number;
    journalEntries?: number;
    consecutiveDays?: number;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
  category: 'discovery' | 'wisdom' | 'challenge' | 'triumph' | 'reflection';
}

export interface MoodEnvironmentSync {
  currentMood: number; // 1-5 scale
  currentEmotion: EmotionRealm['emotionType'];
  activeRealm: string | null;
  environmentOverride?: Partial<EmotionRealm['environment']>;
  transitionDuration: number; // seconds for theme transition
  lastMoodUpdate: Date;
}

export interface RealmProgress {
  realmId: string;
  visitCount: number;
  totalTimeSpent: number; // minutes
  eventsTriggered: string[];
  narrativesUnlocked: string[];
  masteryLevel: number; // 0-100
  lastVisited: Date;
}

export interface Journal {
  id: string;
  name: string;
  type: 'gratitude' | 'good_deeds' | 'savings' | 'ideas' | 'reflection' | 'goals';
  description: string;
  icon: string;
  color: string;
  entries: JournalEntry[];
  isActive: boolean;
  settings: {
    dailyReminder: boolean;
    reminderTime?: string;
    minEntriesPerDay?: number;
    showStats: boolean;
  };
}

export interface StreakChallenge {
  id: string;
  name: string;
  description: string;
  type: 'no_sugar' | 'no_alcohol' | 'no_processed_food' | 'exercise' | 'meditation' | 'custom';
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  currentStreak: number;
  longestStreak: number;
  startDate: Date;
  lastCheckIn: Date;
  isActive: boolean;
  rewards: {
    daysMilestone: number;
    xpReward: number;
    goldReward: number;
    title: string;
  }[];
  dailyCheckIns: {
    date: Date;
    success: boolean;
    notes?: string;
  }[];
}

export interface ProgressAnalytics {
  period: 'week' | 'month' | 'quarter' | 'year';
  data: {
    xpProgress: { date: Date; value: number }[];
    questCompletion: { date: Date; count: number }[];
    energyTrends: { date: Date; energy: number; mood: number }[];
    skillProgression: { skillId: string; values: { date: Date; level: number }[] }[];
    streakPerformance: { challengeId: string; successRate: number; avgStreak: number }[];
  };
  insights: {
    strongestDay: string; // "Monday", "Tuesday", etc.
    mostProductiveTime: string; // "morning", "afternoon", "evening"
    topSkills: string[];
    improvementAreas: string[];
    recommendations: string[];
  };
}

export interface XPSystemResult {
  newXP: number;
  newLevel: number;
  actualXPGained: number;
  levelUpResult: LevelUpResult;
}

export interface LevelUpResult {
  leveledUp: boolean;
  newLevel?: number;
  skillPointsEarned?: number;
  unlockedFeatures?: string[];
}

export interface XPGain {
  amount: number;
  reason?: string;
}
