

import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ALL_SKILLS } from '../data/skills';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Badge } from './ui/badge';
import { Brain, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '../lib/cn';

function SkillTreeDialog() {
  const { state, actions } = useGame();
  const [open, setOpen] = useState(false);

  const handleUnlockSkill = (skillId: string, cost: number) => {
    if (state.player.skillPoints >= cost) {
      actions.spendSkillPoints(cost);
      actions.unlockSkill(skillId);
      toast.success(`Skill Unlocked: ${ALL_SKILLS.find((s) => s.id === skillId)?.name}!`, {
        description: ALL_SKILLS.find((s) => s.id === skillId)?.description,
        icon: ALL_SKILLS.find((s) => s.id === skillId)?.icon,
        duration: 5000,
      });
    } else {
      toast.error('Not enough Skill Points!', {
        description: `You need ${cost - state.player.skillPoints} more Skill Points to unlock this.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="sm" variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-700 bg-purple-950/30 shadow-md shadow-purple-900/30">
            <Brain size={16} className="mr-2" /> Skills
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-zinc-800 border-gray-700 text-white max-w-2xl rounded-xl shadow-2xl shadow-purple-950/50">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl font-bold">Skill Tree</DialogTitle>
          <p className="text-gray-400 text-sm">Spend your <span className="text-cyan-400 font-semibold">{state.player.skillPoints} Skill Points</span> to unlock powerful neuro-enhancements!</p>
        </DialogHeader>
        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {ALL_SKILLS.map((skill) => {
            const isUnlocked = state.unlockedSkills.includes(skill.id);
            const canAfford = state.player.skillPoints >= skill.cost;
            return (
              <div
                key={skill.id}
                className={cn(
                  "p-4 rounded-lg border flex items-center gap-4",
                  isUnlocked
                    ? "bg-blue-900/30 border-blue-700 shadow-lg shadow-blue-950/20"
                    : "bg-gray-800 border-gray-700 opacity-60",
                  !isUnlocked && canAfford && "hover:bg-gray-700 cursor-pointer"
                )}
                onClick={!isUnlocked && canAfford ? () => handleUnlockSkill(skill.id, skill.cost) : undefined}
              >
                <span className="text-3xl flex-shrink-0">{skill.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    {skill.name}
                    {isUnlocked && <CheckCircle size={16} className="text-green-400" />}
                  </h4>
                  <p className="text-sm text-gray-300">{skill.description}</p>
                </div>
                {!isUnlocked && (
                  <Badge className={cn(
                    "px-3 py-1 text-sm font-semibold",
                    canAfford ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  )}>
                    Cost: {skill.cost} SP
                  </Badge>
                )}
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

export default SkillTreeDialog;
