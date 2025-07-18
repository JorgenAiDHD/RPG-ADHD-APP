import type { GameState } from '../types/game';

export interface RepeatableActionsAction {
  type: 'UPDATE_REPEATABLE_ACTION' | 'ADD_REPEATABLE_ACTION' | 'REMOVE_REPEATABLE_ACTION';
  payload: any;
}

export function repeatableActionsReducer(state: GameState, action: RepeatableActionsAction): Partial<GameState> {
  switch (action.type) {
    case 'UPDATE_REPEATABLE_ACTION':
      const { actionId, updates } = action.payload;
      return {
        repeatableActions: state.repeatableActions.map(repeatableAction =>
          repeatableAction.id === actionId ? { ...repeatableAction, ...updates } : repeatableAction
        )
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
