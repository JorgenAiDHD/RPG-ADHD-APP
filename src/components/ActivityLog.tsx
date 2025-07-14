


import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Heart, Clock, Star, BookOpen, Coins, Flame } from 'lucide-react';

const ActivityLog = () => {
  const { state } = useGame();
  const { recentActivity } = state;

  // Enhanced activity icons with better visual cues
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quest_completed': 
        return (
          <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/20 rounded-full border border-green-200 dark:border-green-800/50 shadow-sm">
            <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
          </div>
        );
      case 'collectible_found': 
        return (
          <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/20 rounded-full border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
            <Trophy size={18} className="text-yellow-600 dark:text-yellow-400" />
          </div>
        );
      case 'health_activity': 
        return (
          <div className="p-2 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/20 rounded-full border border-red-200 dark:border-red-800/50 shadow-sm">
            <Heart size={18} className="text-red-600 dark:text-red-400" />
          </div>
        );
      case 'level_up': 
        return (
          <div className="p-2 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/20 rounded-full border border-cyan-200 dark:border-cyan-800/50 shadow-sm">
            <Star size={18} className="text-cyan-600 dark:text-cyan-400" />
          </div>
        );
      case 'achievement_unlocked': 
        return (
          <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/20 rounded-full border border-purple-200 dark:border-purple-800/50 shadow-sm">
            <Trophy size={18} className="text-purple-600 dark:text-purple-400" />
          </div>
        );
      case 'gold_earned':
        return (
          <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 rounded-full border border-amber-200 dark:border-amber-800/50 shadow-sm">
            <Coins size={18} className="text-amber-600 dark:text-amber-400" />
          </div>
        );
      case 'streak_milestone':
        return (
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm">
            <Flame size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
        );
      default: 
        return (
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 rounded-full border border-blue-200 dark:border-blue-800/50 shadow-sm">
            <BookOpen size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
        );
    }
  };

  // Format timestamp to be more human-friendly
  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    // More human-readable relative time
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    // For older entries, show the actual date
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-zinc-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white shadow-lg dark:shadow-gray-950/50 rounded-3xl overflow-hidden">
        <CardHeader className="pb-4 bg-gray-50 dark:bg-gray-900/40 border-b border-gray-200 dark:border-gray-700/50">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/60 dark:to-blue-900/60 rounded-full shadow-md border border-blue-200 dark:border-blue-700/30">
              <Clock size={18} className="text-blue-600 dark:text-blue-400" />
            </div>
            Activity Log
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <AnimatePresence>
            {recentActivity.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700"
              >
                <Clock size={40} className="text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">No activity yet</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Complete quests and activities to see your progress here</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity: any, index: number) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-4 p-4 ${
                      index % 2 === 0 
                        ? 'bg-gray-50 dark:bg-gray-800/40' 
                        : 'bg-white dark:bg-gray-800/20'
                    } border border-gray-200 dark:border-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all`}
                  >
                    {/* Activity Icon */}
                    {getActivityIcon(activity.type)}
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      {/* Description with better readability */}
                      <div className="text-gray-800 dark:text-gray-200 font-medium mb-2">
                        {activity.description}
                      </div>
                      
                      {/* Activity Details with clearer visual separation */}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {activity.xpGained && (
                          <span className="inline-flex items-center gap-1 text-yellow-700 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-full text-xs border border-yellow-200 dark:border-yellow-800/30">
                            <Star size={14} />
                            +{activity.xpGained} XP
                          </span>
                        )}
                        
                        {activity.goldGained && (
                          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full text-xs border border-amber-200 dark:border-amber-800/30">
                            <Coins size={14} />
                            +{activity.goldGained} Gold
                          </span>
                        )}
                        
                        {activity.streakMilestone && (
                          <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full text-xs border border-blue-200 dark:border-blue-800/30">
                            <Flame size={14} />
                            {activity.streakMilestone} Day Streak!
                          </span>
                        )}
                        
                        {activity.healthChanged && (
                          <span className={`inline-flex items-center gap-1 ${
                            activity.healthChanged > 0 
                              ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30' 
                              : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/30'
                          } px-2.5 py-1 rounded-full text-xs font-medium border`}>
                            <Heart size={14} />
                            {activity.healthChanged > 0 ? '+' : ''}{activity.healthChanged} HP
                          </span>
                        )}
                        
                        {/* Timestamp with better visual treatment */}
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/60 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700/50">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActivityLog;
