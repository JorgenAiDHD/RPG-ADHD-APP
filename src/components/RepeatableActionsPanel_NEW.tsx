import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, Calendar, Trophy, Plus, Sunrise, Target, 
  CheckCircle, RefreshCw, Settings, Trash2, Edit3,
  Clock, Star, Zap, Fire, Coffee, Book
} from 'lucide-react';
import { RepeatableActionsSystem, type RepeatableAction } from '../utils/repeatableActions';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

// Enhanced category icons and colors
const CATEGORY_ICONS = {
  health: { icon: Zap, color: 'emerald', bg: 'from-emerald-500 to-green-600' },
  work: { icon: Target, color: 'blue', bg: 'from-blue-500 to-cyan-600' },
  learning: { icon: Book, color: 'purple', bg: 'from-purple-500 to-indigo-600' },
  habit: { icon: Fire, color: 'orange', bg: 'from-orange-500 to-red-600' },
  social: { icon: Coffee, color: 'pink', bg: 'from-pink-500 to-rose-600' },
  default: { icon: CheckCircle, color: 'gray', bg: 'from-gray-500 to-slate-600' }
};

const RepeatableActionsPanel = () => {
  const { state, actions } = useGame();
  const { repeatableActions } = state;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    category: 'habit',
    frequency: 'daily' as const,
    targetCount: 1,
    xpPerCompletion: 10,
    goldPerCompletion: 5
  });

  const handleCompleteAction = (actionId: string) => {
    const action = repeatableActions.find(a => a.id === actionId);
    if (!action) return;

    // Check if already completed for the period
    if (RepeatableActionsSystem.isCompleted(action)) {
      toast.info('🎯 Already completed for this period!', {
        description: 'Come back tomorrow for more rewards!'
      });
      return;
    }

    // Increment the action
    const updatedAction = RepeatableActionsSystem.incrementAction(action);
    
    // Update the state with the new action data
    actions.updateRepeatableAction(updatedAction);
    
    // Add XP and Gold
    actions.addXP({
      amount: action.xpPerCompletion,
      reason: action.title
    });
    
    actions.addGold({
      amount: action.goldPerCompletion,
      reason: action.title
    });

    // Show completion message with enhanced feedback
    const isNowCompleted = RepeatableActionsSystem.isCompleted(updatedAction);
    const categoryConfig = CATEGORY_ICONS[action.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.default;
    
    if (isNowCompleted) {
      toast.success(`🎉 ${action.title} completed!`, {
        description: `+${action.xpPerCompletion} XP, +${action.goldPerCompletion} Gold`,
        duration: 4000,
        icon: React.createElement(Trophy, { size: 20, className: 'text-yellow-500' })
      });
    } else {
      toast.success(`${action.title} progress updated!`, {
        description: `${RepeatableActionsSystem.getCounterText(updatedAction)} | +${action.xpPerCompletion} XP, +${action.goldPerCompletion} Gold`,
        duration: 3000,
        icon: React.createElement(categoryConfig.icon, { size: 20 })
      });
    }
  };

  const resetAction = (actionId: string) => {
    const action = repeatableActions.find(a => a.id === actionId);
    if (!action) return;

    const resetAction = RepeatableActionsSystem.resetAction(action);
    actions.updateRepeatableAction(resetAction);
    
    toast.info(`🔄 ${action.title} reset`, {
      description: 'Ready for a fresh start!'
    });
  };

  const addNewAction = () => {
    if (!newAction.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const action: RepeatableAction = {
      id: crypto.randomUUID(),
      ...newAction,
      currentCount: 0,
      completedDates: [],
      streak: 0,
      lastCompleted: null,
      createdAt: new Date()
    };

    actions.addRepeatableAction(action);
    setNewAction({
      title: '',
      description: '',
      category: 'habit',
      frequency: 'daily' as const,
      targetCount: 1,
      xpPerCompletion: 10,
      goldPerCompletion: 5
    });
    setShowAddDialog(false);
    
    toast.success(`🌟 ${action.title} added!`, {
      description: 'Start building your streak!'
    });
  };

  const deleteAction = (actionId: string) => {
    const action = repeatableActions.find(a => a.id === actionId);
    if (!action) return;
    
    actions.removeRepeatableAction(actionId);
    toast.info(`🗑️ ${action.title} removed`);
  };

  const getProgressPercentage = (action: RepeatableAction) => {
    return Math.min((action.currentCount / action.targetCount) * 100, 100);
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return Sunrise;
      case 'weekly': return Calendar;
      default: return RotateCcw;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/20 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/10 border-2 border-orange-100 dark:border-orange-800/50 shadow-2xl rounded-2xl">
        {/* Enhanced Header */}
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg">
                  <Sunrise size={28} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  🌅 Daily Actions
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Build lasting habits with consistent daily actions
                </p>
              </div>
            </div>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl px-6 shadow-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Action
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-900/20 border-2 border-orange-200 dark:border-orange-800">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                    <Plus size={24} />
                    New Daily Action
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Action Title
                    </label>
                    <input
                      type="text"
                      value={newAction.title}
                      onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                      placeholder="e.g., Drink 8 glasses of water"
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={newAction.description}
                      onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                      placeholder="Brief description of the action..."
                      className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <select
                        value={newAction.category}
                        onChange={(e) => setNewAction({ ...newAction, category: e.target.value })}
                        className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="health">Health</option>
                        <option value="work">Work</option>
                        <option value="learning">Learning</option>
                        <option value="habit">Habit</option>
                        <option value="social">Social</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Target Count
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={newAction.targetCount}
                        onChange={(e) => setNewAction({ ...newAction, targetCount: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        XP Reward
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={newAction.xpPerCompletion}
                        onChange={(e) => setNewAction({ ...newAction, xpPerCompletion: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Gold Reward
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={newAction.goldPerCompletion}
                        onChange={(e) => setNewAction({ ...newAction, goldPerCompletion: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={addNewAction}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl py-3"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Action
                    </Button>
                    <Button 
                      onClick={() => setShowAddDialog(false)}
                      variant="outline"
                      className="px-6 rounded-xl border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Enhanced Empty State */}
          {repeatableActions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/10 rounded-2xl border-2 border-dashed border-orange-300 dark:border-orange-600/50"
            >
              <Sunrise size={64} className="text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-2">
                Start Your Daily Routine
              </h3>
              <p className="text-orange-600 dark:text-orange-300 max-w-md mb-6">
                Create daily actions to build lasting habits and earn consistent rewards!
              </p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl px-6 py-3"
              >
                <Plus size={16} className="mr-2" />
                Create First Action
              </Button>
            </motion.div>
          ) : (
            /* Enhanced Actions Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              <AnimatePresence>
                {repeatableActions.map((action, index) => {
                  const categoryConfig = CATEGORY_ICONS[action.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.default;
                  const IconComponent = categoryConfig.icon;
                  const progressPercentage = getProgressPercentage(action);
                  const isCompleted = RepeatableActionsSystem.isCompleted(action);
                  const FrequencyIcon = getFrequencyIcon(action.frequency);
                  
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-lg",
                        isCompleted 
                          ? "border-green-300 dark:border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10" 
                          : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600"
                      )}
                    >
                      {/* Action Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-xl",
                            `bg-gradient-to-br ${categoryConfig.bg}`
                          )}>
                            <IconComponent size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {action.title}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <FrequencyIcon size={14} className="text-gray-400" />
                          {action.streak > 0 && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs px-1.5 py-0.5">
                              🔥{action.streak}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Progress: {action.currentCount}/{action.targetCount}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                        <Progress 
                          value={progressPercentage} 
                          className={cn(
                            "h-2",
                            isCompleted ? "bg-green-200 dark:bg-green-900/50" : "bg-gray-200 dark:bg-gray-700"
                          )}
                        />
                      </div>

                      {/* Rewards Display */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" />
                            <span>{action.xpPerCompletion} XP</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Trophy size={12} className="text-yellow-600" />
                            <span>{action.goldPerCompletion} Gold</span>
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                            ✅ Complete
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCompleteAction(action.id)}
                          disabled={isCompleted}
                          className={cn(
                            "flex-1 rounded-xl text-sm font-medium transition-all",
                            isCompleted
                              ? "bg-green-100 text-green-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md"
                          )}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle size={14} className="mr-1" />
                              Done
                            </>
                          ) : (
                            <>
                              <RefreshCw size={14} className="mr-1" />
                              Do It
                            </>
                          )}
                        </Button>
                        
                        <Button
                          onClick={() => resetAction(action.id)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <RotateCcw size={14} />
                        </Button>
                        
                        <Button
                          onClick={() => deleteAction(action.id)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RepeatableActionsPanel;
