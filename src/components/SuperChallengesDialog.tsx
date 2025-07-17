import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useGame } from '../context/GameContext';
import { SuperChallengeSystem } from '../utils/superChallenges';
import type { SuperChallenge, ActiveChallenge, HabitBoss } from '../types/game';
import { motion, AnimatePresence } from 'framer-motion';

interface SuperChallengesDialogProps {
  trigger?: React.ReactNode;
}

export const SuperChallengesDialog: React.FC<SuperChallengesDialogProps> = ({ trigger }) => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<'challenges' | 'bosses' | 'daily'>('daily');
  const [selectedChallenge, setSelectedChallenge] = useState<SuperChallenge | null>(null);

  const availableChallenges = SuperChallengeSystem.getAvailableChallenges(state.player.level);
  const dailyChallenge = SuperChallengeSystem.getDailyChallengeRecommendation(state);
  const activeHabitBosses = SuperChallengeSystem.getActiveHabitBosses();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'expert': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'legendary': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'uncommon': return 'text-green-600 dark:text-green-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mind_control': return '🧠';
      case 'creative': return '🎨';
      case 'memory': return '🧩';
      case 'focus': return '🎯';
      case 'physical': return '💪';
      case 'social': return '👥';
      default: return '⭐';
    }
  };

  const startChallenge = (challenge: SuperChallenge) => {
    const newActiveChallenge: ActiveChallenge = {
      challengeId: challenge.id,
      startTime: new Date(),
      progress: 0,
      currentStep: 0,
      timeRemaining: challenge.duration * 60, // Convert to seconds
      isCompleted: false,
      attempts: 1,
    };

    // TODO: Add to game state via action
    // setChallengeInProgress(newActiveChallenge);
    setSelectedChallenge(challenge);
    console.log('Starting challenge:', newActiveChallenge);
  };

  const renderChallengeCard = (challenge: SuperChallenge, isDailyChallenge: boolean = false) => (
    <motion.div
      key={challenge.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-4 border rounded-xl transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isDailyChallenge
          ? 'border-gold-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
          : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600'
      }`}
      onClick={() => setSelectedChallenge(challenge)}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{challenge.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{challenge.title}</h3>
            {isDailyChallenge && (
              <Badge className="bg-gold-100 text-gold-800 dark:bg-yellow-900 dark:text-yellow-300">
                Daily
              </Badge>
            )}
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {challenge.description}
          </p>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span>{getTypeIcon(challenge.type)}</span>
                <span className="text-gray-500">{challenge.type.replace('_', ' ')}</span>
              </span>
              <span className="text-gray-500">⏱️ {challenge.duration}min</span>
              <span className={getRarityColor(challenge.rarity)}>
                ✨ {challenge.rarity}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">+{challenge.xpReward} XP</span>
              <span className="text-yellow-600 dark:text-yellow-400">+{challenge.goldReward} Gold</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderChallengeDetails = (challenge: SuperChallenge) => (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <div className="text-6xl mb-3">{challenge.icon}</div>
        <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>
        <div className="flex justify-center gap-3">
          <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
          <Badge variant="outline">⏱️ {challenge.duration} minutes</Badge>
          <Badge variant="outline" className={getRarityColor(challenge.rarity)}>✨ {challenge.rarity}</Badge>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
          📋 Instructions
        </h3>
        <ol className="space-y-2">
          {challenge.instructions?.map((instruction, index) => (
            <li key={index} className="text-sm text-blue-600 dark:text-blue-400">
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      {/* Success Criteria */}
      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
          🎯 Success Criteria
        </h3>
        <ul className="space-y-1">
          {challenge.successCriteria?.map((criteria, index) => (
            <li key={index} className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
              <span>✓</span>
              <span>{criteria}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
          💡 Pro Tips
        </h3>
        <ul className="space-y-1">
          {challenge.tips?.map((tip, index) => (
            <li key={index} className="text-sm text-yellow-600 dark:text-yellow-400">
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* ADHD Benefits */}
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
          🧠 ADHD Superpowers Unlocked
        </h3>
        <ul className="space-y-1">
          {challenge.adhdBenefits?.map((benefit, index) => (
            <li key={index} className="text-sm text-purple-600 dark:text-purple-400">
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Rewards */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          🏆 Rewards
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              +{challenge.xpReward}
            </div>
            <div className="text-xs text-blue-500">Experience Points</div>
          </div>
          <div className="text-center p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              +{challenge.goldReward}
            </div>
            <div className="text-xs text-yellow-500">Gold Coins</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={() => startChallenge(challenge)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          size="lg"
        >
          🚀 Start Challenge
        </Button>
        <Button
          variant="outline"
          onClick={() => setSelectedChallenge(null)}
          size="lg"
        >
          ← Back
        </Button>
      </div>
    </div>
  );

  const renderHabitBoss = (boss: HabitBoss) => (
    <div key={boss.id} className="p-4 border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{boss.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-xl text-red-700 dark:text-red-300">{boss.name}</h3>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
              Lv. {boss.level}
            </Badge>
          </div>
          
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
            {boss.description}
          </p>

          {/* Health Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-red-500 mb-1">
              <span>Boss Health</span>
              <span>{boss.health}/{boss.maxHealth}</span>
            </div>
            <Progress 
              value={(boss.health / boss.maxHealth) * 100} 
              className="h-3 bg-red-100"
            />
          </div>

          {/* Weaknesses */}
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-1">
              ⚔️ Weaknesses:
            </h4>
            <div className="flex flex-wrap gap-1">
              {boss.weaknesses?.map((weakness, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {weakness.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
            onClick={() => {/* TODO: Implement boss battle */}}
          >
            ⚔️ Battle Boss
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600">
            ⚡ Super Challenges
            {state.activeChallenges.length > 0 && (
              <Badge className="bg-red-500 text-white ml-1">
                {state.activeChallenges.length}
              </Badge>
            )}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            ⚡ Super Challenges & Brain Training
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              ADHD Optimized
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {selectedChallenge ? (
          renderChallengeDetails(selectedChallenge)
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === 'daily' ? 'default' : 'outline'}
                onClick={() => setActiveTab('daily')}
                className="flex-1"
              >
                ⭐ Daily Challenge
              </Button>
              <Button
                variant={activeTab === 'challenges' ? 'default' : 'outline'}
                onClick={() => setActiveTab('challenges')}
                className="flex-1"
              >
                ⚡ All Challenges
              </Button>
              <Button
                variant={activeTab === 'bosses' ? 'default' : 'outline'}
                onClick={() => setActiveTab('bosses')}
                className="flex-1"
              >
                🐉 Habit Bosses
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'daily' && (
                <motion.div
                  key="daily"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center p-6 bg-gradient-to-br from-gold-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-gold-300">
                    <h2 className="text-2xl font-bold mb-2 text-gold-700 dark:text-gold-300">
                      🌟 Today's Featured Challenge
                    </h2>
                    <p className="text-gold-600 dark:text-gold-400 mb-4">
                      A special challenge picked just for you! Complete it for bonus rewards!
                    </p>
                    {renderChallengeCard(dailyChallenge, true)}
                  </div>
                </motion.div>
              )}

              {activeTab === 'challenges' && (
                <motion.div
                  key="challenges"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Challenge Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['mind_control', 'creative', 'memory'].map((type) => {
                      const typeChallenges = SuperChallengeSystem.getChallengesByType(type as any);
                      const availableForType = typeChallenges.filter(c => c.unlockLevel <= state.player.level);
                      
                      return (
                        <div key={type} className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            {getTypeIcon(type)}
                            {type.replace('_', ' ').toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {availableForType.length} challenges available
                          </p>
                          <div className="space-y-2">
                            {availableForType.slice(0, 2).map(challenge => (
                              <div key={challenge.id} className="text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="font-medium">{challenge.title}</div>
                                <div className="text-gray-500">
                                  {challenge.difficulty} • {challenge.duration}min
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* All Available Challenges */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Available Challenges ({availableChallenges.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableChallenges.map(challenge => renderChallengeCard(challenge))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'bosses' && (
                <motion.div
                  key="bosses"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-300">
                    <h2 className="text-2xl font-bold mb-2 text-red-700 dark:text-red-300">
                      🐉 Habit Boss Battles
                    </h2>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                      Transform your bad habits into epic boss battles! Defeat them through consistent action!
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activeHabitBosses.map(renderHabitBoss)}
                  </div>

                  {activeHabitBosses.length === 0 && (
                    <div className="text-center p-8 text-gray-500">
                      <div className="text-4xl mb-3">🏆</div>
                      <h3 className="text-lg font-semibold mb-2">All Bosses Defeated!</h3>
                      <p>Amazing work! You've conquered all your habit bosses!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
