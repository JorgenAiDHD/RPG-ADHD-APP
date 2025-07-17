import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useGame } from '../context/GameContext';
import { SuperChallengeSystem } from '../utils/superChallenges';
import type { SuperChallenge } from '../types/game';
import { motion } from 'framer-motion';

export const QuickChallengeGenerator: React.FC = () => {
  const { state } = useGame();
  const [randomChallenge, setRandomChallenge] = useState<SuperChallenge | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateRandomChallenge = () => {
    setIsGenerating(true);
    
    // Add animation delay for better UX
    setTimeout(() => {
      const availableChallenges = SuperChallengeSystem.getAvailableChallenges(state.player.level);
      const easyToMediumChallenges = availableChallenges.filter(
        c => c.difficulty === 'easy' || c.difficulty === 'medium'
      );
      
      if (easyToMediumChallenges.length > 0) {
        const randomIndex = Math.floor(Math.random() * easyToMediumChallenges.length);
        setRandomChallenge(easyToMediumChallenges[randomIndex]);
      }
      
      setIsGenerating(false);
    }, 800);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mind_control': return 'text-purple-600 dark:text-purple-400';
      case 'creative': return 'text-pink-600 dark:text-pink-400';
      case 'memory': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const startQuickChallenge = () => {
    if (randomChallenge) {
      console.log('Starting quick challenge:', randomChallenge);
      // TODO: Add to active challenges via action
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg text-purple-700 dark:text-purple-300 mb-2">
          ⚡ Quick Challenge Generator
        </h3>
        <p className="text-sm text-purple-600 dark:text-purple-400">
          Need instant brain stimulation? Generate a quick ADHD-friendly challenge!
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <Button
          onClick={generateRandomChallenge}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              ⚡
            </motion.div>
          ) : (
            '🎲'
          )}
          {isGenerating ? 'Generating...' : 'Generate Challenge'}
        </Button>
      </div>

      {randomChallenge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{randomChallenge.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">{randomChallenge.title}</h4>
                <Badge className={getDifficultyColor(randomChallenge.difficulty)}>
                  {randomChallenge.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {randomChallenge.description}
              </p>
              
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center gap-3">
                  <span className={getTypeColor(randomChallenge.type)}>
                    {randomChallenge.type.replace('_', ' ')}
                  </span>
                  <span className="text-gray-500">⏱️ {randomChallenge.duration}min</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">+{randomChallenge.xpReward} XP</span>
                  <span className="text-yellow-600 dark:text-yellow-400">+{randomChallenge.goldReward} Gold</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={startQuickChallenge}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  🚀 Start Now
                </Button>
                <Button
                  onClick={generateRandomChallenge}
                  variant="outline"
                  size="sm"
                >
                  🎲 New One
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!randomChallenge && !isGenerating && (
        <div className="text-center p-6 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-sm">Click the button above to generate your next challenge!</p>
        </div>
      )}
    </div>
  );
};
