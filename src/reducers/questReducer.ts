import type { GameState, Quest, ActivityLog, Collectible } from '../types/game';
import { XPSystem } from '../utils/xpSystem';
import { CollectibleSystem } from '../utils/collectibles';
import { SkillChartSystem } from '../utils/characterClasses';
import { toast } from 'sonner';

export type QuestAction =
  | { type: 'COMPLETE_QUEST'; payload: string }
  | { type: 'ADD_QUEST'; payload: Quest }
  | { type: 'EDIT_QUEST'; payload: Quest }
  | { type: 'SET_MAIN_QUEST'; payload: { title: string; description: string } }
  | { type: 'SET_ACTIVE_QUEST'; payload: string | null }; // Nowa akcja do ustawiania aktywnego zadania

export function questReducer(state: GameState, action: QuestAction): Partial<GameState> {
  switch (action.type) {
    case 'COMPLETE_QUEST': {
      const quest = state.quests.find(q => q.id === action.payload);
      if (!quest || quest.status === 'completed') return {};

      let actualXPGained = quest.xpReward;
      let healthBonus = 0;

      // Apply AntiProcrastinationAura skill effect
      if (state.unlockedSkills.includes('anti_procrastination_aura') && quest.anxietyLevel === 'daunting') {
        // For simplicity, assuming completion within 15 minutes is met if the skill is unlocked and task is daunting
        // In a real scenario, you'd track the start time of the quest.

        healthBonus += 10;
        actualXPGained += Math.floor(quest.xpReward * 0.10);
        toast.info('Anti-Procrastination Aura activated! Bonus HP & XP gained.', { duration: 3000 });
      }
      const bonusMultiplier = state.bonusXPActive && new Date() < state.bonusXPActive.expiresAt ? state.bonusXPActive.multiplier : 1;
      const xpResult = XPSystem.addXP(state, state.player.xp, state.player.level, actualXPGained, state.player.currentStreak, bonusMultiplier, state.unlockedSkills, quest);
      let newCollectible: Collectible | null = null;
      const collectibleChance = Math.random();
      const questDifficulty = quest.difficultyLevel || 1;
      const chanceThreshold = 0.15 + (questDifficulty * 0.05);
      if (collectibleChance < chanceThreshold && state.player.level >= 5) {
        const collectibleType = quest.anxietyLevel === 'challenging' || quest.anxietyLevel === 'daunting' ? 'skill' : quest.type === 'daily' ? 'insight' : 'knowledge';
        const collectibleData = CollectibleSystem.generateRandomCollectible(collectibleType);
        newCollectible = { ...collectibleData, id: crypto.randomUUID(), dateCollected: new Date() } as Collectible;
      }
      const activity: ActivityLog = { id: crypto.randomUUID(), type: 'quest_completed', description: `Completed "${quest.title}"`, timestamp: new Date(), xpGained: xpResult.actualXPGained };
      const currentStatistics = state.statistics || { totalXPEarned: 0, totalQuestsCompleted: 0, longestStreak: 0, currentStreak: 0, averageTaskCompletionTime: 0, favoriteQuestTypes: [], collectiblesFound: 0, healthActivitiesLogged: 0 };
      
      // Update player skills based on quest completion
      const updatedSkills = SkillChartSystem.updateSkillFromActivity(
        state.playerSkills || SkillChartSystem.getDefaultSkills(),
        'quest_completed',
        quest.category
      );
      const updatedSkillChart = SkillChartSystem.generateSkillChart(updatedSkills);
      
      return {
        player: { ...state.player, xp: xpResult.newXP, level: xpResult.newLevel, xpToNextLevel: XPSystem.calculateXPForLevel(xpResult.newLevel + 1), skillPoints: state.player.skillPoints + (xpResult.levelUpResult.skillPointsEarned || 0) },
        healthBar: { ...state.healthBar, current: Math.min(state.healthBar.maximum, state.healthBar.current + healthBonus) },
        quests: state.quests.map(q => q.id === action.payload ? { ...q, status: 'completed' as const, completedDate: new Date() } : q),
        collectibles: newCollectible ? [...state.collectibles, newCollectible] : state.collectibles,
        statistics: { ...currentStatistics, totalQuestsCompleted: currentStatistics.totalQuestsCompleted + 1, totalXPEarned: currentStatistics.totalXPEarned + xpResult.actualXPGained, collectiblesFound: newCollectible ? currentStatistics.collectiblesFound + 1 : currentStatistics.collectiblesFound },
        recentActivity: [activity, ...state.recentActivity.slice(0, 9)],
        // Update skills and skill chart
        playerSkills: updatedSkills,
        skillChart: updatedSkillChart
      };
    }
    case 'ADD_QUEST':
      return { quests: [...state.quests, action.payload] };
    case 'EDIT_QUEST':
      return { quests: state.quests.map(q => q.id === action.payload.id ? { ...action.payload } : q) };
    case 'SET_MAIN_QUEST':
      return { mainQuest: { ...action.payload, isActive: true } };
    case 'SET_ACTIVE_QUEST':
      return { activeQuestId: action.payload };
    default:
      return {};
  }
}
