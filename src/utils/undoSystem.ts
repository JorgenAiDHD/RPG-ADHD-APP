// Undo System for tracking and reverting accidental actions
import type { UndoAction, GameState } from '../types/game';

export class UndoSystem {
  private static readonly MAX_UNDO_HISTORY = 10; // Maximum number of undo actions to keep
  private static readonly DEFAULT_UNDO_TIME_LIMIT = 5; // 5 minutes default undo time limit

  // Add an action to undo history
  static addUndoAction(
    state: GameState,
    type: UndoAction['type'],
    description: string,
    revertAction: () => void,
    originalState: any,
    undoTimeLimit: number = this.DEFAULT_UNDO_TIME_LIMIT
  ): UndoAction[] {
    const undoAction: UndoAction = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date(),
      description,
      revertAction,
      originalState,
      canUndo: true,
      undoTimeLimit
    };

    const newHistory = [undoAction, ...state.undoHistory]
      .slice(0, this.MAX_UNDO_HISTORY);

    return newHistory;
  }

  // Check if an undo action is still valid (within time limit)
  static isUndoValid(undoAction: UndoAction): boolean {
    if (!undoAction.canUndo) return false;
    
    const now = new Date();
    const actionTime = new Date(undoAction.timestamp);
    const timeDiffMinutes = (now.getTime() - actionTime.getTime()) / (1000 * 60);
    
    return timeDiffMinutes <= undoAction.undoTimeLimit;
  }

  // Get valid undo actions (not expired)
  static getValidUndoActions(undoHistory: UndoAction[]): UndoAction[] {
    return undoHistory.filter(action => this.isUndoValid(action));
  }

  // Mark an undo action as used (can't be undone again)
  static markAsUsed(undoHistory: UndoAction[], actionId: string): UndoAction[] {
    return undoHistory.map(action => 
      action.id === actionId 
        ? { ...action, canUndo: false }
        : action
    );
  }

  // Clean up expired undo actions
  static cleanupExpiredActions(undoHistory: UndoAction[]): UndoAction[] {
    return undoHistory.filter(action => this.isUndoValid(action) || !action.canUndo);
  }

  // Get time remaining for undo (in minutes)
  static getTimeRemaining(undoAction: UndoAction): number {
    const now = new Date();
    const actionTime = new Date(undoAction.timestamp);
    const timeDiffMinutes = (now.getTime() - actionTime.getTime()) / (1000 * 60);
    
    return Math.max(0, undoAction.undoTimeLimit - timeDiffMinutes);
  }

  // Get formatted time remaining text
  static getTimeRemainingText(undoAction: UndoAction): string {
    const minutesRemaining = this.getTimeRemaining(undoAction);
    
    if (minutesRemaining < 1) {
      return `${Math.ceil(minutesRemaining * 60)}s`;
    }
    
    return `${Math.ceil(minutesRemaining)}m`;
  }

  // Create undo action for quest completion
  static createQuestCompletionUndo(
    questId: string,
    questTitle: string,
    xpGained: number,
    goldGained: number,
    revertFunction: () => void
  ): Omit<UndoAction, 'id' | 'timestamp'> {
    return {
      type: 'quest_completed',
      description: `Completed "${questTitle}" (+${xpGained} XP, +${goldGained} Gold)`,
      revertAction: revertFunction,
      originalState: { questId, xpGained, goldGained },
      canUndo: true,
      undoTimeLimit: 10 // 10 minutes for quest completion
    };
  }

  // Create undo action for health activity
  static createHealthActivityUndo(
    activityName: string,
    healthChange: number,
    energyChange: number,
    xpGained: number,
    revertFunction: () => void
  ): Omit<UndoAction, 'id' | 'timestamp'> {
    return {
      type: 'health_activity',
      description: `Used "${activityName}" (${healthChange > 0 ? '+' : ''}${healthChange} Health, ${energyChange > 0 ? '+' : ''}${energyChange} Energy, +${xpGained} XP)`,
      revertAction: revertFunction,
      originalState: { activityName, healthChange, energyChange, xpGained },
      canUndo: true,
      undoTimeLimit: 5 // 5 minutes for health activities
    };
  }

  // Create undo action for repeatable action
  static createRepeatableActionUndo(
    actionTitle: string,
    xpGained: number,
    goldGained: number,
    revertFunction: () => void
  ): Omit<UndoAction, 'id' | 'timestamp'> {
    return {
      type: 'repeatable_action',
      description: `Completed "${actionTitle}" (+${xpGained} XP, +${goldGained} Gold)`,
      revertAction: revertFunction,
      originalState: { actionTitle, xpGained, goldGained },
      canUndo: true,
      undoTimeLimit: 3 // 3 minutes for repeatable actions
    };
  }

  // Create undo action for XP gains
  static createXPGainUndo(
    source: string,
    xpAmount: number,
    revertFunction: () => void
  ): Omit<UndoAction, 'id' | 'timestamp'> {
    return {
      type: 'xp_gained',
      description: `Gained ${xpAmount} XP from "${source}"`,
      revertAction: revertFunction,
      originalState: { source, xpAmount },
      canUndo: true,
      undoTimeLimit: 5 // 5 minutes for XP gains
    };
  }

  // Create undo action for gold spending
  static createGoldSpendUndo(
    item: string,
    goldAmount: number,
    revertFunction: () => void
  ): Omit<UndoAction, 'id' | 'timestamp'> {
    return {
      type: 'gold_spent',
      description: `Spent ${goldAmount} Gold on "${item}"`,
      revertAction: revertFunction,
      originalState: { item, goldAmount },
      canUndo: true,
      undoTimeLimit: 15 // 15 minutes for gold spending
    };
  }
}
