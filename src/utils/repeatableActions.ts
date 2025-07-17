// Repeatable Actions System for tracking daily activities with counters

export interface RepeatableAction {
  id: string;
  questId: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  lastCompletedDate: Date;
  isDaily: boolean;
  isWeekly: boolean;
  resetDate: Date; // When the counter resets
  xpPerCompletion: number;
  goldPerCompletion: number;
  category: 'health' | 'learning' | 'work' | 'personal' | 'creative' | 'social';
  icon: string;
}

export class RepeatableActionsSystem {
  // Check if action should reset (daily/weekly)
  static shouldReset(action: RepeatableAction): boolean {
    const now = new Date();
    const resetDate = new Date(action.resetDate);
    
    if (action.isDaily) {
      // Reset if it's a new day
      return now.getDate() !== resetDate.getDate() || 
             now.getMonth() !== resetDate.getMonth() || 
             now.getFullYear() !== resetDate.getFullYear();
    }
    
    if (action.isWeekly) {
      // Reset if it's a new week (assuming week starts on Monday)
      const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysSinceReset >= 7;
    }
    
    return false;
  }

  // Reset action counter
  static resetAction(action: RepeatableAction): RepeatableAction {
    return {
      ...action,
      currentCount: 0,
      resetDate: new Date(),
      lastCompletedDate: new Date()
    };
  }

  // Increment action counter
  static incrementAction(action: RepeatableAction): RepeatableAction {
    const now = new Date();
    
    // Check if should reset first
    if (this.shouldReset(action)) {
      const resetAction = this.resetAction(action);
      return {
        ...resetAction,
        currentCount: 1,
        lastCompletedDate: now
      };
    }
    
    return {
      ...action,
      currentCount: Math.min(action.currentCount + 1, action.targetCount),
      lastCompletedDate: now
    };
  }

  // Check if action is completed for the period
  static isCompleted(action: RepeatableAction): boolean {
    return action.currentCount >= action.targetCount;
  }

  // Get progress percentage
  static getProgress(action: RepeatableAction): number {
    return Math.min((action.currentCount / action.targetCount) * 100, 100);
  }

  // Get display text for counter
  static getCounterText(action: RepeatableAction): string {
    return `${action.currentCount}/${action.targetCount}`;
  }

  // Get next reset time text
  static getNextResetText(action: RepeatableAction): string {
    if (action.isDaily) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return `Resets in ${Math.ceil((tomorrow.getTime() - Date.now()) / (1000 * 60 * 60))} hours`;
    }
    
    if (action.isWeekly) {
      const nextMonday = new Date();
      const daysUntilMonday = (8 - nextMonday.getDay()) % 7 || 7;
      nextMonday.setDate(nextMonday.getDate() + daysUntilMonday);
      nextMonday.setHours(0, 0, 0, 0);
      return `Resets in ${Math.ceil((nextMonday.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`;
    }
    
    return '';
  }

  // Create default repeatable actions
  static getDefaultRepeatableActions(): RepeatableAction[] {
    const now = new Date();
    
    return [
      {
        id: 'meditation_daily',
        questId: 'daily_meditation',
        title: 'Daily Meditation',
        description: 'Meditate for peace of mind',
        targetCount: 1,
        currentCount: 0,
        lastCompletedDate: now,
        isDaily: true,
        isWeekly: false,
        resetDate: now,
        xpPerCompletion: 25,
        goldPerCompletion: 5,
        category: 'health',
        icon: '🧘'
      },
      {
        id: 'exercise_daily',
        questId: 'daily_exercise',
        title: 'Exercise',
        description: 'Physical activity for health',
        targetCount: 1,
        currentCount: 0,
        lastCompletedDate: now,
        isDaily: true,
        isWeekly: false,
        resetDate: now,
        xpPerCompletion: 30,
        goldPerCompletion: 8,
        category: 'health',
        icon: '💪'
      },
      {
        id: 'reading_daily',
        questId: 'daily_reading',
        title: 'Reading',
        description: 'Read for knowledge and growth',
        targetCount: 3,
        currentCount: 0,
        lastCompletedDate: now,
        isDaily: true,
        isWeekly: false,
        resetDate: now,
        xpPerCompletion: 15,
        goldPerCompletion: 3,
        category: 'learning',
        icon: '📚'
      },
      {
        id: 'gratitude_daily',
        questId: 'daily_gratitude',
        title: 'Gratitude Journal',
        description: 'Write things you are grateful for',
        targetCount: 1,
        currentCount: 0,
        lastCompletedDate: now,
        isDaily: true,
        isWeekly: false,
        resetDate: now,
        xpPerCompletion: 10,
        goldPerCompletion: 2,
        category: 'personal',
        icon: '🙏'
      },
      {
        id: 'social_weekly',
        questId: 'weekly_social',
        title: 'Social Connection',
        description: 'Connect with friends or family',
        targetCount: 3,
        currentCount: 0,
        lastCompletedDate: now,
        isDaily: false,
        isWeekly: true,
        resetDate: now,
        xpPerCompletion: 20,
        goldPerCompletion: 5,
        category: 'social',
        icon: '👥'
      },
      {
        id: 'creative_weekly',
        questId: 'weekly_creative',
        title: 'Creative Expression',
        description: 'Engage in creative activities',
        targetCount: 2,
        currentCount: 0,
        lastCompletedDate: now,
        isDaily: false,
        isWeekly: true,
        resetDate: now,
        xpPerCompletion: 25,
        goldPerCompletion: 6,
        category: 'creative',
        icon: '🎨'
      }
    ];
  }
}
