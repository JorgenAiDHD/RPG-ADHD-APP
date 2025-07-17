import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useGame } from '../context/GameContext';
import { SuperChallengeSystem } from '../utils/superChallenges';
import type { ActiveChallenge, SuperChallenge } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

export const ChallengeTimer: React.FC = () => {
  const { state } = useGame();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentChallenge, setCurrentChallenge] = useState<{
    active: ActiveChallenge;
    challenge: SuperChallenge;
  } | null>(null);

  // Mock active challenge for demo (in real app this would come from state)
  useEffect(() => {
    if (state.activeChallenges && state.activeChallenges.length > 0) {
      const activeChallenge = state.activeChallenges[0];
      // In real implementation, find the challenge details
      const challengeDetails = SuperChallengeSystem.getDailyChallengeRecommendation(state);
      
      setCurrentChallenge({
        active: activeChallenge,
        challenge: challengeDetails
      });
      setTimeLeft(activeChallenge.timeRemaining);
      setIsActive(true);
    }
  }, [state.activeChallenges]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            handleChallengeComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleChallengeComplete = () => {
    if (currentChallenge) {
      // Calculate performance based on completion
      const performance = 85; // Mock performance score
      const rewards = SuperChallengeSystem.completeChallenge(currentChallenge.challenge, performance);
      
      console.log('Challenge completed!', rewards);
      // TODO: Add rewards to player via actions
    }
  };

  const handleAbandonChallenge = () => {
    setIsActive(false);
    setCurrentChallenge(null);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (!currentChallenge) return 0;
    const totalTime = currentChallenge.challenge.duration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  if (!currentChallenge || !isActive) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600 rounded-xl shadow-lg p-4 max-w-sm"
      >
        {/* Challenge Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{currentChallenge.challenge.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{currentChallenge.challenge.title}</h3>
            <div className="flex items-center gap-2">
              <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                {currentChallenge.challenge.type.replace('_', ' ')}
              </Badge>
              <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                {currentChallenge.challenge.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress 
            value={getProgressPercentage()} 
            className="h-2"
          />
        </div>

        {/* Timer */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-gray-500">Time Remaining</div>
        </div>

        {/* Quick Instructions */}
        <div className="mb-4 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-xs text-purple-700 dark:text-purple-300">
            <strong>Quick Reminder:</strong>
            <br />
            {currentChallenge.challenge.description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleChallengeComplete}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
            size="sm"
          >
            ✅ Complete
          </Button>
          <Button
            onClick={handleAbandonChallenge}
            variant="outline"
            className="text-xs"
            size="sm"
          >
            ❌ Abandon
          </Button>
        </div>

        {/* Motivation */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            💪 You've got this! Focus and breathe.
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
