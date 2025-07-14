import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Trophy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { cn } from '../lib/cn';

function AchievementsDialog() {
  const { state } = useGame();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-300 hover:bg-yellow-700 bg-yellow-950/30 shadow-md shadow-yellow-900/30">
            <Trophy size={16} className="mr-2" /> Achievements
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-zinc-800 border-gray-700 text-white max-w-2xl rounded-xl shadow-2xl shadow-purple-950/50">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">Your Achievements</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {ALL_ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = state.unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={cn(
                  "p-4 rounded-lg border",
                  isUnlocked
                    ? "bg-green-900/30 border-green-700 shadow-lg shadow-green-950/20"
                    : "bg-gray-800 border-gray-700 opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-lg">
                      {achievement.name} {isUnlocked && <CheckCircle size={16} className="inline-block ml-2 text-green-400" />}
                    </h4>
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} className="bg-gray-600 hover:bg-gray-700">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AchievementsDialog;

