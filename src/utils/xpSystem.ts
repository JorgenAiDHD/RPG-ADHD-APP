import type { GameState, XPSystemResult, LevelUpResult, Quest, HealthActivity } from '../types/game';
import { ALL_SKILLS } from '../data/skills';

export const XPSystem = {
  calculateXPForLevel: (level: number): number => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  },
  addXP: (
    state: GameState,
    currentXP: number,
    currentLevel: number,
    amount: number,
    currentStreak: number,
    bonusMultiplier: number = 1,
    unlockedSkills: string[] = [],
    quest?: Quest,
    healthActivity?: HealthActivity
  ): XPSystemResult => {
    let actualXPGained = amount;
    if (currentStreak >= 7) actualXPGained *= 3;
    else if (currentStreak >= 3) actualXPGained *= 2;
    actualXPGained *= bonusMultiplier;
    ALL_SKILLS.forEach(skill => {
      if (unlockedSkills.includes(skill.id) && skill.id === 'adaptive_focus') {
        actualXPGained = skill.effect(state, actualXPGained, quest, healthActivity);
      }
    });
    let newXP = currentXP + actualXPGained;
    let newLevel = currentLevel;
    let leveledUp = false;
    let skillPointsEarned = 0;
    let unlockedFeatures: string[] = [];
    const xpToNextLevel = XPSystem.calculateXPForLevel(currentLevel + 1);
    if (newXP >= xpToNextLevel) {
      leveledUp = true;
      newLevel++;
      newXP -= xpToNextLevel;
      if (newLevel % 3 === 0) skillPointsEarned = 1;
    }
    const levelUpResult: LevelUpResult = {
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
      skillPointsEarned: leveledUp ? skillPointsEarned : undefined,
      unlockedFeatures: leveledUp ? unlockedFeatures : undefined,
    };
    return { newXP, newLevel, actualXPGained, levelUpResult };
  },
  calculateStreak: (lastActiveDate: Date | string | null, currentDate: Date) => {
    // Handle null case
    if (!lastActiveDate) {
      console.log('No previous activity date, starting first streak');
      return { isStreakBroken: false, daysSinceLastActive: 0 };
    }
    
    // Convert string to Date if needed
    const lastActiveDay = typeof lastActiveDate === 'string' ? new Date(lastActiveDate) : new Date(lastActiveDate);
    lastActiveDay.setHours(0, 0, 0, 0);
    
    const currentDay = new Date(currentDate);
    currentDay.setHours(0, 0, 0, 0);
    
    // Calculate difference in milliseconds, then days
    const diffTime = currentDay.getTime() - lastActiveDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    console.log(`Streak calculation: lastActiveDay=${lastActiveDay.toISOString()}, currentDay=${currentDay.toISOString()}, diffDays=${diffDays}`);
    
    if (diffDays === 1) {
      // Activity was yesterday - streak continues
      console.log('Streak continued: Activity was yesterday');
      return { isStreakBroken: false, daysSinceLastActive: 1 };
    } else if (diffDays > 1) {
      // Activity was more than one day ago - streak broken
      console.log(`Streak broken: Last activity was ${diffDays} days ago`);
      return { isStreakBroken: true, daysSinceLastActive: diffDays };
    } else if (diffDays === 0) {
      // Activity was today - streak doesn't change
      console.log('Streak unchanged: Activity was today');
      return { isStreakBroken: false, daysSinceLastActive: 0 };
    } else {
      // Negative difference - this shouldn't happen in normal cases
      // Possible clock adjustment or timezone issue
      console.warn(`Unexpected day difference: ${diffDays}, treating as same day`);
      return { isStreakBroken: false, daysSinceLastActive: 0 };
    }
  },
};
