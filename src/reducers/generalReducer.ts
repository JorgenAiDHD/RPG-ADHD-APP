import type { GameState, ActivityLog, Season, HealthActivity, HealthActivityType, ChatMessage } from '../types/game';
import { SkillChartSystem } from '../utils/characterClasses';

export type GeneralAction =
  | { type: 'LOAD_GAME_STATE'; payload: GameState }
  | { type: 'UPDATE_SEASON_PROGRESS'; payload: number }
  | { type: 'LOG_ACTIVITY'; payload: ActivityLog }
  | { type: 'UPDATE_SEASON'; payload: Season }
  | { type: 'ADD_HEALTH_ACTIVITY'; payload: HealthActivity }
  | { type: 'UPDATE_HEALTH_ACTIVITY'; payload: HealthActivity }
  | { type: 'REMOVE_HEALTH_ACTIVITY'; payload: string }
  | { type: 'ADD_HEALTH_ACTION_TYPE'; payload: HealthActivityType }
  | { type: 'UPDATE_HEALTH_ACTION_TYPE'; payload: HealthActivityType }
  | { type: 'REMOVE_HEALTH_ACTION_TYPE'; payload: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UNLOCK_SKILL'; payload: string }
  | { type: 'SET_AI_CHAT_PROMPT'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_HISTORY' };

export function generalReducer(state: GameState, action: GeneralAction): Partial<GameState> {
  switch (action.type) {
    case 'LOAD_GAME_STATE':
      return action.payload;

    case 'UPDATE_SEASON_PROGRESS':
      return {
        currentSeason: {
          ...state.currentSeason,
          progress: action.payload
        }
      };

    case 'LOG_ACTIVITY': {
      let updates: Partial<GameState> = {
        recentActivity: [action.payload, ...state.recentActivity.slice(0, 9)]
      };

      // Update skills if it's a focus session
      if (action.payload.type === 'focus_session') {
        const updatedSkills = SkillChartSystem.updateSkillFromActivity(
          state.playerSkills || SkillChartSystem.getDefaultSkills(),
          'focus_session'
        );
        const updatedSkillChart = SkillChartSystem.generateSkillChart(updatedSkills);
        
        updates.playerSkills = updatedSkills;
        updates.skillChart = updatedSkillChart;
      }

      return updates;
    }

    case 'UPDATE_SEASON':
      return {
        currentSeason: action.payload
      };

    case 'ADD_HEALTH_ACTIVITY':
      return {
        customHealthActivities: [...(state.customHealthActivities || []), action.payload]
      };

    case 'UPDATE_HEALTH_ACTIVITY':
      return {
        customHealthActivities: (state.customHealthActivities || []).map(activity =>
          activity.id === action.payload.id ? action.payload : activity
        )
      };

    case 'REMOVE_HEALTH_ACTIVITY':
      return {
        customHealthActivities: (state.customHealthActivities || []).filter(activity =>
          activity.id !== action.payload
        )
      };
      
    case 'ADD_HEALTH_ACTION_TYPE':
      return {
        healthActionTypes: [...(state.healthActionTypes || []), action.payload]
      };
      
    case 'UPDATE_HEALTH_ACTION_TYPE':
      return {
        healthActionTypes: (state.healthActionTypes || []).map(activity =>
          activity.id === action.payload.id ? action.payload : activity
        )
      };
      
    case 'REMOVE_HEALTH_ACTION_TYPE':
      return {
        healthActionTypes: (state.healthActionTypes || []).filter(activity =>
          activity.id !== action.payload
        )
      };

    case 'UNLOCK_ACHIEVEMENT':
      return {
        unlockedAchievements: [...state.unlockedAchievements, action.payload]
      };

    case 'UNLOCK_SKILL':
      return {
        unlockedSkills: [...state.unlockedSkills, action.payload]
      };

    case 'SET_AI_CHAT_PROMPT':
      return {
        aiChatDefaultPrompt: action.payload
      };

    case 'ADD_CHAT_MESSAGE':
      return {
        aiChatHistory: [...state.aiChatHistory, action.payload]
      };

    case 'CLEAR_CHAT_HISTORY':
      return {
        aiChatHistory: []
      };

    default:
      return {};
  }
}
