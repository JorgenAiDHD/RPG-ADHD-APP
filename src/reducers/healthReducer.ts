import type { GameState, HealthActivity } from '../types/game';
import { XPSystem } from '../utils/xpSystem';
import { toast } from 'sonner';

// Reducer odpowiedzialny za pasek zdrowia.
export type HealthAction =
  | { type: 'UPDATE_HEALTH'; payload: { change: number, activity?: HealthActivity } }; // Dodano opcjonalną aktywność

export function healthReducer(state: GameState, action: HealthAction): Partial<GameState> {
  switch (action.type) {
    case 'UPDATE_HEALTH': {
      let healthChange = action.payload.change;
      let xpBonus = 0;

      // Apply CreativeRecharge skill effect
      if (state.unlockedSkills.includes('creative_recharge') && action.payload.activity) {
        const activity = action.payload.activity;
        if (activity.category === 'creative' || (activity.category === 'mental' && activity.name === 'Learning Session')) {
          healthChange += 5; // Bonus HP
          xpBonus += 10; // Bonus XP
          toast.info('Creative Recharge activated! Bonus HP & XP gained.', { duration: 3000 });
        }
      }

      const newHealth = Math.max(0, Math.min(100, state.healthBar.current + healthChange));

      // Zapewnij, że obiekt statistics istnieje i ma domyślne wartości
      const currentStatistics = state.statistics || {
        totalXPEarned: 0,
        totalQuestsCompleted: 0,
        longestStreak: 0,
        currentStreak: 0,
        averageTaskCompletionTime: 0,
        favoriteQuestTypes: [],
        collectiblesFound: 0,
        healthActivitiesLogged: 0
      };

      // Apply XP bonus if any
      let newXP = state.player.xp;
      let newLevel = state.player.level;
      let newSkillPoints = state.player.skillPoints;
      let actualXPGainedFromBonus = 0;

      if (xpBonus > 0) {
        const xpResult = XPSystem.addXP(
          state, // Pass the full state
          state.player.xp,
          state.player.level,
          xpBonus,
          state.player.currentStreak,
          1, // No bonus multiplier for skill XP
          state.unlockedSkills,
          undefined,
          action.payload.activity
        );
        newXP = xpResult.newXP;
        newLevel = xpResult.newLevel;
        newSkillPoints = xpResult.levelUpResult.skillPointsEarned ? state.player.skillPoints + xpResult.levelUpResult.skillPointsEarned : state.player.skillPoints;
        actualXPGainedFromBonus = xpResult.actualXPGained;
      }


      return {
        healthBar: {
          ...state.healthBar,
          current: newHealth,
          lastUpdated: new Date()
        },
        statistics: {
          ...currentStatistics,
          healthActivitiesLogged: currentStatistics.healthActivitiesLogged + 1,
          totalXPEarned: currentStatistics.totalXPEarned + actualXPGainedFromBonus // Add bonus XP to total
        },
        player: {
          ...state.player,
          xp: newXP,
          level: newLevel,
          xpToNextLevel: XPSystem.calculateXPForLevel(newLevel + 1),
          skillPoints: newSkillPoints
        }
      };
    }

    default:
      return {};
  }
}
