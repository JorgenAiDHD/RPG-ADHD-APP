// Super Quests & Challenges System - Revolutionary ADHD Brain Training v0.2
import type { GameState } from '../types/game';

export interface SuperChallenge {
  id: string;
  title: string;
  description: string;
  type: 'mind_control' | 'creative' | 'memory' | 'focus' | 'physical' | 'social' | 'habit_boss';
  category: 'instant' | 'daily' | 'weekly' | 'progressive';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'legendary';
  duration: number; // minutes
  xpReward: number;
  goldReward: number;
  skillBoosts?: SkillBoost[];
  requirements?: ChallengeRequirement[];
  instructions?: string[];
  successCriteria?: string[];
  tips?: string[];
  adhdBenefits?: string[];
  unlockLevel: number;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tags?: string[];
}

export interface SkillBoost {
  skillId: string;
  boost: number;
  duration: number; // minutes
}

export interface ChallengeRequirement {
  type: 'level' | 'streak' | 'skill_level' | 'completed_challenges' | 'character_class';
  value: number | string;
  description: string;
}

export interface ActiveChallenge {
  challengeId: string;
  startTime: Date;
  progress: number; // 0-100
  currentStep: number;
  timeRemaining: number; // seconds
  isCompleted: boolean;
  attempts: number;
  bestScore?: number;
}

export interface HabitBoss {
  id: string;
  name: string;
  description: string;
  icon: string;
  health: number;
  maxHealth: number;
  level: number;
  habitType: string;
  weaknesses: string[]; // Activities that damage this boss
  attacks: BossAttack[];
  rewards: BossReward[];
  defeatedDate?: Date;
}

export interface BossAttack {
  name: string;
  description: string;
  damage: number; // Damage to player's motivation/energy
  trigger: string; // When this attack happens
}

export interface BossReward {
  type: 'xp' | 'gold' | 'skill_boost' | 'character_class' | 'special_ability';
  value: number | string;
  description: string;
}

export class SuperChallengeSystem {
  private static readonly MIND_CONTROL_CHALLENGES: SuperChallenge[] = [
    // Easy Mind Control
    {
      id: 'balance_eyes_closed',
      title: '🎯 Balance Master',
      description: 'Stand on one leg with eyes closed - Ultimate ADHD focus challenge',
      type: 'mind_control',
      category: 'instant',
      difficulty: 'easy',
      duration: 2,
      xpReward: 25,
      goldReward: 15,
      skillBoosts: [
        { skillId: 'focus', boost: 10, duration: 60 },
        { skillId: 'resilience', boost: 5, duration: 30 }
      ],
      instructions: [
        '1. Find a safe, open space',
        '2. Close your eyes',
        '3. Lift one leg and hold balance',
        '4. Focus on your breathing',
        '5. Hold for 30-60 seconds'
      ],
      successCriteria: [
        'Maintain balance for at least 30 seconds',
        'Keep eyes closed throughout',
        'Stay focused on breathing'
      ],
      tips: [
        '💡 Start with 10 seconds, gradually increase',
        '🧘 Focus on deep, steady breathing',
        '⚖️ Use core muscles, not leg muscles',
        '🎯 Imagine a point of light in front of you'
      ],
      adhdBenefits: [
        '🧠 Improves executive function',
        '⚡ Enhances body awareness',
        '🎯 Strengthens concentration',
        '🧘 Reduces hyperactivity'
      ],
      unlockLevel: 1,
      icon: '🎯',
      rarity: 'common',
      tags: ['balance', 'focus', 'proprioception', 'mindfulness']
    },
    {
      id: 'breathing_rhythm',
      title: '🌊 Rhythm Breathing Master',
      description: 'Control your breath rhythm to hack your nervous system',
      type: 'mind_control',
      category: 'instant',
      difficulty: 'easy',
      duration: 5,
      xpReward: 30,
      goldReward: 20,
      skillBoosts: [
        { skillId: 'meditation', boost: 15, duration: 90 },
        { skillId: 'focus', boost: 8, duration: 60 }
      ],
      instructions: [
        '1. Sit comfortably with straight spine',
        '2. Breathe in for 4 counts',
        '3. Hold for 4 counts',
        '4. Breathe out for 6 counts',
        '5. Repeat 10 cycles'
      ],
      successCriteria: [
        'Complete 10 breathing cycles',
        'Maintain consistent rhythm',
        'Feel calmer after completion'
      ],
      tips: [
        '🫁 Longer exhale activates parasympathetic nervous system',
        '🧠 Count helps occupy the busy ADHD mind',
        '⏰ Use a metronome app for consistent timing',
        '🎵 Imagine your favorite slow song rhythm'
      ],
      adhdBenefits: [
        '😌 Reduces anxiety and hyperactivity',
        '🧠 Improves emotional regulation',
        '💤 Better sleep quality',
        '🎯 Enhanced focus and attention'
      ],
      unlockLevel: 1,
      icon: '🌊',
      rarity: 'common',
      tags: ['breathing', 'anxiety', 'regulation', 'calm']
    },

    // Medium Mind Control
    {
      id: 'sensory_overload_focus',
      title: '🎪 Sensory Chaos Navigator',
      description: 'Maintain focus while multiple distractions compete for attention',
      type: 'mind_control',
      category: 'instant',
      difficulty: 'medium',
      duration: 10,
      xpReward: 50,
      goldReward: 35,
      skillBoosts: [
        { skillId: 'focus', boost: 20, duration: 120 },
        { skillId: 'resilience', boost: 15, duration: 90 }
      ],
      instructions: [
        '1. Play 3 different audio sources (music, podcast, nature sounds)',
        '2. Set 5 visual distractions (blinking lights, moving objects)',
        '3. Count backwards from 100 by 7s',
        '4. Write down only the numbers divisible by 21',
        '5. Complete without losing count'
      ],
      successCriteria: [
        'Successfully count backwards with distractions',
        'Identify all numbers divisible by 21',
        'Maintain composure throughout'
      ],
      tips: [
        '🎯 Use tunnel vision - focus only on the numbers',
        '🧠 Acknowledge distractions but don\'t engage',
        '💪 Start with fewer distractions, build up',
        '⚡ This trains real-world ADHD focus skills'
      ],
      adhdBenefits: [
        '🛡️ Builds distraction immunity',
        '🧠 Strengthens selective attention',
        '⚡ Improves working memory',
        '🎯 Real-world focus application'
      ],
      unlockLevel: 5,
      icon: '🎪',
      rarity: 'uncommon',
      tags: ['distraction', 'working_memory', 'attention', 'chaos']
    },

    // Hard Mind Control
    {
      id: 'emotional_regulation_challenge',
      title: '🎭 Emotion Conductor',
      description: 'Master your emotional state through conscious control techniques',
      type: 'mind_control',
      category: 'instant',
      difficulty: 'hard',
      duration: 15,
      xpReward: 75,
      goldReward: 50,
      skillBoosts: [
        { skillId: 'resilience', boost: 25, duration: 180 },
        { skillId: 'social', boost: 15, duration: 120 }
      ],
      instructions: [
        '1. Think of a recent frustrating situation',
        '2. Feel the emotions arise (anger, frustration)',
        '3. Use the STOP technique: Stop, Take a breath, Observe, Proceed',
        '4. Reframe the situation with 3 positive perspectives',
        '5. Notice the shift in your emotional state'
      ],
      successCriteria: [
        'Successfully shift from negative to neutral/positive emotion',
        'Identify 3 valid positive reframes',
        'Maintain emotional control throughout'
      ],
      tips: [
        '🧠 ADHD brains have intense emotions - this builds control',
        '🎭 Practice with small frustrations first',
        '💭 Ask: "What would I tell a friend in this situation?"',
        '⚡ This skill transforms your entire life experience'
      ],
      adhdBenefits: [
        '🧠 Builds emotional intelligence',
        '😌 Reduces RSD (Rejection Sensitive Dysphoria)',
        '🤝 Improves relationships',
        '⚡ Increases life satisfaction'
      ],
      unlockLevel: 10,
      icon: '🎭',
      rarity: 'rare',
      tags: ['emotions', 'regulation', 'reframing', 'control']
    }
  ];

  private static readonly CREATIVE_CHALLENGES: SuperChallenge[] = [
    {
      id: 'fusion_drawing',
      title: '🎨 Fusion Artist',
      description: 'Draw impossible combinations to unlock creative superpowers',
      type: 'creative',
      category: 'instant',
      difficulty: 'easy',
      duration: 15,
      xpReward: 40,
      goldReward: 25,
      skillBoosts: [
        { skillId: 'creativity', boost: 20, duration: 120 },
        { skillId: 'focus', boost: 10, duration: 90 }
      ],
      instructions: [
        '1. Generate 2 random words (use random word generator)',
        '2. Imagine how these concepts could combine',
        '3. Draw the fusion creature/object',
        '4. Write a 3-sentence story about it',
        '5. Give it a creative name'
      ],
      successCriteria: [
        'Complete drawing showing clear fusion of both concepts',
        'Write creative backstory',
        'Invent an original name'
      ],
      tips: [
        '🎨 No artistic skill required - creativity counts!',
        '🧠 ADHD brains excel at unexpected connections',
        '⚡ Set timer to avoid perfectionism trap',
        '🌟 Share with others for bonus motivation'
      ],
      adhdBenefits: [
        '🧠 Stimulates divergent thinking',
        '⚡ Channels hyperactivity creatively',
        '🎯 Improves focus through interest',
        '😊 Boosts self-expression confidence'
      ],
      unlockLevel: 2,
      icon: '🎨',
      rarity: 'common',
      tags: ['drawing', 'fusion', 'creativity', 'storytelling']
    },
    {
      id: 'speed_invention',
      title: '⚡ Lightning Inventor',
      description: 'Invent solutions to random problems in 5 minutes',
      type: 'creative',
      category: 'instant',
      difficulty: 'medium',
      duration: 5,
      xpReward: 45,
      goldReward: 30,
      skillBoosts: [
        { skillId: 'creativity', boost: 25, duration: 90 },
        { skillId: 'learning', boost: 15, duration: 60 }
      ],
      instructions: [
        '1. Generate random problem (app or dice + problem list)',
        '2. Set 5-minute timer',
        '3. Brainstorm solution ideas (no filtering)',
        '4. Pick the most creative solution',
        '5. Sketch it with key features labeled'
      ],
      successCriteria: [
        'Generate at least 5 solution ideas',
        'Select and develop one creative solution',
        'Complete sketch with explanations'
      ],
      tips: [
        '⚡ Speed prevents overthinking (ADHD superpower!)',
        '🧠 Wild ideas often lead to breakthroughs',
        '🎯 Focus on function over form',
        '💡 Ask "What if?" and "Why not?"'
      ],
      adhdBenefits: [
        '⚡ Leverages ADHD rapid thinking',
        '🧠 Builds problem-solving confidence',
        '🎯 Improves idea generation skills',
        '💪 Reduces perfectionism paralysis'
      ],
      unlockLevel: 6,
      icon: '⚡',
      rarity: 'uncommon',
      tags: ['invention', 'problem_solving', 'speed', 'innovation']
    }
  ];

  private static readonly MEMORY_CHALLENGES: SuperChallenge[] = [
    {
      id: 'word_association_chain',
      title: '🔗 Memory Chain Master',
      description: 'Build epic word association chains to boost memory power',
      type: 'memory',
      category: 'instant',
      difficulty: 'easy',
      duration: 10,
      xpReward: 35,
      goldReward: 20,
      skillBoosts: [
        { skillId: 'learning', boost: 15, duration: 90 },
        { skillId: 'focus', boost: 10, duration: 60 }
      ],
      instructions: [
        '1. Start with random word (e.g., "Ocean")',
        '2. Create association chain: Ocean → Blue → Sky → Birds → Freedom',
        '3. Build chain of 15+ words',
        '4. Each word must connect logically to previous',
        '5. Recite entire chain backwards'
      ],
      successCriteria: [
        'Create chain of at least 15 words',
        'Each connection makes logical sense',
        'Successfully recite backwards'
      ],
      tips: [
        '🧠 ADHD brains excel at creative associations',
        '🔗 Use vivid, personal connections',
        '🎨 Visualize each connection as a scene',
        '⚡ Speed up for extra challenge'
      ],
      adhdBenefits: [
        '🧠 Strengthens working memory',
        '🔗 Improves association skills',
        '📚 Better learning retention',
        '⚡ Enhances mental flexibility'
      ],
      unlockLevel: 3,
      icon: '🔗',
      rarity: 'common',
      tags: ['associations', 'memory', 'connections', 'recall']
    },
    {
      id: 'number_palace',
      title: '🏰 Memory Palace Architect',
      description: 'Build mental palaces to store information like a genius',
      type: 'memory',
      category: 'instant',
      difficulty: 'hard',
      duration: 20,
      xpReward: 80,
      goldReward: 55,
      skillBoosts: [
        { skillId: 'learning', boost: 30, duration: 180 },
        { skillId: 'organization', boost: 20, duration: 120 }
      ],
      instructions: [
        '1. Choose familiar location (your home, school, workplace)',
        '2. Create mental route through 10 specific spots',
        '3. Memorize list of 20 random numbers (generated)',
        '4. Place 2 numbers at each location with vivid imagery',
        '5. Walk mental route and recall all numbers in order'
      ],
      successCriteria: [
        'Successfully recall all 20 numbers in correct order',
        'Use vivid imagery for each placement',
        'Complete mental walk-through'
      ],
      tips: [
        '🏰 Make images bizarre and memorable',
        '🎨 Use all senses in visualizations',
        '🚶 Practice the route multiple times',
        '⚡ This ancient technique still works!'
      ],
      adhdBenefits: [
        '🧠 Builds spatial-visual memory',
        '📚 Revolutionary learning technique',
        '🎯 Improves sustained attention',
        '💪 Boosts academic/work performance'
      ],
      unlockLevel: 12,
      icon: '🏰',
      rarity: 'epic',
      tags: ['memory_palace', 'visualization', 'learning', 'genius']
    }
  ];

  private static readonly HABIT_BOSSES: HabitBoss[] = [
    {
      id: 'procrastination_dragon',
      name: '🐉 Procrastination Dragon',
      description: 'The mighty beast that breathes "I\'ll do it tomorrow" fire',
      icon: '🐉',
      health: 100,
      maxHealth: 100,
      level: 1,
      habitType: 'procrastination',
      weaknesses: [
        'completing_any_task',
        'pomodoro_session',
        'daily_planning',
        'breaking_tasks_down'
      ],
      attacks: [
        {
          name: 'Tomorrow Breath',
          description: 'Makes everything seem easier "tomorrow"',
          damage: 15,
          trigger: 'When you start an important task'
        },
        {
          name: 'Perfectionism Paralysis',
          description: 'Convinces you it must be perfect before starting',
          damage: 20,
          trigger: 'When facing complex projects'
        }
      ],
      rewards: [
        { type: 'xp', value: 200, description: '+200 XP for defeating the mighty dragon' },
        { type: 'gold', value: 150, description: '+150 Gold treasure hoard' },
        { type: 'skill_boost', value: 'focus+25', description: '+25 Focus skill boost for 24 hours' },
        { type: 'character_class', value: 'task_slayer', description: 'Unlock Task Slayer character class' }
      ]
    },
    {
      id: 'distraction_hydra',
      name: '🐍 Distraction Hydra',
      description: 'Multi-headed beast of notifications, social media, and shiny objects',
      icon: '🐍',
      health: 150,
      maxHealth: 150,
      level: 2,
      habitType: 'distractions',
      weaknesses: [
        'focus_session',
        'phone_in_other_room',
        'notification_blocking',
        'single_tasking'
      ],
      attacks: [
        {
          name: 'Notification Storm',
          description: 'Floods you with urgent but unimportant alerts',
          damage: 12,
          trigger: 'During deep work sessions'
        },
        {
          name: 'Shiny Object Syndrome',
          description: 'New ideas/projects appear more interesting than current task',
          damage: 18,
          trigger: 'When current task gets challenging'
        }
      ],
      rewards: [
        { type: 'xp', value: 300, description: '+300 XP for conquering chaos' },
        { type: 'gold', value: 200, description: '+200 Gold from focused productivity' },
        { type: 'special_ability', value: 'distraction_immunity', description: '1-hour distraction immunity buff' }
      ]
    },
    {
      id: 'perfectionism_golem',
      name: '🗿 Perfectionism Golem',
      description: 'Stone giant that crushes progress in pursuit of impossible perfection',
      icon: '🗿',
      health: 200,
      maxHealth: 200,
      level: 3,
      habitType: 'perfectionism',
      weaknesses: [
        'done_is_better_than_perfect',
        'time_boxing',
        'mvp_approach',
        'progress_over_perfection'
      ],
      attacks: [
        {
          name: 'Never Good Enough',
          description: 'Makes completed work feel inadequate',
          damage: 25,
          trigger: 'When reviewing finished work'
        },
        {
          name: 'Analysis Paralysis',
          description: 'Endless planning prevents actual action',
          damage: 22,
          trigger: 'When starting new projects'
        }
      ],
      rewards: [
        { type: 'xp', value: 400, description: '+400 XP for embracing progress' },
        { type: 'gold', value: 250, description: '+250 Gold from completed projects' },
        { type: 'skill_boost', value: 'organization+30', description: '+30 Organization boost for 48 hours' },
        { type: 'special_ability', value: 'progress_mindset', description: 'Permanent "Progress over Perfection" mindset boost' }
      ]
    }
  ];

  // Get challenges by difficulty
  static getChallengesByDifficulty(difficulty: SuperChallenge['difficulty']): SuperChallenge[] {
    return [
      ...this.MIND_CONTROL_CHALLENGES,
      ...this.CREATIVE_CHALLENGES,
      ...this.MEMORY_CHALLENGES
    ].filter(challenge => challenge.difficulty === difficulty);
  }

  // Get challenges by type
  static getChallengesByType(type: SuperChallenge['type']): SuperChallenge[] {
    return [
      ...this.MIND_CONTROL_CHALLENGES,
      ...this.CREATIVE_CHALLENGES,
      ...this.MEMORY_CHALLENGES
    ].filter(challenge => challenge.type === type);
  }

  // Get available challenges for player level
  static getAvailableChallenges(playerLevel: number): SuperChallenge[] {
    return [
      ...this.MIND_CONTROL_CHALLENGES,
      ...this.CREATIVE_CHALLENGES,
      ...this.MEMORY_CHALLENGES
    ].filter(challenge => challenge.unlockLevel <= playerLevel);
  }

  // Get daily challenge recommendation
  static getDailyChallengeRecommendation(state: GameState): SuperChallenge {
    const availableChallenges = this.getAvailableChallenges(state.player.level);
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31 + today.getFullYear() * 365;
    const randomIndex = seed % availableChallenges.length;
    return availableChallenges[randomIndex];
  }

  // Battle habit boss
  static attackHabitBoss(bossId: string, attackType: string, damage: number): Partial<HabitBoss> {
    const boss = this.HABIT_BOSSES.find(b => b.id === bossId);
    if (!boss || !boss.weaknesses.includes(attackType)) return {};

    const newHealth = Math.max(0, boss.health - damage);
    return {
      health: newHealth,
      defeatedDate: newHealth === 0 ? new Date() : undefined
    };
  }

  // Get active habit bosses
  static getActiveHabitBosses(): HabitBoss[] {
    return this.HABIT_BOSSES.filter(boss => !boss.defeatedDate);
  }

  // Generate random challenge
  static generateRandomChallenge(type?: SuperChallenge['type'], difficulty?: SuperChallenge['difficulty']): SuperChallenge {
    let challenges = [
      ...this.MIND_CONTROL_CHALLENGES,
      ...this.CREATIVE_CHALLENGES,
      ...this.MEMORY_CHALLENGES
    ];

    if (type) {
      challenges = challenges.filter(c => c.type === type);
    }

    if (difficulty) {
      challenges = challenges.filter(c => c.difficulty === difficulty);
    }

    const randomIndex = Math.floor(Math.random() * challenges.length);
    return challenges[randomIndex];
  }

  // Complete challenge and get rewards
  static completeChallenge(challenge: SuperChallenge, performance: number): {
    xpGained: number;
    goldGained: number;
    skillBoosts: SkillBoost[];
    bonusRewards: string[];
  } {
    const performanceMultiplier = Math.max(0.5, Math.min(2.0, performance / 100));
    
    const xpGained = Math.floor(challenge.xpReward * performanceMultiplier);
    const goldGained = Math.floor(challenge.goldReward * performanceMultiplier);
    
    let bonusRewards: string[] = [];
    
    // Perfect performance bonuses
    if (performance >= 100) {
      bonusRewards.push('🏆 Perfect Performance Bonus!');
      bonusRewards.push('+50% XP and Gold');
    }
    
    // First time completion
    if (performance >= 80) {
      bonusRewards.push('⭐ Excellent completion!');
    }

    return {
      xpGained,
      goldGained,
      skillBoosts: challenge.skillBoosts || [],
      bonusRewards
    };
  }
}
