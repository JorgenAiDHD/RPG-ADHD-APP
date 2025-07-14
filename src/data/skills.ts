import type { Skill } from '../types/game';

// Definicje umiejętności neurodywergentnych
export const ALL_SKILLS: Skill[] = [
  {
    id: 'adaptive_focus',
    name: 'Adaptive Focus',
    description: 'Tasks with estimated time under 15 minutes grant +20% XP.',
    icon: '🧠',
    cost: 1,
    unlocked: false, // This will be managed by the game state
    effect: (_state, xpAmount, quest) => {
      // Only apply if the skill is unlocked and the quest meets criteria
      if (quest && quest.estimatedTime <= 15) {
        return xpAmount * 1.20; // +20% XP
      }
      return xpAmount;
    }
  },
  {
    id: 'boredom_detector',
    name: 'Boredom Detector',
    description: 'Suggests a change of activity after prolonged inactivity or abandoning tasks.',
    icon: '⏰',
    cost: 2,
    unlocked: false,
    effect: (_state, xpAmount) => xpAmount // This skill primarily affects UI/AI suggestions, not direct XP
  },
  {
    id: 'anti_procrastination_aura',
    name: 'Anti-Procrastination Aura',
    description: 'Completing a "daunting" task within 15 minutes grants bonus HP and XP.',
    icon: '🛡️',
    cost: 3,
    unlocked: false,
    effect: (_state, xpAmount, _quest) => {
      // This effect is handled directly in completeQuest to modify HP and XP
      // We return original xpAmount here as the bonus is applied separately.
      return xpAmount;
    }
  },
  {
    id: 'creative_recharge',
    name: 'Creative Recharge',
    description: 'Creative and Learning activities grant additional HP/XP when performed after high-difficulty tasks.',
    icon: '🎨',
    cost: 2,
    unlocked: false,
    effect: (_state, xpAmount, _quest, _healthActivity) => {
      // This effect is handled directly in handleHealthChange to modify HP and XP
      // We return original xpAmount here as the bonus is applied separately.
      return xpAmount;
    }
  }
];
