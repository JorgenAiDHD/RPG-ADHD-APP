// Enhanced Tracking & Analytics Reducer v0.2
import type { GameState, JournalEntry, StreakChallenge } from '../types/game';
import { JournalSystem, StreakChallengeSystem } from '../utils/journalSystem';

export interface AnalyticsAction {
  type: 'ADD_JOURNAL_ENTRY' | 'INITIALIZE_JOURNALS' | 'ADD_STREAK_CHALLENGE' | 'UPDATE_STREAK_CHALLENGE';
  payload?: any;
}

export function analyticsReducer(state: GameState, action: AnalyticsAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_JOURNALS':
      return {
        ...state,
        journals: JournalSystem.getDefaultJournals(),
        streakChallenges: StreakChallengeSystem.getDefaultChallenges()
      };

    case 'ADD_JOURNAL_ENTRY': {
      const { journalId, entry } = action.payload as { journalId: string; entry: JournalEntry };
      const updatedJournals = JournalSystem.addEntryToJournal(
        state.journals || [],
        journalId,
        entry
      );
      
      return {
        ...state,
        journals: updatedJournals
      };
    }

    case 'ADD_STREAK_CHALLENGE': {
      const challenge = action.payload as StreakChallenge;
      return {
        ...state,
        streakChallenges: [...(state.streakChallenges || []), challenge]
      };
    }

    case 'UPDATE_STREAK_CHALLENGE': {
      const { challengeId, updates } = action.payload as { challengeId: string; updates: Partial<StreakChallenge> };
      const updatedChallenges = (state.streakChallenges || []).map(challenge =>
        challenge.id === challengeId ? { ...challenge, ...updates } : challenge
      );
      
      return {
        ...state,
        streakChallenges: updatedChallenges
      };
    }

    default:
      return state;
  }
}
