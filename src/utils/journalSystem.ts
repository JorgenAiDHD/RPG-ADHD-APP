// Enhanced Tracking & Analytics - Multi-Journal System v0.2
import type { Journal, JournalEntry, StreakChallenge } from '../types/game';

export class JournalSystem {
  // Default journal templates
  static getDefaultJournals(): Journal[] {
    return [
      {
        id: 'gratitude_journal',
        name: 'Gratitude Journal',
        type: 'gratitude',
        description: 'Daily gratitude practice for better mental health',
        icon: '🙏',
        color: '#fbbf24',
        entries: [],
        isActive: true,
        settings: {
          dailyReminder: true,
          reminderTime: '21:00',
          minEntriesPerDay: 3,
          showStats: true
        }
      },
      {
        id: 'good_deeds_log',
        name: 'Good Deeds Log',
        type: 'good_deeds',
        description: 'Track acts of kindness and helping others',
        icon: '❤️',
        color: '#ef4444',
        entries: [],
        isActive: true,
        settings: {
          dailyReminder: false,
          showStats: true
        }
      },
      {
        id: 'savings_tracker',
        name: 'Savings Tracker',
        type: 'savings',
        description: 'Track money saved and financial goals',
        icon: '💰',
        color: '#10b981',
        entries: [],
        isActive: true,
        settings: {
          dailyReminder: false,
          showStats: true
        }
      },
      {
        id: 'ideas_notebook',
        name: 'Ideas & Plans',
        type: 'ideas',
        description: 'Capture creative ideas and future plans',
        icon: '💡',
        color: '#8b5cf6',
        entries: [],
        isActive: true,
        settings: {
          dailyReminder: false,
          showStats: false
        }
      }
    ];
  }

  // Create new journal entry
  static createEntry(
    type: JournalEntry['type'],
    title: string, 
    content: string,
    options?: Partial<JournalEntry>
  ): JournalEntry {
    return {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      content,
      date: new Date(),
      ...options
    };
  }

  // Add entry to journal
  static addEntryToJournal(journals: Journal[], journalId: string, entry: JournalEntry): Journal[] {
    return journals.map(journal => {
      if (journal.id === journalId) {
        return {
          ...journal,
          entries: [entry, ...journal.entries]
        };
      }
      return journal;
    });
  }

  // Get journal stats
  static getJournalStats(journal: Journal) {
    const entries = journal.entries;
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const todayEntries = entries.filter(entry => 
      entry.date.toDateString() === today.toDateString()
    );
    
    const weekEntries = entries.filter(entry => entry.date >= thisWeek);
    const monthEntries = entries.filter(entry => entry.date >= thisMonth);

    const avgMood = entries
      .filter(entry => entry.mood)
      .reduce((sum, entry) => sum + (entry.mood || 0), 0) / 
      (entries.filter(entry => entry.mood).length || 1);

    const totalSaved = journal.type === 'savings' 
      ? entries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
      : 0;

    return {
      totalEntries: entries.length,
      todayEntries: todayEntries.length,
      weekEntries: weekEntries.length,
      monthEntries: monthEntries.length,
      avgMood: Math.round(avgMood * 10) / 10,
      totalSaved,
      longestStreak: this.calculateLongestStreak(entries),
      currentStreak: this.calculateCurrentStreak(entries)
    };
  }

  // Calculate streak for daily entries
  private static calculateCurrentStreak(entries: JournalEntry[]): number {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const hasEntry = entries.some(entry => 
        entry.date.toDateString() === currentDate.toDateString()
      );
      
      if (!hasEntry) break;
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  private static calculateLongestStreak(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0;

    const sortedDates = entries
      .map(entry => entry.date.toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort();

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }

  // Get insights for journal
  static getJournalInsights(journal: Journal): string[] {
    const stats = this.getJournalStats(journal);
    const insights: string[] = [];

    if (stats.currentStreak >= 3) {
      insights.push(`🔥 Amazing! You're on a ${stats.currentStreak}-day streak!`);
    }

    if (stats.avgMood >= 8) {
      insights.push(`😊 Your mood ratings are excellent! Keep doing what you're doing.`);
    } else if (stats.avgMood <= 5) {
      insights.push(`💙 Consider adding more self-care activities to boost your mood.`);
    }

    if (journal.type === 'gratitude' && stats.weekEntries >= 7) {
      insights.push(`🙏 Daily gratitude practice is proven to increase happiness by 25%!`);
    }

    if (journal.type === 'savings' && stats.totalSaved > 0) {
      insights.push(`💰 You've saved $${stats.totalSaved}! Every dollar counts toward your goals.`);
    }

    if (stats.monthEntries === 0) {
      insights.push(`📝 Start small - even one entry can make a difference!`);
    }

    return insights;
  }

  // Search entries across all journals
  static searchEntries(journals: Journal[], query: string): JournalEntry[] {
    const results: JournalEntry[] = [];
    const searchLower = query.toLowerCase();

    journals.forEach(journal => {
      journal.entries.forEach(entry => {
        if (
          entry.title.toLowerCase().includes(searchLower) ||
          entry.content.toLowerCase().includes(searchLower) ||
          entry.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        ) {
          results.push(entry);
        }
      });
    });

    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}

// Streak Challenges System
export class StreakChallengeSystem {
  static getDefaultChallenges(): StreakChallenge[] {
    return [
      {
        id: 'no_sugar_challenge',
        name: 'No Sugar Challenge',
        description: 'Eliminate added sugars for better health and energy',
        type: 'no_sugar',
        icon: '🍭❌',
        difficulty: 'medium',
        currentStreak: 0,
        longestStreak: 0,
        startDate: new Date(),
        lastCheckIn: new Date(),
        isActive: false,
        dailyCheckIns: [],
        rewards: [
          { daysMilestone: 3, xpReward: 50, goldReward: 25, title: 'Sugar Warrior' },
          { daysMilestone: 7, xpReward: 150, goldReward: 75, title: 'Sweet Victory' },
          { daysMilestone: 21, xpReward: 500, goldReward: 250, title: 'Sugar Slayer' },
          { daysMilestone: 30, xpReward: 1000, goldReward: 500, title: 'Sugar-Free Legend' }
        ]
      },
      {
        id: 'no_alcohol_challenge',
        name: 'No Alcohol Challenge',
        description: 'Improve health and mental clarity by avoiding alcohol',
        type: 'no_alcohol',
        icon: '🍺❌',
        difficulty: 'hard',
        currentStreak: 0,
        longestStreak: 0,
        startDate: new Date(),
        lastCheckIn: new Date(),
        isActive: false,
        dailyCheckIns: [],
        rewards: [
          { daysMilestone: 7, xpReward: 200, goldReward: 100, title: 'Clear Mind' },
          { daysMilestone: 30, xpReward: 1000, goldReward: 500, title: 'Alcohol-Free Month' },
          { daysMilestone: 90, xpReward: 3000, goldReward: 1500, title: 'Sobriety Champion' }
        ]
      },
      {
        id: 'no_processed_food_challenge',
        name: 'No Processed Food',
        description: 'Eat whole, natural foods for optimal nutrition',
        type: 'no_processed_food',
        icon: '🍟❌',
        difficulty: 'hard',
        currentStreak: 0,
        longestStreak: 0,
        startDate: new Date(),
        lastCheckIn: new Date(),
        isActive: false,
        dailyCheckIns: [],
        rewards: [
          { daysMilestone: 7, xpReward: 200, goldReward: 100, title: 'Whole Food Warrior' },
          { daysMilestone: 21, xpReward: 750, goldReward: 375, title: 'Natural Nutrition Master' },
          { daysMilestone: 60, xpReward: 2000, goldReward: 1000, title: 'Clean Eating Legend' }
        ]
      },
      {
        id: 'daily_exercise_challenge',
        name: 'Daily Exercise',
        description: 'Move your body every day for physical and mental health',
        type: 'exercise',
        icon: '🏃‍♂️',
        difficulty: 'medium',
        currentStreak: 0,
        longestStreak: 0,
        startDate: new Date(),
        lastCheckIn: new Date(),
        isActive: false,
        dailyCheckIns: [],
        rewards: [
          { daysMilestone: 7, xpReward: 150, goldReward: 75, title: 'Fitness Starter' },
          { daysMilestone: 30, xpReward: 750, goldReward: 375, title: 'Exercise Habit Master' },
          { daysMilestone: 100, xpReward: 3000, goldReward: 1500, title: 'Fitness Legend' }
        ]
      }
    ];
  }

  static checkIn(challenge: StreakChallenge, success: boolean, notes?: string): StreakChallenge {
    const today = new Date();
    const todayStr = today.toDateString();
    
    // Check if already checked in today
    const alreadyCheckedIn = challenge.dailyCheckIns.some(
      checkIn => checkIn.date.toDateString() === todayStr
    );

    if (alreadyCheckedIn) {
      return challenge; // No double check-ins
    }

    const newCheckIn = {
      date: today,
      success,
      notes
    };

    let newCurrentStreak = challenge.currentStreak;
    
    if (success) {
      newCurrentStreak++;
    } else {
      newCurrentStreak = 0;
    }

    return {
      ...challenge,
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(challenge.longestStreak, newCurrentStreak),
      lastCheckIn: today,
      dailyCheckIns: [...challenge.dailyCheckIns, newCheckIn]
    };
  }

  static getEarnedRewards(challenge: StreakChallenge): typeof challenge.rewards {
    return challenge.rewards.filter(reward => 
      challenge.currentStreak >= reward.daysMilestone
    );
  }

  static getNextReward(challenge: StreakChallenge) {
    return challenge.rewards.find(reward => 
      challenge.currentStreak < reward.daysMilestone
    );
  }

  static getChallengeStats(challenge: StreakChallenge) {
    const totalCheckIns = challenge.dailyCheckIns.length;
    const successfulCheckIns = challenge.dailyCheckIns.filter(c => c.success).length;
    const successRate = totalCheckIns > 0 ? (successfulCheckIns / totalCheckIns) * 100 : 0;
    
    const last7Days = challenge.dailyCheckIns
      .filter(c => c.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    
    const weeklySuccessRate = last7Days.length > 0 
      ? (last7Days.filter(c => c.success).length / last7Days.length) * 100 
      : 0;

    return {
      totalDays: totalCheckIns,
      successfulDays: successfulCheckIns,
      overallSuccessRate: Math.round(successRate),
      weeklySuccessRate: Math.round(weeklySuccessRate),
      currentStreak: challenge.currentStreak,
      longestStreak: challenge.longestStreak,
      daysActive: Math.ceil((new Date().getTime() - challenge.startDate.getTime()) / (1000 * 60 * 60 * 24))
    };
  }
}
