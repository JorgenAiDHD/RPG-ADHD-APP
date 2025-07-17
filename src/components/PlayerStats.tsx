
import { motion } from 'framer-motion';
import { Trophy, Flame, Zap, Heart, Coins } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { cn } from '../lib/cn';
import { useEffect } from 'react';

export function PlayerStats() {
  const { state, actions } = useGame();
  const { player, healthBar, bonusXPActive } = state;
  const xpProgressPercentage = (player.xp / player.xpToNextLevel) * 100;
  const healthPercentage = (healthBar.current / healthBar.maximum) * 100;
  
  // Monitor gold changes
  useEffect(() => {
  }, [player.gold]);
  
  const getHealthBarColor = (percentage: number) => {
    if (percentage > 70) return 'bg-success-500';
    if (percentage > 40) return 'bg-warning-500';
    return 'bg-error-500';
  };
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="card-primary">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2 text-gradient-primary">
            <Trophy size={20} className="text-secondary-500 drop-shadow-md" />
            {player.name} - Level {player.level}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
          <div className="stat-container-primary">
            <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5 sm:mb-2">
              <span className="text-surface-300 flex items-center gap-1">
                <Zap size={14} className="text-secondary-500 hidden xs:inline" />
                <span className="font-medium">XP Progress</span>
              </span>
              <span className="text-secondary-400 font-semibold bg-surface-900/70 px-1.5 sm:px-2 py-0.5 rounded-md text-xs">{player.xp} / {player.xpToNextLevel} XP</span>
            </div>
            <Progress value={xpProgressPercentage} className="h-3 sm:h-4 bg-surface-800 rounded-full">
              <motion.div 
                className={cn('h-full rounded-full', 'bg-secondary-500 shadow-md shadow-secondary-700/50')} 
                initial={{ width: 0 }} 
                animate={{ width: `${xpProgressPercentage}%` }} 
                transition={{ duration: 0.8, ease: 'easeOut' }} 
              />
            </Progress>
            <div className="text-xs text-surface-400 mt-1.5 sm:mt-2 text-center">
              {Math.floor(xpProgressPercentage)}% complete to next level
            </div>
          </div>
          
          <div className="stat-container-primary">
            <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5 sm:mb-2">
              <span className="text-surface-300 flex items-center gap-1">
                <Heart size={14} className="text-error-500 hidden xs:inline" />
                <span className="font-medium">Resilience</span>
              </span>
              <span className="text-error-400 font-semibold bg-surface-900/70 px-1.5 sm:px-2 py-0.5 rounded-md text-xs">{healthBar.current} / {healthBar.maximum} HP</span>
            </div>
            <Progress value={healthPercentage} className="h-3 sm:h-4 bg-surface-800 rounded-full">
              <motion.div 
                className={cn('h-full rounded-full', getHealthBarColor(healthPercentage), 'shadow-md')} 
                initial={{ width: 0 }} 
                animate={{ width: `${healthPercentage}%` }} 
                transition={{ duration: 0.8, ease: 'easeOut' }} 
              />
            </Progress>
            <div className="text-xs text-surface-400 mt-1.5 sm:mt-2 text-center">
              {Math.floor(healthPercentage)}% health remaining
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <Badge variant="outline" className="badge-attention-focus flex items-center justify-center gap-1 py-2 sm:py-3 px-2 sm:px-3">
              <Flame size={16} className="text-adhd-energy-400 hidden xs:inline" /> 
              <div className="flex flex-col items-center">
                <span className="font-bold text-base sm:text-lg">{player.currentStreak}</span>
                <span className="text-xs opacity-80">Day Streak</span>
                {player.streakGoal > 0 && (
                  <span className="text-xs text-primary-300/80 mt-0.5 sm:mt-1">Goal: {player.streakGoal} days</span>
                )}
              </div>
            </Badge>
            <Badge variant="outline" className="badge-attention-creative flex items-center justify-center gap-1 py-2 sm:py-3 px-2 sm:px-3">
              <Zap size={16} className="text-adhd-creative-400 hidden xs:inline" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-base sm:text-lg">{player.skillPoints}</span>
                <span className="text-xs opacity-80">Skill Points</span>
              </div>
            </Badge>
          </div>
          
          <div className="reward-container-primary">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Coins size={18} className="text-secondary-400" />
              <div>
                <div className="font-bold text-secondary-300 text-sm sm:text-base">{player.gold}</div>
                <div className="text-xs text-secondary-300/70">Gold Coins</div>
              </div>
            </div>
            {player.streakGoal > 0 && player.currentStreak >= player.streakGoal && (
              <motion.div 
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1.05 }} 
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                className="bg-yellow-600/40 hover:bg-yellow-600/60 transition-colors rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer"
                onClick={() => player.streakGoal && actions.claimStreakReward(player.currentStreak)}
              >
                <span className="text-xs font-medium text-yellow-200">Claim Reward!</span>
              </motion.div>
            )}
          </div>
          
          {bonusXPActive && new Date() < new Date(bonusXPActive.expiresAt) && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="mt-2 sm:mt-3 p-3 sm:p-4 bg-yellow-900/30 border border-yellow-700 rounded-xl text-center shadow-inner shadow-yellow-900/20">
              <div className="text-xs sm:text-sm text-yellow-300 font-medium flex items-center justify-center gap-1.5 sm:gap-2">
                <Trophy size={16} className="text-yellow-400 animate-pulse" />
                <span className="truncate">Bonus XP: {bonusXPActive.multiplier}x - {bonusXPActive.reason}</span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
