import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { motion } from 'framer-motion';
import { 
  Edit, Save, Target, Crown, Calendar, Clock, 
  Star, Trophy, ChevronRight, Settings,
  Play, Pause, CheckCircle, AlertCircle,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

const EditableMainQuest = () => {
  const { state, actions } = useGame();
  const { mainQuest, quests, activeQuestId } = state;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mainQuest.title);
  const [description, setDescription] = useState(mainQuest.description);
  const [showActiveQuestDialog, setShowActiveQuestDialog] = useState(false);

  const activeQuest = activeQuestId ? quests.find(q => q.id === activeQuestId) : null;
  const availableQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');
  
  // Calculate main quest progress based on completed quests
  const totalQuests = quests.length;
  const progressPercentage = totalQuests > 0 ? Math.round((completedQuests.length / totalQuests) * 100) : 0;

  const handleSave = () => {
    actions.setMainQuest(title, description);
    setEditing(false);
  };

  const setActiveQuest = (questId: string | null) => {
    actions.setActiveQuest(questId);
    setShowActiveQuestDialog(false);
  };

  const getQuestPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getQuestTypeIcon = (type: string) => {
    switch (type) {
      case 'main': return Crown;
      case 'side': return Target;
      case 'daily': return Calendar;
      case 'weekly': return Clock;
      default: return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Main Quest Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-violet-900/80 border-2 border-purple-500/50 text-white shadow-2xl shadow-purple-900/50 rounded-2xl backdrop-blur-sm">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
          </div>

          <CardHeader className="relative pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                    <Crown size={32} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-3 text-purple-100">
                    Main Quest
                    <Badge className="bg-purple-500/80 text-purple-100 border-purple-400">
                      Epic
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-purple-200">
                    <div className="flex items-center gap-1">
                      <Trophy size={16} />
                      <span>{completedQuests.length}/{totalQuests} Complete</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      <span>{progressPercentage}% Progress</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {!editing && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setEditing(true)}
                  className="text-purple-100 hover:bg-purple-800/50 hover:text-white border border-purple-500/50"
                >
                  <Edit size={18} className="mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-purple-200 mb-2">
                <span>Main Quest Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-purple-900/50 border border-purple-500/30" 
              />
            </div>
          </CardHeader>

          <CardContent className="relative">
            {editing ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-purple-200 mb-2 block">Quest Title</label>
                  <input
                    className="w-full rounded-xl bg-purple-900/50 border-2 border-purple-500/50 px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter your epic main quest..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-purple-200 mb-2 block">Quest Description</label>
                  <textarea
                    className="w-full rounded-xl bg-purple-900/50 border-2 border-purple-500/50 px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 min-h-[100px] resize-none"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe the journey and ultimate goal..."
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSave} 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save Quest
                  </Button>
                  <Button 
                    onClick={() => setEditing(false)} 
                    variant="outline"
                    className="border-purple-500/50 text-purple-200 hover:bg-purple-800/50 px-6 py-2 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="font-bold text-2xl mb-3 text-white leading-tight">
                    {mainQuest.title || "Define Your Epic Journey"}
                  </h3>
                  <p className="text-purple-100 text-lg leading-relaxed">
                    {mainQuest.description || "Set your ultimate goal and break it down into achievable quests. Your main quest guides your entire adventure."}
                  </p>
                </div>

                {/* Quest Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-purple-800/50 rounded-xl p-4 border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-100">{totalQuests}</div>
                    <div className="text-sm text-purple-300">Total Quests</div>
                  </div>
                  <div className="bg-green-800/50 rounded-xl p-4 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-100">{completedQuests.length}</div>
                    <div className="text-sm text-green-300">Completed</div>
                  </div>
                  <div className="bg-blue-800/50 rounded-xl p-4 border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-100">{availableQuests.length}</div>
                    <div className="text-sm text-blue-300">Active</div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Active Quest Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-blue-900/80 via-cyan-900/60 to-teal-900/80 border-2 border-blue-500/50 text-white shadow-2xl shadow-blue-900/50 rounded-2xl backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg">
                    <Target size={28} className="text-white" />
                  </div>
                  {activeQuest && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-3 text-blue-100">
                    Current Focus
                    {activeQuest && (
                      <Badge className="bg-blue-500/80 text-blue-100 border-blue-400">
                        Active
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-blue-200 mt-1">
                    {activeQuest ? "Your current objective" : "Choose a quest to focus on"}
                  </p>
                </div>
              </div>
              
              {availableQuests.length > 0 && (
                <Button 
                  onClick={() => setShowActiveQuestDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Settings size={16} />
                  {activeQuest ? 'Switch' : 'Select'}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {activeQuest ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="bg-blue-800/50 rounded-xl p-4 border border-blue-500/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-white flex items-center gap-2">
                        {activeQuest.title}
                        <div className={cn("w-3 h-3 rounded-full", getQuestPriorityColor(activeQuest.priority))}></div>
                      </h3>
                      <p className="text-blue-100 text-sm leading-relaxed mb-3">
                        {activeQuest.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-500/20">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Star size={16} />
                        <span className="text-sm font-medium">{activeQuest.xpReward} XP</span>
                      </div>
                    </div>
                    <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-500/20">
                      <div className="flex items-center gap-2 text-blue-200">
                        <Clock size={16} />
                        <span className="text-sm font-medium">{activeQuest.estimatedTime}m</span>
                      </div>
                    </div>
                    <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-500/20">
                      <Badge className={cn("text-xs px-2 py-1", getCategoryColor(activeQuest.category))}>
                        {activeQuest.category}
                      </Badge>
                    </div>
                    <div className="bg-blue-900/50 rounded-lg p-3 border border-blue-500/20">
                      <Badge className="bg-blue-600/80 text-blue-100 text-xs px-2 py-1">
                        {activeQuest.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setActiveQuest(null)} 
                      variant="outline"
                      className="border-blue-400/50 text-blue-200 hover:bg-blue-800/50 rounded-xl flex items-center gap-2"
                    >
                      <Pause size={16} />
                      Clear Focus
                    </Button>
                    <Button 
                      onClick={() => setShowActiveQuestDialog(true)}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2"
                    >
                      <ChevronRight size={16} />
                      Switch Quest
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  <Target size={64} className="text-blue-300/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-100 mb-2">No Active Quest</h3>
                  <p className="text-blue-200 max-w-md mx-auto">
                    Choose a quest to focus on and track your progress. Having an active quest helps maintain focus and momentum.
                  </p>
                </div>
                
                {availableQuests.length > 0 ? (
                  <Button 
                    onClick={() => setShowActiveQuestDialog(true)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <Play size={18} />
                    Select Active Quest
                  </Button>
                ) : (
                  <div className="text-blue-300 text-sm">
                    <p>No quests available.</p>
                    <p className="mt-1">Create your first quest to get started!</p>
                  </div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Quest Selection Dialog */}
      <Dialog open={showActiveQuestDialog} onOpenChange={setShowActiveQuestDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-blue-900 border-2 border-blue-500/50 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Target size={24} className="text-blue-400" />
              Select Active Quest
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div className="text-sm text-blue-200 mb-4">
              Choose a quest to focus on. Your active quest will be highlighted and easily accessible.
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableQuests.map(quest => {
                const QuestIcon = getQuestTypeIcon(quest.type);
                return (
                  <motion.button
                    key={quest.id}
                    onClick={() => setActiveQuest(quest.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border-2 transition-all hover:scale-[1.02]",
                      activeQuestId === quest.id 
                        ? "bg-blue-800/80 border-blue-400 shadow-lg shadow-blue-500/20" 
                        : "bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 hover:border-gray-500"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          activeQuestId === quest.id ? "bg-blue-600" : "bg-gray-700"
                        )}>
                          <QuestIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">{quest.title}</h3>
                          <p className="text-sm text-gray-300 mt-1">{quest.description}</p>
                        </div>
                      </div>
                      <div className={cn("w-3 h-3 rounded-full mt-1", getQuestPriorityColor(quest.priority))}></div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star size={12} />
                        {quest.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {quest.estimatedTime}m
                      </span>
                      <Badge className={cn("text-xs px-2 py-1", getCategoryColor(quest.category))}>
                        {quest.category}
                      </Badge>
                      <Badge className="bg-gray-600 text-gray-200 text-xs px-2 py-1">
                        {quest.type}
                      </Badge>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {availableQuests.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <AlertCircle size={48} className="mx-auto mb-4 text-gray-500" />
                <p>No active quests available.</p>
                <p className="text-sm mt-1">Create some quests first to select an active one.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper function for category colors (same as in QuestList)
const getCategoryColor = (category: string) => {
  const categoryColors = {
    'work': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    'personal': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    'health': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
    'learning': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
    'creative': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
    'social': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
  };
  return categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-700';
};

export default EditableMainQuest;
