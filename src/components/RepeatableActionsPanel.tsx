import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';
import { RotateCcw, Calendar, Trophy } from 'lucide-react';
import { RepeatableActionsSystem, type RepeatableAction } from '../utils/repeatableActions';
import { toast } from 'sonner';

const RepeatableActionsPanel = () => {
  const { state, actions } = useGame();
  const { repeatableActions } = state;

  const handleCompleteAction = (actionId: string) => {
    const action = repeatableActions.find(a => a.id === actionId);
    if (!action) return;

    // Check if already completed for the period
    if (RepeatableActionsSystem.isCompleted(action)) {
      toast.info('Already completed for this period!');
      return;
    }

    // Increment the action
    const updatedAction = RepeatableActionsSystem.incrementAction(action);
    
    // Update state using actions (will need to add this)
    // For now, just show the toast - we'll implement the action later
    
    // Add XP
    actions.addXP({
      amount: action.xpPerCompletion,
      reason: action.title
    });

    // Show completion message
    const isNowCompleted = RepeatableActionsSystem.isCompleted(updatedAction);
    if (isNowCompleted) {
      toast.success(`🎉 ${action.title} completed for today! +${action.xpPerCompletion} XP, +${action.goldPerCompletion} Gold`);
    } else {
      toast.success(`${action.title} progress: ${RepeatableActionsSystem.getCounterText(updatedAction)} (+${action.xpPerCompletion} XP, +${action.goldPerCompletion} Gold)`);
    }
  };

  const resetAction = (actionId: string) => {
    const action = repeatableActions.find(a => a.id === actionId);
    if (!action) return;

    // For now just show toast - we'll implement reset later
    toast.info(`${action.title} counter reset (feature coming soon)`);
  };

  const groupedActions = {
    daily: repeatableActions.filter(a => a.isDaily),
    weekly: repeatableActions.filter(a => a.isWeekly)
  };

  const ActionCard = ({ action }: { action: RepeatableAction }) => {
    const progress = RepeatableActionsSystem.getProgress(action);
    const isCompleted = RepeatableActionsSystem.isCompleted(action);
    const counterText = RepeatableActionsSystem.getCounterText(action);
    const nextResetText = RepeatableActionsSystem.getNextResetText(action);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`border-2 transition-all ${
          isCompleted 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                  {counterText}
                </Badge>
                <Button
                  onClick={() => resetAction(action.id)}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6"
                >
                  <RotateCcw size={12} />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <Progress value={progress} className="h-2" />
            </div>

            {/* Action Info */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Trophy size={12} />
                  {action.xpPerCompletion} XP
                </span>
                <span className="flex items-center gap-1">
                  💰 {action.goldPerCompletion} Gold
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {nextResetText}
              </div>
            </div>

            {/* Complete Button */}
            <Button
              onClick={() => handleCompleteAction(action.id)}
              disabled={isCompleted}
              className={`w-full ${
                isCompleted 
                  ? 'bg-green-600 hover:bg-green-600 text-white cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isCompleted ? '✅ Completed' : '⭐ Complete'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-orange-900/60 to-zinc-900 border-orange-800 text-white shadow-lg shadow-orange-900/30 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-orange-400">
            🔢 Repeatable Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Actions */}
          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2 text-yellow-300">
              🌅 Daily Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupedActions.daily.map(action => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>

          {/* Weekly Actions */}
          <div>
            <h3 className="text-md font-semibold mb-3 flex items-center gap-2 text-blue-300">
              📅 Weekly Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupedActions.weekly.map(action => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>

          {repeatableActions.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              <p>No repeatable actions configured.</p>
              <p className="text-sm">Default actions will be loaded automatically.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepeatableActionsPanel;
