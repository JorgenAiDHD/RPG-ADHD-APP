import type { GameState } from '../types/game';
import { SkillChartSystem } from '../utils/characterClasses';

export interface RepeatableActionsAction {
  type: 'UPDATE_REPEATABLE_ACTION' | 'ADD_REPEATABLE_ACTION' | 'REMOVE_REPEATABLE_ACTION';
  payload: any;
}

export function repeatableActionsReducer(state: GameState, action: RepeatableActionsAction): Partial<GameState> {
  switch (action.type) {
    case 'UPDATE_REPEATABLE_ACTION':
      const { actionId, updates } = action.payload;
      const updatedActions = state.repeatableActions.map(repeatableAction =>
        repeatableAction.id === actionId ? { ...repeatableAction, ...updates } : repeatableAction
      );

      // Check if a daily action was completed (progress increased)
      const oldAction = state.repeatableActions.find(a => a.id === actionId);
      const newAction = updatedActions.find(a => a.id === actionId);
      
      let updatedSkills = state.playerSkills || SkillChartSystem.getDefaultSkills();
      let updatedSkillChart = state.skillChart;

      // If daily action progress increased, update skills
      if (oldAction && newAction && newAction.currentCount > oldAction.currentCount) {
        console.log('📈 Daily action progress increased! Updating skills...', {
          action: newAction.title,
          category: newAction.category,
          oldCount: oldAction.currentCount,
          newCount: newAction.currentCount
        });
        
        // Update skills based on daily action completion
        updatedSkills = SkillChartSystem.updateSkillFromActivity(
          updatedSkills,
          'daily_action_completed',
          newAction.category
        );
        updatedSkillChart = SkillChartSystem.generateSkillChart(updatedSkills);
        
        console.log('🎯 Skills updated after daily action:', updatedSkills);
      }

      return {
        repeatableActions: updatedActions,
        playerSkills: updatedSkills,
        skillChart: updatedSkillChart
      };

    case 'ADD_REPEATABLE_ACTION':
      return {
        repeatableActions: [...state.repeatableActions, action.payload]
      };

    case 'REMOVE_REPEATABLE_ACTION':
      return {
        repeatableActions: state.repeatableActions.filter(repeatableAction => repeatableAction.id !== action.payload)
      };

    default:
      return {};
  }
}
