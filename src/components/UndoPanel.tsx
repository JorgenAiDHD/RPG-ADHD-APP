import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, Clock, AlertCircle } from 'lucide-react';
import { UndoSystem } from '../utils/undoSystem';
import { toast } from 'sonner';

const UndoPanel = () => {
  const { state } = useGame();
  const { undoHistory } = state;

  // Get valid (not expired) undo actions
  const validUndoActions = UndoSystem.getValidUndoActions(undoHistory);

  const handleUndo = (actionId: string) => {
    const undoAction = validUndoActions.find(action => action.id === actionId);
    if (!undoAction) return;

    try {
      // Execute the revert action
      undoAction.revertAction();
      
      // Mark as used and update state
      // Note: This would require a new action in the reducer
      toast.success(`Undid: ${undoAction.description}`);
    } catch (error) {
      toast.error('Failed to undo action. Please try again.');
      console.error('Undo failed:', error);
    }
  };

  const getActionIcon = (actionType: string) => {
    const icons = {
      'quest_completed': '✅',
      'health_activity': '💪',
      'repeatable_action': '🔢',
      'xp_gained': '⭐',
      'gold_spent': '💰'
    };
    return icons[actionType as keyof typeof icons] || '📝';
  };

  const getActionColor = (actionType: string) => {
    const colors = {
      'quest_completed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
      'health_activity': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
      'repeatable_action': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
      'xp_gained': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
      'gold_spent': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
    };
    return colors[actionType as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
  };

  if (validUndoActions.length === 0) {
    return null; // Don't show the panel if there are no undo actions
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className="bg-gradient-to-br from-gray-900/95 to-black/95 border-gray-700 text-white shadow-2xl backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-300">
            <Undo2 size={16} />
            Recent Actions
            <Badge variant="secondary" className="text-xs ml-auto">
              {validUndoActions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {validUndoActions.slice(0, 5).map((undoAction, index) => {
              const timeRemaining = UndoSystem.getTimeRemainingText(undoAction);
              const isUrgent = UndoSystem.getTimeRemaining(undoAction) < 1;

              return (
                <motion.div
                  key={undoAction.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`p-3 rounded-lg border border-gray-600 bg-gray-800/50 backdrop-blur-sm ${
                    isUrgent ? 'border-red-500/50 bg-red-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg flex-shrink-0 mt-0.5">
                        {getActionIcon(undoAction.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-300 leading-relaxed break-words">
                          {undoAction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs px-1.5 py-0.5 ${getActionColor(undoAction.type)}`}>
                            {undoAction.type.replace('_', ' ')}
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${
                            isUrgent ? 'text-red-400' : 'text-gray-500'
                          }`}>
                            <Clock size={10} />
                            {timeRemaining}
                            {isUrgent && <AlertCircle size={10} />}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUndo(undoAction.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 flex-shrink-0"
                    >
                      <Undo2 size={12} />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {validUndoActions.length > 5 && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                +{validUndoActions.length - 5} more actions
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-gray-600">
            <p className="text-xs text-gray-500 text-center">
              ⏱️ Actions auto-expire after their time limit
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UndoPanel;
