// Character Classes & Stats System for RPG Elements v0.2
import type { GameState } from '../types/game';

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCriteria: (state: GameState) => boolean;
  unlockDescription: string;
  bonuses: ClassBonus[];
  requirements: {
    minLevel?: number;
    questsCompleted?: number;
    specificActivities?: string[];
    streakDays?: number;
  };
  tier: 'basic' | 'advanced' | 'master';
  progress?: string; // Add progress field for locked classes
}

export interface ClassBonus {
  type: 'xp_multiplier' | 'health_boost' | 'energy_boost' | 'gold_multiplier' | 'special_ability';
  value: number;
  description: string;
}

export interface PlayerSkill {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxLevel: number;
  category: 'physical' | 'mental' | 'social' | 'creative' | 'technical';
  icon: string;
  description: string;
}

export interface SkillChart {
  skills: PlayerSkill[];
  overallLevel: number;
  strongestSkill: string;
  weakestSkill: string;
  balance: number; // 0-100, how balanced the skills are
}

export class CharacterClassSystem {
  private static readonly CHARACTER_CLASSES: CharacterClass[] = [
    // Basic Classes
    {
      id: 'novice',
      name: 'Novice',
      description: 'Just starting your RPG journey',
      icon: '🌱',
      unlockCriteria: () => true,
      unlockDescription: 'Starting class - always available',
      bonuses: [],
      requirements: {},
      tier: 'basic'
    },
    {
      id: 'monk',
      name: 'Monk',
      description: 'Master of mindfulness and inner peace',
      icon: '🧘',
      unlockCriteria: (state: GameState) => {
        const meditationCount = state.recentActivity.filter(
          a => a.description.toLowerCase().includes('meditat')
        ).length;
        return meditationCount >= 7 && state.player.level >= 3;
      },
      unlockDescription: 'Complete 7 meditation sessions and reach level 3',
      bonuses: [
        { type: 'health_boost', value: 20, description: '+20 max health from mental clarity' },
        { type: 'xp_multiplier', value: 1.2, description: '+20% XP from mindfulness activities' }
      ],
      requirements: { minLevel: 3 },
      tier: 'basic'
    },
    {
      id: 'warrior',
      name: 'Warrior',
      description: 'Champion of physical strength and endurance',
      icon: '⚔️',
      unlockCriteria: (state: GameState) => {
        const exerciseCount = state.recentActivity.filter(
          a => a.description.toLowerCase().includes('exercise') || 
               a.description.toLowerCase().includes('workout')
        ).length;
        return exerciseCount >= 10 && state.player.level >= 4;
      },
      unlockDescription: 'Complete 10 exercise sessions and reach level 4',
      bonuses: [
        { type: 'energy_boost', value: 25, description: '+25 max energy from physical fitness' },
        { type: 'xp_multiplier', value: 1.3, description: '+30% XP from physical activities' }
      ],
      requirements: { minLevel: 4 },
      tier: 'basic'
    },
    {
      id: 'scholar',
      name: 'Scholar',
      description: 'Seeker of knowledge and wisdom',
      icon: '📚',
      unlockCriteria: (state: GameState) => {
        const learningQuests = state.quests.filter(
          q => q.status === 'completed' && q.category === 'learning'
        ).length;
        return learningQuests >= 5 && state.player.level >= 3;
      },
      unlockDescription: 'Complete 5 learning quests and reach level 3',
      bonuses: [
        { type: 'xp_multiplier', value: 1.25, description: '+25% XP from learning activities' },
        { type: 'gold_multiplier', value: 1.15, description: '+15% gold from knowledge quests' }
      ],
      requirements: { minLevel: 3 },
      tier: 'basic'
    },

    // Advanced Classes
    {
      id: 'alchemist',
      name: 'Alchemist/Mage',
      description: 'Master of science, math, and mystical knowledge',
      icon: '🧙',
      unlockCriteria: (state: GameState) => {
        const scienceActivities = state.recentActivity.filter(
          a => a.description.toLowerCase().includes('math') ||
               a.description.toLowerCase().includes('science') ||
               a.description.toLowerCase().includes('chemistry') ||
               a.description.toLowerCase().includes('physics')
        ).length;
        return scienceActivities >= 15 && state.player.level >= 8;
      },
      unlockDescription: 'Complete 15 science/math activities and reach level 8',
      bonuses: [
        { type: 'xp_multiplier', value: 1.4, description: '+40% XP from STEM activities' },
        { type: 'special_ability', value: 1, description: 'Unlock experiment tracking system' }
      ],
      requirements: { minLevel: 8, questsCompleted: 25 },
      tier: 'advanced'
    },
    {
      id: 'artist',
      name: 'Artist',
      description: 'Creator of beauty and inspiration',
      icon: '🎨',
      unlockCriteria: (state: GameState) => {
        const creativeQuests = state.quests.filter(
          q => q.status === 'completed' && q.category === 'creative'
        ).length;
        return creativeQuests >= 8 && state.player.level >= 6;
      },
      unlockDescription: 'Complete 8 creative quests and reach level 6',
      bonuses: [
        { type: 'xp_multiplier', value: 1.35, description: '+35% XP from creative activities' },
        { type: 'special_ability', value: 1, description: 'Unlock daily inspiration system' }
      ],
      requirements: { minLevel: 6 },
      tier: 'advanced'
    },

    // Master Classes
    {
      id: 'grandmaster',
      name: 'Grandmaster',
      description: 'Master of all aspects of life',
      icon: '👑',
      unlockCriteria: (state: GameState) => {
        const allCategories = ['work', 'personal', 'health', 'learning', 'creative', 'social'];
        const completedInAllCategories = allCategories.every(category => 
          state.quests.some(q => q.status === 'completed' && q.category === category)
        );
        return completedInAllCategories && state.player.level >= 15 && state.player.longestStreak >= 14;
      },
      unlockDescription: 'Complete quests in all categories, reach level 15, and maintain 14-day streak',
      bonuses: [
        { type: 'xp_multiplier', value: 1.5, description: '+50% XP from all activities' },
        { type: 'health_boost', value: 50, description: '+50 max health' },
        { type: 'energy_boost', value: 50, description: '+50 max energy' },
        { type: 'gold_multiplier', value: 1.25, description: '+25% gold from all sources' }
      ],
      requirements: { minLevel: 15, streakDays: 14 },
      tier: 'master'
    }
  ];

  // Get available classes for player
  static getAvailableClasses(state: GameState): CharacterClass[] {
    return this.CHARACTER_CLASSES.filter(cls => cls.unlockCriteria(state));
  }

  // Get locked classes with progress
  static getLockedClassesWithProgress(state: GameState): Array<CharacterClass & { progress: string }> {
    return this.CHARACTER_CLASSES
      .filter(cls => !cls.unlockCriteria(state))
      .map(cls => ({
        ...cls,
        progress: this.getClassProgress(cls, state)
      }));
  }

  // Calculate progress towards unlocking a class
  static getClassProgress(characterClass: CharacterClass, state: GameState): string {
    const { requirements } = characterClass;
    const progressItems: string[] = [];

    if (requirements.minLevel) {
      const current = state.player.level;
      const required = requirements.minLevel;
      progressItems.push(`Level: ${current}/${required}`);
    }

    if (requirements.questsCompleted) {
      const current = state.quests.filter(q => q.status === 'completed').length;
      const required = requirements.questsCompleted;
      progressItems.push(`Quests: ${current}/${required}`);
    }

    if (requirements.streakDays) {
      const current = state.player.longestStreak;
      const required = requirements.streakDays;
      progressItems.push(`Streak: ${current}/${required} days`);
    }

    return progressItems.join(', ');
  }

  // Get current player class
  static getCurrentClass(state: GameState): CharacterClass {
    const availableClasses = this.getAvailableClasses(state);
    // Return the highest tier class available
    const masterClass = availableClasses.find(c => c.tier === 'master');
    if (masterClass) return masterClass;
    
    const advancedClass = availableClasses.find(c => c.tier === 'advanced');
    if (advancedClass) return advancedClass;
    
    const basicClass = availableClasses.filter(c => c.tier === 'basic').pop();
    return basicClass || this.CHARACTER_CLASSES[0]; // Fallback to Novice
  }

  // Calculate total bonuses from current class
  static getActiveBonuses(state: GameState): ClassBonus[] {
    const currentClass = this.getCurrentClass(state);
    return currentClass.bonuses;
  }
}

export class SkillChartSystem {
  private static readonly DEFAULT_SKILLS: Omit<PlayerSkill, 'level' | 'experience'>[] = [
    { id: 'focus', name: 'Focus', maxLevel: 100, category: 'mental', icon: '🎯', description: 'Ability to concentrate and avoid distractions' },
    { id: 'meditation', name: 'Meditation', maxLevel: 100, category: 'mental', icon: '🧘', description: 'Mindfulness and inner peace mastery' },
    { id: 'exercise', name: 'Exercise', maxLevel: 100, category: 'physical', icon: '💪', description: 'Physical fitness and strength' },
    { id: 'learning', name: 'Learning', maxLevel: 100, category: 'mental', icon: '📚', description: 'Knowledge acquisition and retention' },
    { id: 'creativity', name: 'Creativity', maxLevel: 100, category: 'creative', icon: '🎨', description: 'Artistic expression and innovation' },
    { id: 'social', name: 'Social', maxLevel: 100, category: 'social', icon: '👥', description: 'Communication and relationship skills' },
    { id: 'organization', name: 'Organization', maxLevel: 100, category: 'technical', icon: '📋', description: 'Planning and time management' },
    { id: 'resilience', name: 'Resilience', maxLevel: 100, category: 'mental', icon: '🛡️', description: 'Emotional strength and adaptability' }
  ];

  // Initialize default skills
  static getDefaultSkills(): PlayerSkill[] {
    return this.DEFAULT_SKILLS.map(skill => ({
      ...skill,
      level: 1,
      experience: 0
    }));
  }

  // Update skill based on activity
  static updateSkillFromActivity(skills: PlayerSkill[], activityType: string, questCategory?: string): PlayerSkill[] {
    const updatedSkills = [...skills];
    
    // Map activities to skills
    const skillMappings: Record<string, { skillId: string, xp: number }[]> = {
      'quest_completed': [
        { skillId: 'organization', xp: 5 },
        { skillId: 'resilience', xp: 3 }
      ],
      'health_activity': [
        { skillId: 'exercise', xp: 8 },
        { skillId: 'resilience', xp: 4 }
      ],
      'focus_session': [
        { skillId: 'focus', xp: 10 },
        { skillId: 'meditation', xp: 6 }
      ]
    };

    // Category-specific mappings
    if (questCategory) {
      const categoryMappings: Record<string, { skillId: string, xp: number }[]> = {
        'learning': [{ skillId: 'learning', xp: 10 }],
        'creative': [{ skillId: 'creativity', xp: 10 }],
        'social': [{ skillId: 'social', xp: 10 }],
        'health': [{ skillId: 'exercise', xp: 8 }, { skillId: 'meditation', xp: 6 }]
      };

      const categorySkills = categoryMappings[questCategory];
      if (categorySkills) {
        categorySkills.forEach(({ skillId, xp }) => {
          this.addSkillXP(updatedSkills, skillId, xp);
        });
      }
    }

    // Apply activity-specific skills
    const activitySkills = skillMappings[activityType];
    if (activitySkills) {
      activitySkills.forEach(({ skillId, xp }) => {
        this.addSkillXP(updatedSkills, skillId, xp);
      });
    }

    return updatedSkills;
  }

  // Add XP to a specific skill
  private static addSkillXP(skills: PlayerSkill[], skillId: string, xp: number): void {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    skill.experience += xp;
    
    // Level up calculation (exponential curve)
    const requiredXP = this.getRequiredXPForLevel(skill.level + 1);
    while (skill.experience >= requiredXP && skill.level < skill.maxLevel) {
      skill.level++;
      skill.experience -= requiredXP;
    }
  }

  // Calculate required XP for level (make it public)
  static getRequiredXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.1, level - 1));
  }

  // Generate skill chart data
  static generateSkillChart(skills: PlayerSkill[]): SkillChart {
    const overallLevel = Math.floor(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length);
    const sortedSkills = [...skills].sort((a, b) => b.level - a.level);
    
    const strongestSkill = sortedSkills[0]?.name || '';
    const weakestSkill = sortedSkills[sortedSkills.length - 1]?.name || '';
    
    // Calculate balance (how evenly distributed the skills are)
    const avgLevel = overallLevel;
    const variance = skills.reduce((sum, skill) => sum + Math.pow(skill.level - avgLevel, 2), 0) / skills.length;
    const balance = Math.max(0, 100 - (variance * 2)); // Lower variance = higher balance

    return {
      skills,
      overallLevel,
      strongestSkill,
      weakestSkill,
      balance: Math.floor(balance)
    };
  }

  // Get skill recommendations
  static getSkillRecommendations(skillChart: SkillChart): string[] {
    const recommendations: string[] = [];
    const { skills, balance } = skillChart;

    // Balance recommendation
    if (balance < 50) {
      const weakestSkills = skills.filter(s => s.level < skillChart.overallLevel - 5);
      if (weakestSkills.length > 0) {
        recommendations.push(`🎯 Focus on improving ${weakestSkills[0].name} for better balance`);
      }
    }

    // Strength recommendation
    const strongestSkill = skills.reduce((prev, current) => 
      prev.level > current.level ? prev : current
    );
    if (strongestSkill.level > skillChart.overallLevel + 10) {
      recommendations.push(`⚡ Your ${strongestSkill.name} skill is exceptional! Consider teaching others`);
    }

    // Category recommendations
    const categories = ['mental', 'physical', 'social', 'creative', 'technical'];
    categories.forEach(category => {
      const categorySkills = skills.filter(s => s.category === category);
      const avgCategoryLevel = categorySkills.reduce((sum, s) => sum + s.level, 0) / categorySkills.length;
      
      if (avgCategoryLevel < skillChart.overallLevel - 8) {
        recommendations.push(`📈 Consider more ${category} activities to develop those skills`);
      }
    });

    return recommendations.slice(0, 3); // Return top 3 recommendations
  }
}
