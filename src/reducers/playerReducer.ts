


export type PlayerAction =
  | { type: 'ADD_XP'; payload: XPGain }
  | { type: 'UPDATE_STREAK'; payload?: { date: Date } } // Make payload optional
  | { type: 'ACTIVATE_BONUS_XP'; payload: { multiplier: number; duration: number; reason: string } }
  | { type: 'SPEND_SKILL_POINTS'; payload: { amount: number } }
  | { type: 'ADD_HEALTH'; payload: number }
  | { type: 'ADD_GOLD'; payload: { amount: number; reason: string } }
  | { type: 'SPEND_GOLD'; payload: { amount: number; reason: string } }
  | { type: 'CLAIM_STREAK_REWARD'; payload: { streakCount: number } };

export function playerReducer(state: GameState, action: PlayerAction): Partial<GameState> {
  switch (action.type) {
    case 'UPDATE_STREAK': {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      
      // Handle date from the previous activity - convert string to Date if needed
      let lastActivityDate: Date | null = null;
      if (state.player.lastActiveDate) {
        if (typeof state.player.lastActiveDate === 'string') {
          lastActivityDate = new Date(state.player.lastActiveDate);
        } else if (state.player.lastActiveDate instanceof Date) {
          lastActivityDate = new Date(state.player.lastActiveDate);
        }
        
        // Set to start of day for consistent comparison
        if (lastActivityDate) {
          lastActivityDate.setHours(0, 0, 0, 0);
        }
      }
      
      // Create date from action payload or use today
      const actionDate = action.payload?.date ? new Date(action.payload.date) : today;
      actionDate.setHours(0, 0, 0, 0); // Set to start of day
      
      let newStreak = state.player.currentStreak;
      let updatedRecentActivity = [...(state.recentActivity || [])];
      let streakUpdated = false;
      
      // Only process streak if we have a valid last activity date
      if (lastActivityDate) {
        // Calculate difference in days
        const diffTime = actionDate.getTime() - lastActivityDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Round to handle DST
        
        console.log(`UPDATE_STREAK: Today: ${actionDate.toISOString()}, Last Activity: ${lastActivityDate.toISOString()}, Diff Days: ${diffDays}, Old Streak: ${state.player.currentStreak}`);
        
        if (diffDays === 0) {
          // Activity already happened today, streak doesn't change
          // But ensure activity is logged by marking streakUpdated true
          // This ensures last active date is updated even if streak count doesn't change
          streakUpdated = true;
          console.log(`Streak unchanged at ${newStreak} days (activity today)`);
        } else if (diffDays === 1) {
          // Activity was yesterday, increment streak
          newStreak = state.player.currentStreak + 1;
          streakUpdated = true;
          console.log(`Streak increased to ${newStreak} days`);
          
          // Log activity for streak milestone (every 3 days or reaching streak goal)
          if (newStreak % 3 === 0 || newStreak === state.player.streakGoal) {
            const streakActivity = {
              id: crypto.randomUUID(),
              type: 'streak_milestone' as 'streak_milestone',
              description: newStreak === state.player.streakGoal 
                ? `🔥 Streak goal achieved: ${newStreak} days! Claim your reward!` 
                : `🔥 Streak maintained for ${newStreak} days!`,
              timestamp: new Date(),
              streakMilestone: newStreak
            };
            
            // Add to recent activity
            updatedRecentActivity = [streakActivity, ...updatedRecentActivity].slice(0, 50);
            console.log(`Added streak milestone activity: ${streakActivity.description}`);
          }
        } else if (diffDays > 1) {
          // Activity was more than 1 day ago, reset streak
          newStreak = 1;
          streakUpdated = true;
          console.log(`Streak reset to ${newStreak} (previous streak broken after ${diffDays} days)`);
          
          const streakBrokenActivity = {
            id: crypto.randomUUID(),
            type: 'streak_broken' as any,
            description: `⚠️ Streak broken. Starting a new streak!`,
            timestamp: new Date()
          };
          
          // Add to recent activity
          updatedRecentActivity = [streakBrokenActivity, ...updatedRecentActivity].slice(0, 50);
        } else {
          // Negative difference - this shouldn't happen in normal cases
          // Possible clock adjustment or timezone issue
          console.warn(`Unexpected day difference: ${diffDays}, using today's date for streak`);
          streakUpdated = true; // Still update the last activity date
        }
      } else {
        // First activity ever, start streak
        newStreak = 1;
        streakUpdated = true;
        console.log(`Starting first streak`);
      }
      
      // Zaktualizuj statystyki
      const currentStatistics = state.statistics || {
        totalXPEarned: 0, totalQuestsCompleted: 0, longestStreak: 0, currentStreak: 0, 
        averageTaskCompletionTime: 0, favoriteQuestTypes: [], collectiblesFound: 0, healthActivitiesLogged: 0
      };
      
      // Wyświetl informację o aktualnym streaku w konsoli
      console.log(`Current streak: ${newStreak}, Longest streak: ${Math.max(state.player.longestStreak || 0, newStreak)}`);
      
      // Set last activity date to today in ISO format for storage
      const newLastActivityDate = today.toISOString();
      
      // Jeśli streak nie został zaktualizowany, nie zmieniaj recentActivity
      if (!streakUpdated) {
        return {
          player: { 
            ...state.player, 
            lastActiveDate: newLastActivityDate
          }
        };
      }
      
      return {
        player: { 
          ...state.player, 
          currentStreak: newStreak, 
          longestStreak: Math.max(state.player.longestStreak || 0, newStreak), 
          lastActiveDate: newLastActivityDate
        },
        statistics: { 
          ...currentStatistics, 
          currentStreak: newStreak, 
          longestStreak: Math.max(currentStatistics.longestStreak || 0, newStreak) 
        },
        recentActivity: updatedRecentActivity
      };
    }
    
    case 'ADD_XP': {
      const bonusMultiplier = state.bonusXPActive && new Date() < state.bonusXPActive.expiresAt ? state.bonusXPActive.multiplier : 1;
      const xpResult = XPSystem.addXP(state, state.player.xp, state.player.level, action.payload.amount, state.player.currentStreak, bonusMultiplier, state.unlockedSkills);
      return {
        player: { 
          ...state.player, 
          xp: xpResult.newXP, 
          level: xpResult.newLevel, 
          xpToNextLevel: XPSystem.calculateXPForLevel(xpResult.newLevel + 1), 
          skillPoints: state.player.skillPoints + (xpResult.levelUpResult.skillPointsEarned || 0) 
        },
        statistics: { 
          ...state.statistics, 
          totalXPEarned: (state.statistics?.totalXPEarned || 0) + xpResult.actualXPGained 
        }
      };
    }
    
    case 'ADD_GOLD': {
      // Dodanie złota graczowi z zapisem w dzienniku aktywności
      let goldAmount = action.payload.amount;
      const reason = action.payload.reason || 'Unknown reason';
      
      console.log(`Reducer: ADD_GOLD - Adding ${goldAmount} gold for reason: ${reason}`);
      console.log(`Debug - Current player state:`, state.player);
      console.log(`Debug - Current gold before update: ${state.player.gold}`);
      
      // Validate gold amount to prevent errors
      if (typeof goldAmount !== 'number' || isNaN(goldAmount) || goldAmount <= 0) {
        console.error(`Invalid gold amount: ${goldAmount}. Using default of 1.`);
        // Use a fallback value of 1 gold
        goldAmount = 1;
      }
      
      const goldActivity = {
        id: crypto.randomUUID(),
        type: 'gold_earned' as 'gold_earned',
        description: `💰 Earned ${goldAmount} gold: ${reason}`,
        timestamp: new Date(),
        goldGained: goldAmount
      };
      
      if (!state.recentActivity) {
        state.recentActivity = [];
      }
      
      // Add to recent activity
      const updatedRecentActivity = [goldActivity, ...state.recentActivity].slice(0, 50);
      
      const newGoldTotal = state.player.gold + goldAmount;
      console.log(`Gold updated: ${state.player.gold} + ${goldAmount} = ${newGoldTotal}`);
      
      return {
        player: {
          ...state.player,
          gold: newGoldTotal
        },
        recentActivity: updatedRecentActivity
      };
    }
    
    case 'SPEND_GOLD': {
      // Wydawanie złota z zapisem w dzienniku
      const goldAmount = action.payload.amount;
      
      // Sprawdzamy czy gracz ma wystarczającą ilość złota
      if (state.player.gold < goldAmount) {
        // Nie ma wystarczającej ilości złota
        return {};
      }
      
      const goldActivity = {
        id: crypto.randomUUID(),
        type: 'gold_spent' as 'gold_spent',
        description: `💸 Spent ${goldAmount} gold: ${action.payload.reason}`,
        timestamp: new Date(),
        goldSpent: goldAmount
      };
      
      if (!state.recentActivity) {
        state.recentActivity = [];
      }
      
      // Add to recent activity
      const updatedRecentActivity = [goldActivity, ...state.recentActivity].slice(0, 50);
      
      return {
        player: {
          ...state.player,
          gold: state.player.gold - goldAmount
        },
        recentActivity: updatedRecentActivity
      };
    }
    
    case 'CLAIM_STREAK_REWARD': {
      // Nagradzanie za osiągnięcie celu ciągu dni
      const streakCount = action.payload.streakCount;
      
      // Sprawdzamy czy nagroda może zostać przyznana (streakCount jest wielokrotnością streakGoal)
      // i czy nie została jeszcze przyznana (lastStreakRewardClaimed < streakCount)
      if (streakCount % state.player.streakGoal !== 0 || state.player.lastStreakRewardClaimed >= streakCount) {
        return {};
      }
      
      const rewardAmount = state.player.streakReward;
      
      const rewardActivity = {
        id: crypto.randomUUID(),
        type: 'streak_reward' as 'streak_reward',
        description: `🏆 Claimed ${rewardAmount} gold for ${streakCount} day streak!`,
        timestamp: new Date(),
        goldGained: rewardAmount,
        streakMilestone: streakCount
      };
      
      if (!state.recentActivity) {
        state.recentActivity = [];
      }
      
      // Add to recent activity
      const updatedRecentActivity = [rewardActivity, ...state.recentActivity].slice(0, 50);
      
      return {
        player: {
          ...state.player,
          gold: state.player.gold + rewardAmount,
          lastStreakRewardClaimed: streakCount
        },
        recentActivity: updatedRecentActivity
      };
    }
    
    case 'ACTIVATE_BONUS_XP': {
      const bonusXPActive: BonusXPActive = {
        multiplier: action.payload.multiplier,
        expiresAt: new Date(Date.now() + action.payload.duration * 60000),
        reason: action.payload.reason
      };
      return { bonusXPActive };
    }
    
    case 'SPEND_SKILL_POINTS':
      return { player: { ...state.player, skillPoints: state.player.skillPoints - action.payload.amount } };
      
    case 'ADD_HEALTH':
      return { healthBar: { ...state.healthBar, current: Math.min(state.healthBar.maximum, state.healthBar.current + action.payload) } };
      
    default:
      return {};
  }
}
import type { GameState, XPGain, BonusXPActive } from '../types/game';
import { XPSystem } from '../utils/xpSystem';
