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

export interface GameState {
  player: Player;
  mainQuest: MainQuest;
  currentSeason: Season;
  quests: Quest[];
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
