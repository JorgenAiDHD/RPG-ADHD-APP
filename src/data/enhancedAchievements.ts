// UX/UI Enhancements - Enhanced Achievements System v0.2
import type { Achievement } from '../types/game';

// ADHD-specific and UX-enhanced achievements
const ENHANCED_ACHIEVEMENTS: Achievement[] = [
  // First 10 Levels - Special achievements with tips and analysis
  {
    id: 'level_1_first_steps',
    name: '🌱 First Steps',
    description: 'Welcome to your ADHD-friendly adventure! Every journey begins with a single step.',
    icon: '🌱',
    criteria: (state) => state.player.level >= 1,
    category: 'milestone',
    rarity: 'common',
    tips: [
      'Start with small, achievable goals',
      'Celebrate every small win',
      'Progress over perfection'
    ],
    adhdBenefit: 'Building confidence through immediate positive feedback'
  },
  {
    id: 'level_2_momentum_builder',
    name: '⚡ Momentum Builder',
    description: 'You\'re building momentum! ADHD brains thrive on consistent small wins.',
    icon: '⚡',
    criteria: (state) => state.player.level >= 2,
    category: 'milestone',
    rarity: 'common',
    tips: [
      'Use timers to break tasks into chunks',
      'Reward yourself after completing tasks',
      'Keep track of your progress visually'
    ],
    adhdBenefit: 'Strengthening executive function through routine building'
  },
  {
    id: 'level_3_focus_finder',
    name: '🎯 Focus Finder',
    description: 'You\'re discovering what helps you focus. Every ADHD brain is unique!',
    icon: '🎯',
    criteria: (state) => state.player.level >= 3,
    category: 'milestone',
    rarity: 'common',
    tips: [
      'Experiment with different focus techniques',
      'Try the Pomodoro technique (15-20 min for ADHD)',
      'Find your optimal time of day for focus'
    ],
    adhdBenefit: 'Developing personalized attention regulation strategies'
  },
  {
    id: 'level_4_habit_hacker',
    name: '🔧 Habit Hacker',
    description: 'You\'re learning to hack your habits! ADHD brains need different approaches.',
    icon: '🔧',
    criteria: (state) => state.player.level >= 4,
    category: 'milestone',
    rarity: 'common',
    tips: [
      'Stack new habits onto existing ones',
      'Use external reminders and cues',
      'Make good habits easier and bad habits harder'
    ],
    adhdBenefit: 'Building neural pathways for automatic behaviors'
  },
  {
    id: 'level_5_energy_master',
    name: '🔋 Energy Master',
    description: 'You\'re mastering your energy! Understanding your energy patterns is crucial for ADHD.',
    icon: '🔋',
    criteria: (state) => state.player.level >= 5,
    category: 'milestone',
    rarity: 'uncommon',
    tips: [
      'Track your energy levels throughout the day',
      'Match challenging tasks to high-energy times',
      'Schedule breaks before you need them'
    ],
    adhdBenefit: 'Optimizing cognitive resources for peak performance'
  },
  {
    id: 'level_6_streak_specialist',
    name: '🔥 Streak Specialist',
    description: 'You\'re building consistency! Streaks help ADHD brains create structure.',
    icon: '🔥',
    criteria: (state) => state.player.level >= 6,
    category: 'milestone',
    rarity: 'uncommon',
    tips: [
      'Lower the bar for maintaining streaks',
      'Have backup plans for difficult days',
      'Focus on progress, not perfection'
    ],
    adhdBenefit: 'Creating predictable patterns that reduce decision fatigue'
  },
  {
    id: 'level_7_dopamine_designer',
    name: '🧠 Dopamine Designer',
    description: 'You\'re designing your dopamine system! ADHD brains need intentional reward systems.',
    icon: '🧠',
    criteria: (state) => state.player.level >= 7,
    category: 'milestone',
    rarity: 'uncommon',
    tips: [
      'Build in immediate rewards for completed tasks',
      'Use variety to maintain interest',
      'Create anticipation for upcoming rewards'
    ],
    adhdBenefit: 'Optimizing motivation through strategic reward timing'
  },
  {
    id: 'level_8_attention_architect',
    name: '🏗️ Attention Architect',
    description: 'You\'re architecting your attention! Building systems that work with ADHD.',
    icon: '🏗️',
    criteria: (state) => state.player.level >= 8,
    category: 'milestone',
    rarity: 'rare',
    tips: [
      'Design your environment to minimize distractions',
      'Use body doubling and accountability',
      'Create clear start and stop signals for tasks'
    ],
    adhdBenefit: 'Building sustainable attention management systems'
  },
  {
    id: 'level_9_resilience_warrior',
    name: '🛡️ Resilience Warrior',
    description: 'You\'re building resilience! Bouncing back from setbacks is an ADHD superpower.',
    icon: '🛡️',
    criteria: (state) => state.player.level >= 9,
    category: 'milestone',
    rarity: 'rare',
    tips: [
      'Practice self-compassion after mistakes',
      'Learn from setbacks without shame',
      'Develop quick reset routines'
    ],
    adhdBenefit: 'Strengthening emotional regulation and recovery skills'
  },
  {
    id: 'level_10_adhd_champion',
    name: '👑 ADHD Champion',
    description: 'You\'ve reached the first major milestone! You\'re becoming an expert on your own ADHD.',
    icon: '👑',
    criteria: (state) => state.player.level >= 10,
    category: 'milestone',
    rarity: 'epic',
    tips: [
      'Share your learnings with others',
      'Continue experimenting with new strategies',
      'Remember: you\'re not broken, just different'
    ],
    adhdBenefit: 'Achieving self-advocacy and confidence in ADHD management'
  },

  // ADHD-Specific Achievements
  {
    id: 'hyperfocus_hero',
    name: '🌊 Hyperfocus Hero',
    description: 'Complete a 2+ hour focus session. You\'ve harnessed your ADHD superpower!',
    icon: '🌊',
    criteria: (state) => state.statistics.longestFocusSession >= 120, // 2 hours in minutes
    category: 'adhd_strength',
    rarity: 'rare',
    adhdBenefit: 'Recognizing and leveraging hyperfocus as a strength'
  },
  {
    id: 'quick_pivot_master',
    name: '🔄 Quick Pivot Master',
    description: 'Successfully change tasks 10 times in one day. Flexibility is your strength!',
    icon: '🔄',
    criteria: (state) => state.statistics.taskSwitchesInDay >= 10,
    category: 'adhd_strength',
    rarity: 'uncommon',
    adhdBenefit: 'Celebrating cognitive flexibility as an advantage'
  },
  {
    id: 'creative_burst_genius',
    name: '💡 Creative Burst Genius',
    description: 'Complete 5 creative challenges in one week. Your ADHD brain is brilliantly creative!',
    icon: '💡',
    criteria: (state) => state.statistics.creativeTasksThisWeek >= 5,
    category: 'adhd_strength',
    rarity: 'rare',
    adhdBenefit: 'Honoring the connection between ADHD and creativity'
  },

  // Gamer Achievements
  {
    id: 'speedrun_novice',
    name: '🏃 Speedrun Novice',
    description: 'Complete 10 tasks in under 5 minutes each. Speed is your game!',
    icon: '🏃',
    criteria: (state) => state.statistics.quickTasksCompleted >= 10,
    category: 'gamer',
    rarity: 'common',
    adhdBenefit: 'Using gaming mechanics to boost motivation'
  },
  {
    id: 'combo_breaker',
    name: '⚡ Combo Breaker',
    description: 'Complete 5 tasks in a row without breaks. Unstoppable!',
    icon: '⚡',
    criteria: (state) => state.statistics.maxTaskCombo >= 5,
    category: 'gamer',
    rarity: 'uncommon',
    adhdBenefit: 'Building momentum through gamified task completion'
  },
  {
    id: 'boss_battle_winner',
    name: '🏆 Boss Battle Winner',
    description: 'Defeat a major procrastination boss (complete a big, scary task).',
    icon: '🏆',
    criteria: (state) => state.statistics.bigTasksCompleted >= 1,
    category: 'gamer',
    rarity: 'rare',
    adhdBenefit: 'Reframing difficult tasks as conquerable challenges'
  },

  // Athlete Achievements
  {
    id: 'morning_warrior',
    name: '🌅 Morning Warrior',
    description: 'Start your day with activity 7 days in a row. You\'re building champion habits!',
    icon: '🌅',
    criteria: (state) => state.statistics.morningActivitiesStreak >= 7,
    category: 'athlete',
    rarity: 'uncommon',
    adhdBenefit: 'Using exercise to regulate ADHD symptoms'
  },
  {
    id: 'movement_medicine',
    name: '💊 Movement Medicine',
    description: 'Use movement/exercise as ADHD medicine 20 times. Natural treatment for the win!',
    icon: '💊',
    criteria: (state) => state.statistics.movementForFocus >= 20,
    category: 'athlete',
    rarity: 'rare',
    adhdBenefit: 'Leveraging exercise as natural ADHD symptom management'
  },

  // Developer Achievements
  {
    id: 'debugging_master',
    name: '🐛 Debugging Master',
    description: 'Fix 10 "bugs" in your systems and habits. Your systematic thinking shines!',
    icon: '🐛',
    criteria: (state) => state.statistics.systemImprovements >= 10,
    category: 'developer',
    rarity: 'uncommon',
    adhdBenefit: 'Applying systematic problem-solving to life management'
  },
  {
    id: 'automation_architect',
    name: '🤖 Automation Architect',
    description: 'Set up 5 automated systems or habits. Work smarter, not harder!',
    icon: '🤖',
    criteria: (state) => state.statistics.automatedSystems >= 5,
    category: 'developer',
    rarity: 'rare',
    adhdBenefit: 'Reducing cognitive load through smart automation'
  },

  // Autism-Friendly Achievements
  {
    id: 'routine_royalty',
    name: '👑 Routine Royalty',
    description: 'Maintain the same daily routine for 14 days. Consistency is your crown!',
    icon: '👑',
    criteria: (state) => state.statistics.routineConsistency >= 14,
    category: 'neurodivergent',
    rarity: 'rare',
    adhdBenefit: 'Building structure that supports neurodivergent success'
  },
  {
    id: 'special_interest_scholar',
    name: '📚 Special Interest Scholar',
    description: 'Spend 50+ hours on a special interest this month. Deep knowledge is power!',
    icon: '📚',
    criteria: (state) => state.statistics.specialInterestHours >= 50,
    category: 'neurodivergent',
    rarity: 'epic',
    adhdBenefit: 'Celebrating the value of intense, focused interests'
  },
  {
    id: 'sensory_strategist',
    name: '🎯 Sensory Strategist',
    description: 'Successfully manage sensory environment 10 times. You know what you need!',
    icon: '🎯',
    criteria: (state) => state.statistics.sensoryManagement >= 10,
    category: 'neurodivergent',
    rarity: 'uncommon',
    adhdBenefit: 'Developing self-awareness about sensory needs'
  }
];

// Extended Achievement interface for enhanced system
// Now using the enhanced Achievement interface from types/game.ts

// Achievement notification system
export class AchievementNotificationSystem {
  private static notificationQueue: Achievement[] = [];
  
  static queueNotification(achievement: Achievement) {
    this.notificationQueue.push(achievement);
  }
  
  static getNextNotification(): Achievement | null {
    return this.notificationQueue.shift() || null;
  }
  
  static hasQueuedNotifications(): boolean {
    return this.notificationQueue.length > 0;
  }
  
  static clearQueue() {
    this.notificationQueue = [];
  }
  
  // Generate level-up analysis and tips
  static generateLevelUpAnalysis(level: number, gameState: any): {
    congratsMessage: string;
    progressAnalysis: string[];
    nextLevelTips: string[];
    adhdInsight: string;
  } {
    const analysis = {
      congratsMessage: '',
      progressAnalysis: [] as string[],
      nextLevelTips: [] as string[],
      adhdInsight: ''
    };
    
    // Congratulations message based on level
    if (level <= 5) {
      analysis.congratsMessage = `🎉 Level ${level}! You're building amazing momentum!`;
    } else if (level <= 10) {
      analysis.congratsMessage = `🚀 Level ${level}! You're becoming an ADHD management expert!`;
    } else {
      analysis.congratsMessage = `👑 Level ${level}! You're a true ADHD champion!`;
    }
    
    // Progress analysis
    analysis.progressAnalysis = [
      `Completed ${gameState.statistics.totalQuestsCompleted} quests`,
      `Maintained ${gameState.player.longestStreak}-day longest streak`,
      `Earned ${gameState.player.xp} total experience points`
    ];
    
    // Next level tips based on current level
    if (level <= 3) {
      analysis.nextLevelTips = [
        'Focus on building consistent daily habits',
        'Experiment with different task management methods',
        'Celebrate every small win along the way'
      ];
    } else if (level <= 6) {
      analysis.nextLevelTips = [
        'Start tracking your energy patterns',
        'Build systems that work with your ADHD brain',
        'Begin optimizing your environment for focus'
      ];
    } else if (level <= 10) {
      analysis.nextLevelTips = [
        'Develop advanced attention management strategies',
        'Create backup plans for challenging days',
        'Share your learning with others'
      ];
    } else {
      analysis.nextLevelTips = [
        'Mentor others on their ADHD journey',
        'Continue experimenting with new techniques',
        'Advocate for neurodivergent-friendly practices'
      ];
    }
    
    // ADHD-specific insight
    const insights = [
      'Your ADHD brain is wired for creativity and innovation - use that as your superpower!',
      'Remember: you\'re not behind, you\'re on your own unique timeline.',
      'Every strategy that works for you is valid, even if it\'s unconventional.',
      'Your hyperfocus ability is a genuine advantage when channeled correctly.',
      'Building systems that work with your brain, not against it, is the key to success.',
      'Your ability to think differently is exactly what the world needs.',
      'Progress over perfection - your journey is uniquely valuable.',
      'Your neurodivergent perspective brings innovation and fresh thinking.'
    ];
    
    analysis.adhdInsight = insights[level % insights.length];
    
    return analysis;
  }
}

export { ENHANCED_ACHIEVEMENTS };
export default ENHANCED_ACHIEVEMENTS;
