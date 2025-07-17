import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Flame, 
  Trophy, 
  Calendar,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import { StreakChallengeSystem } from '../utils/journalSystem';
import type { StreakChallenge } from '../types/game';
import { toast } from 'sonner';

interface StreakChallengesDialogProps {
  trigger: React.ReactNode;
}

export const StreakChallengesDialog: React.FC<StreakChallengesDialogProps> = ({ trigger }) => {
  const { state, actions } = useGame();
  const [selectedChallenge, setSelectedChallenge] = useState<StreakChallenge | null>(null);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkInNotes, setCheckInNotes] = useState('');

  const streakChallenges = state.streakChallenges || [];

  // Initialize streak challenges if empty
  useEffect(() => {
    if (streakChallenges.length === 0) {
      const defaultChallenges = StreakChallengeSystem.getDefaultChallenges();
      defaultChallenges.forEach(challenge => {
        actions.addStreakChallenge(challenge);
      });
    }
  }, [streakChallenges.length, actions]);

  const getDifficultyColor = (difficulty: StreakChallenge['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'extreme': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleStartChallenge = (challenge: StreakChallenge) => {
    const updatedChallenge = {
      ...challenge,
      isActive: true,
      startDate: new Date(),
      currentStreak: 0,
      dailyCheckIns: []
    };
    
    actions.updateStreakChallenge(challenge.id, updatedChallenge);
    toast.success(`Started ${challenge.name}! Good luck! 🔥`);
  };

  const handleStopChallenge = (challenge: StreakChallenge) => {
    actions.updateStreakChallenge(challenge.id, { isActive: false });
    toast.info(`Stopped ${challenge.name}. You can restart anytime!`);
  };

  const handleCheckIn = (challenge: StreakChallenge, success: boolean) => {
    const updatedChallenge = StreakChallengeSystem.checkIn(challenge, success, checkInNotes);
    actions.updateStreakChallenge(challenge.id, updatedChallenge);
    
    if (success) {
      toast.success(`Great job! Day ${updatedChallenge.currentStreak} of ${challenge.name}! 🎉`);
      
      // Check for milestone rewards
      const earnedRewards = StreakChallengeSystem.getEarnedRewards(updatedChallenge);
      const newReward = earnedRewards.find(reward => 
        reward.daysMilestone === updatedChallenge.currentStreak
      );
      
      if (newReward) {
        actions.addXP({ 
          amount: newReward.xpReward, 
          reason: `${challenge.name} - ${newReward.title}`
        });
        actions.addGold(newReward.goldReward, `${challenge.name} milestone`);
        toast.success(`🏆 Milestone achieved: ${newReward.title}! +${newReward.xpReward} XP, +${newReward.goldReward} Gold`);
      }
    } else {
      toast.warning(`Don't worry! Every day is a new chance. Keep going! 💪`);
    }
    
    setCheckInNotes('');
    setShowCheckIn(false);
  };

  const renderChallengeCard = (challenge: StreakChallenge) => {
    const stats = StreakChallengeSystem.getChallengeStats(challenge);
    const nextReward = StreakChallengeSystem.getNextReward(challenge);
    const today = new Date().toDateString();
    const alreadyCheckedIn = challenge.dailyCheckIns.some(
      checkIn => checkIn.date.toDateString() === today
    );

    return (
      <motion.div
        key={challenge.id}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
        onClick={() => setSelectedChallenge(challenge)}
      >
        <Card className={`${challenge.isActive ? 'ring-2 ring-blue-500' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{challenge.icon}</div>
                <div>
                  <CardTitle className="text-lg">{challenge.name}</CardTitle>
                  <p className="text-sm text-gray-500">{challenge.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
                {challenge.isActive && (
                  <Badge variant="outline">Active</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="font-semibold text-lg flex items-center justify-center gap-1">
                  <Flame className="text-orange-500" size={16} />
                  {challenge.currentStreak}
                </div>
                <div className="text-xs text-gray-500">Current</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{challenge.longestStreak}</div>
                <div className="text-xs text-gray-500">Best</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{stats.overallSuccessRate}%</div>
                <div className="text-xs text-gray-500">Success</div>
              </div>
            </div>

            {challenge.isActive && nextReward && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Next Reward: {nextReward.title}</span>
                  <span>{challenge.currentStreak}/{nextReward.daysMilestone}</span>
                </div>
                <Progress 
                  value={(challenge.currentStreak / nextReward.daysMilestone) * 100} 
                  className="h-2"
                />
              </div>
            )}

            <div className="flex gap-2">
              {!challenge.isActive ? (
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartChallenge(challenge);
                  }}
                  size="sm"
                  className="flex-1"
                >
                  <Plus size={16} className="mr-1" />
                  Start
                </Button>
              ) : (
                <>
                  {!alreadyCheckedIn ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedChallenge(challenge);
                        setShowCheckIn(true);
                      }}
                      size="sm"
                      className="flex-1"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Check In
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="flex-1 justify-center">
                      ✅ Checked In Today
                    </Badge>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStopChallenge(challenge);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Stop
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderChallengeDetails = () => {
    if (!selectedChallenge) return null;

    const stats = StreakChallengeSystem.getChallengeStats(selectedChallenge);
    const earnedRewards = StreakChallengeSystem.getEarnedRewards(selectedChallenge);
    const recentCheckIns = selectedChallenge.dailyCheckIns
      .slice(-7)
      .reverse();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedChallenge(null)}
          >
            ← Back to Challenges
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedChallenge.icon}</span>
            <h3 className="text-lg font-semibold">{selectedChallenge.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
              <Flame size={20} />
              {selectedChallenge.currentStreak}
            </div>
            <div className="text-sm text-gray-500">Current Streak</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{selectedChallenge.longestStreak}</div>
            <div className="text-sm text-gray-500">Best Streak</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">{stats.overallSuccessRate}%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.daysActive}</div>
            <div className="text-sm text-gray-500">Days Active</div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Trophy size={16} />
              Rewards
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedChallenge.rewards.map((reward, index) => {
                const isEarned = earnedRewards.includes(reward);
                return (
                  <div
                    key={index}
                    className={`p-2 rounded border ${
                      isEarned 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reward.title}</span>
                      <span className="text-sm">{reward.daysMilestone} days</span>
                    </div>
                    <div className="text-sm opacity-75">
                      +{reward.xpReward} XP, +{reward.goldReward} Gold
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Recent Check-ins
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {recentCheckIns.map((checkIn, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-gray-50"
                >
                  <span className="text-sm">
                    {checkIn.date.toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    {checkIn.success ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <span className="text-sm">
                      {checkIn.success ? 'Success' : 'Missed'}
                    </span>
                  </div>
                </div>
              ))}
              {recentCheckIns.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No check-ins yet
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderCheckInDialog = () => {
    if (!showCheckIn || !selectedChallenge) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowCheckIn(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">{selectedChallenge.icon}</span>
            Daily Check-in: {selectedChallenge.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            How did you do today with your {selectedChallenge.name.toLowerCase()}?
          </p>

          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => handleCheckIn(selectedChallenge, true)}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle size={16} className="mr-2" />
              Success!
            </Button>
            <Button
              onClick={() => handleCheckIn(selectedChallenge, false)}
              variant="outline"
              className="flex-1"
            >
              <XCircle size={16} className="mr-2" />
              Missed
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowCheckIn(false)}
            className="w-full"
          >
            Cancel
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target size={24} />
              Streak Challenges
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!selectedChallenge ? (
              <motion.div
                key="challenges-grid"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {streakChallenges.map(renderChallengeCard)}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="challenge-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {renderChallengeDetails()}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {renderCheckInDialog()}
    </>
  );
};
