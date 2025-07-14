import type { Achievement } from '../types/game';

// Definicje osiągnięć
const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quest_completed',
    name: 'First Step',
    description: 'Complete your very first quest.',
    icon: '✨',
    criteria: (state) => state.statistics.totalQuestsCompleted >= 1,
  },
  {
    id: 'reach_level_5',
    name: 'Novice Adventurer',
    description: 'Reach player level 5.',
    icon: '🌟',
    criteria: (state) => state.player.level >= 5,
  },
  {
    id: 'three_day_streak',
    name: 'Consistent Effort',
    description: 'Maintain a 3-day streak.',
    icon: '🔥',
    criteria: (state) => state.player.longestStreak >= 3,
  },
  {
    id: 'collect_3_items',
    name: 'Curiosity Seeker',
    description: 'Collect 3 unique items.',
    icon: '💎',
    criteria: (state) => state.collectibles.length >= 3,
  },
  {
    id: 'log_5_health_activities',
    name: 'Wellness Warrior',
    description: 'Log 5 health activities.',
    icon: '❤️',
    criteria: (state) => state.statistics.healthActivitiesLogged >= 5,
  },
  {
    id: 'reach_level_10',
    name: 'Experienced Explorer',
    description: 'Reach player level 10.',
    icon: '🏆',
    criteria: (state) => state.player.level >= 10,
  },
  {
    id: 'seven_day_streak',
    name: 'Unstoppable Momentum',
    description: 'Maintain a 7-day streak.',
    icon: '🚀',
    criteria: (state) => state.player.longestStreak >= 7,
  },
  {
    id: 'complete_10_quests',
    name: 'Quest Master',
    description: 'Complete 10 quests.',
    icon: '📜',
    criteria: (state) => state.statistics.totalQuestsCompleted >= 10,
  },
];

export { ALL_ACHIEVEMENTS };
