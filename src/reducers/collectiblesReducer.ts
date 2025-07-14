import type { GameState, Collectible, ActivityLog } from '../types/game';

export type CollectiblesAction =
  | { type: 'ADD_COLLECTIBLE'; payload: Collectible };

export function collectiblesReducer(state: GameState, action: CollectiblesAction): Partial<GameState> {
  switch (action.type) {
    case 'ADD_COLLECTIBLE': {
      const activity: ActivityLog = {
        id: crypto.randomUUID(),
        type: 'collectible_found',
        description: `Found ${action.payload.name}!`,
        timestamp: new Date(),
        xpGained: action.payload.xpValue
      };
      const currentStatistics = state.statistics || { totalXPEarned: 0, totalQuestsCompleted: 0, longestStreak: 0, currentStreak: 0, averageTaskCompletionTime: 0, favoriteQuestTypes: [], collectiblesFound: 0, healthActivitiesLogged: 0 };
      return {
        collectibles: [...state.collectibles, action.payload],
        statistics: { ...currentStatistics, collectiblesFound: currentStatistics.collectiblesFound + 1, totalXPEarned: currentStatistics.totalXPEarned + action.payload.xpValue },
        recentActivity: [activity, ...state.recentActivity.slice(0, 9)]
      };
    }
    default:
      return {};
  }
}

