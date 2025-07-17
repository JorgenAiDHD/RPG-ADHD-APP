// Enhanced Activity History & Statistics System for v0.2
import type { ActivityLog, GameState } from '../types/game';

export interface StatisticsData {
  totalQuestsCompleted: number;
  totalXPEarned: number;
  totalGoldEarned: number;
  longestStreak: number;
  currentStreak: number;
  averageTaskCompletionTime: number;
  favoriteQuestTypes: string[];
  collectiblesFound: number;
  healthActivitiesLogged: number;
  focusSessionsCompleted: number;
  totalFocusTime: number; // in minutes
}

export interface DetailedStatistics {
  daily: DailyStats;
  weekly: WeeklyStats;
  monthly: MonthlyStats;
  categories: CategoryStats;
  trends: TrendData;
}

export interface DailyStats {
  questsCompleted: number;
  xpEarned: number;
  goldEarned: number;
  healthActivities: number;
  focusTime: number;
  date: Date;
}

export interface WeeklyStats {
  questsCompleted: number;
  xpEarned: number;
  averageDaily: number;
  streakDays: number;
  weekStart: Date;
}

export interface MonthlyStats {
  questsCompleted: number;
  xpEarned: number;
  averageDaily: number;
  bestWeek: number;
  monthStart: Date;
}

export interface CategoryStats {
  work: number;
  personal: number;
  health: number;
  learning: number;
  creative: number;
  social: number;
}

export interface TrendData {
  xpTrend: number[]; // Last 7 days
  questTrend: number[]; // Last 7 days
  streakTrend: number[]; // Last 30 days
  categoryDistribution: CategoryStats;
}

export class ActivityHistorySystem {
  // Analyze activity patterns
  static analyzeActivityPatterns(recentActivity: ActivityLog[]): DetailedStatistics {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      daily: this.calculateDailyStats(recentActivity, today),
      weekly: this.calculateWeeklyStats(recentActivity, thisWeek),
      monthly: this.calculateMonthlyStats(recentActivity, thisMonth),
      categories: this.calculateCategoryStats(recentActivity),
      trends: this.calculateTrends(recentActivity)
    };
  }

  // Calculate daily statistics
  static calculateDailyStats(activities: ActivityLog[], date: Date): DailyStats {
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= date && activityDate < new Date(date.getTime() + 24 * 60 * 60 * 1000);
    });

    return {
      questsCompleted: dayActivities.filter(a => a.type === 'quest_completed').length,
      xpEarned: dayActivities.reduce((sum, a) => sum + (a.xpGained || 0), 0),
      goldEarned: dayActivities.reduce((sum, a) => sum + (a.goldGained || 0), 0),
      healthActivities: dayActivities.filter(a => a.type === 'health_activity').length,
      focusTime: dayActivities.reduce((sum, a) => sum + (a.focusDuration || 0), 0),
      date
    };
  }

  // Calculate weekly statistics
  static calculateWeeklyStats(activities: ActivityLog[], weekStart: Date): WeeklyStats {
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= weekStart && activityDate < weekEnd;
    });

    const questsCompleted = weekActivities.filter(a => a.type === 'quest_completed').length;
    const xpEarned = weekActivities.reduce((sum, a) => sum + (a.xpGained || 0), 0);

    return {
      questsCompleted,
      xpEarned,
      averageDaily: questsCompleted / 7,
      streakDays: this.calculateWeekStreakDays(weekActivities),
      weekStart
    };
  }

  // Calculate monthly statistics
  static calculateMonthlyStats(activities: ActivityLog[], monthStart: Date): MonthlyStats {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
    const monthActivities = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      return activityDate >= monthStart && activityDate < monthEnd;
    });

    const questsCompleted = monthActivities.filter(a => a.type === 'quest_completed').length;
    const xpEarned = monthActivities.reduce((sum, a) => sum + (a.xpGained || 0), 0);
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();

    return {
      questsCompleted,
      xpEarned,
      averageDaily: questsCompleted / daysInMonth,
      bestWeek: this.calculateBestWeekInMonth(monthActivities),
      monthStart
    };
  }

  // Calculate category statistics
  static calculateCategoryStats(activities: ActivityLog[]): CategoryStats {
    // Note: This would need quest category information in ActivityLog
    // For now, returning default values
    return {
      work: 0,
      personal: 0,
      health: activities.filter(a => a.type === 'health_activity').length,
      learning: 0,
      creative: 0,
      social: 0
    };
  }

  // Calculate trend data
  static calculateTrends(activities: ActivityLog[]): TrendData {
    const now = new Date();
    const last7Days = [];
    const last30Days = [];

    // Calculate XP and quest trends for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStats = this.calculateDailyStats(activities, date);
      last7Days.push(dayStats.xpEarned);
    }

    // Calculate streak trend for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        return activityDate >= date && activityDate < new Date(date.getTime() + 24 * 60 * 60 * 1000);
      });
      last30Days.push(dayActivities.length > 0 ? 1 : 0);
    }

    return {
      xpTrend: last7Days,
      questTrend: last7Days.map((_, i) => {
        const date = new Date(now.getTime() - ((6 - i) * 24 * 60 * 60 * 1000));
        const dayStats = this.calculateDailyStats(activities, date);
        return dayStats.questsCompleted;
      }),
      streakTrend: last30Days,
      categoryDistribution: this.calculateCategoryStats(activities)
    };
  }

  // Helper: Calculate streak days in a week
  static calculateWeekStreakDays(weekActivities: ActivityLog[]): number {
    const days = new Set();
    weekActivities.forEach(activity => {
      const date = new Date(activity.timestamp);
      days.add(date.toDateString());
    });
    return days.size;
  }

  // Helper: Calculate best week in month
  static calculateBestWeekInMonth(monthActivities: ActivityLog[]): number {
    // Simplified: return total quests in the month
    return monthActivities.filter(a => a.type === 'quest_completed').length;
  }

  // Get achievement-worthy statistics
  static getAchievementStats(state: GameState): any {
    return {
      totalQuests: state.quests.filter(q => q.status === 'completed').length,
      totalXP: state.player.xp,
      currentLevel: state.player.level,
      longestStreak: state.player.longestStreak,
      currentStreak: state.player.currentStreak,
      collectiblesFound: state.collectibles.length,
      healthActivities: state.recentActivity.filter(a => a.type === 'health_activity').length,
      focusSessions: state.recentActivity.filter(a => a.type === 'focus_session').length
    };
  }

  // Get progress insights
  static getProgressInsights(state: GameState): string[] {
    const insights = [];
    const recentActivity = state.recentActivity;
    const last7Days = recentActivity.filter(activity => {
      const daysDiff = (Date.now() - new Date(activity.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    // Activity level insights
    if (last7Days.length === 0) {
      insights.push("🔄 You haven't been active lately. Try completing a small quest to get back on track!");
    } else if (last7Days.length < 3) {
      insights.push("📈 Your activity is picking up! Try to complete at least one quest daily.");
    } else if (last7Days.length >= 7) {
      insights.push("🔥 Great consistency! You've been active every day this week!");
    }

    // Streak insights
    if (state.player.currentStreak === 0) {
      insights.push("🎯 Start a new streak today by completing any quest!");
    } else if (state.player.currentStreak >= 7) {
      insights.push(`⚡ Amazing ${state.player.currentStreak}-day streak! Keep the momentum going!`);
    }

    // Level insights
    const xpProgress = (state.player.xp / state.player.xpToNextLevel) * 100;
    if (xpProgress >= 80) {
      insights.push("🌟 You're close to leveling up! Complete another quest to reach the next level!");
    }

    // Category balance insights
    const questTypes = last7Days
      .filter(a => a.type === 'quest_completed')
      .map(a => a.description);
    
    if (questTypes.length > 0) {
      insights.push("💡 Try mixing different quest categories (Work, Health, Learning) for balanced growth!");
    }

    return insights.slice(0, 3); // Return top 3 insights
  }

  // Get weekly summary
  static getWeeklySummary(state: GameState): any {
    const now = new Date();
    const weekStart = new Date(now.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));
    const weekStats = this.calculateWeeklyStats(state.recentActivity, weekStart);
    
    return {
      ...weekStats,
      comparison: {
        questsVsLastWeek: 0, // Would need historical data
        xpVsLastWeek: 0,
        improvement: weekStats.questsCompleted > 5 ? 'Great' : weekStats.questsCompleted > 2 ? 'Good' : 'Needs Improvement'
      }
    };
  }
}
