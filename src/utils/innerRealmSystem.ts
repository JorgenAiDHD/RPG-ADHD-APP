// v0.3 Inner Realms Expansion - Emotion Realm System 🌌
import { EmotionRealm, RealmEvent, NarrativeFragment, MoodEnvironmentSync } from '../types/game';

export class InnerRealmSystem {
  // Default emotion realms with their environments and unlock conditions
  private static defaultRealms: Omit<EmotionRealm, 'isUnlocked' | 'currentIntensity' | 'realmEvents' | 'narrativeFragments'>[] = [
    {
      id: 'shadowlands',
      name: 'Shadowlands',
      emotionType: 'anxiety',
      displayName: 'The Shadowlands of Anxiety',
      description: 'A realm where fears take form and courage is forged. Navigate the mists of worry to find inner strength.',
      environment: {
        bgColor: 'from-gray-900 via-purple-900 to-gray-800',
        textColor: 'text-purple-100',
        accentColor: 'border-purple-500',
        ambientEffect: 'fog',
        musicSuggestion: 'Calm ambient sounds to soothe anxiety'
      },
      unlockConditions: {
        totalXP: 0 // Always unlocked
      }
    },
    {
      id: 'clarity_peaks',
      name: 'Clarity Peaks',
      emotionType: 'focus',
      displayName: 'The Clarity Peaks',
      description: 'Crystal clear mountain peaks where thoughts become sharp and purposeful. The air here enhances concentration.',
      environment: {
        bgColor: 'from-blue-100 via-cyan-100 to-blue-200',
        textColor: 'text-blue-900',
        accentColor: 'border-blue-600',
        ambientEffect: 'clarity',
        musicSuggestion: 'Focus-enhancing brown noise or instrumental music'
      },
      unlockConditions: {
        streakDays: 3,
        completedQuests: 5
      }
    },
    {
      id: 'creative_cosmos',
      name: 'Creative Cosmos',
      emotionType: 'creativity',
      displayName: 'The Creative Cosmos',
      description: 'A swirling galaxy of ideas where imagination knows no bounds. Here, creativity flows like stardust.',
      environment: {
        bgColor: 'from-purple-600 via-pink-500 to-orange-400',
        textColor: 'text-white',
        accentColor: 'border-pink-400',
        ambientEffect: 'sparkles',
        musicSuggestion: 'Uplifting creative music or binaural beats'
      },
      unlockConditions: {
        streakDays: 7,
        totalXP: 500,
        specificAchievements: ['creative_burst_genius']
      }
    },
    {
      id: 'serenity_gardens',
      name: 'Serenity Gardens',
      emotionType: 'calm',
      displayName: 'The Serenity Gardens',
      description: 'Peaceful gardens where tranquility blooms. Each breath here brings deeper peace and restoration.',
      environment: {
        bgColor: 'from-green-100 via-teal-50 to-green-200',
        textColor: 'text-green-800',
        accentColor: 'border-green-500',
        ambientEffect: 'rain',
        musicSuggestion: 'Nature sounds or meditation music'
      },
      unlockConditions: {
        streakDays: 5,
        completedQuests: 10
      }
    },
    {
      id: 'vitality_fields',
      name: 'Vitality Fields',
      emotionType: 'energy',
      displayName: 'The Vitality Fields',
      description: 'Endless fields of golden energy where vitality flows freely. Feel your life force recharge here.',
      environment: {
        bgColor: 'from-yellow-200 via-orange-200 to-yellow-300',
        textColor: 'text-orange-900',
        accentColor: 'border-yellow-600',
        ambientEffect: 'sunshine',
        musicSuggestion: 'Energizing music or upbeat instrumentals'
      },
      unlockConditions: {
        streakDays: 10,
        totalXP: 1000
      }
    },
    {
      id: 'champions_arena',
      name: 'Champions Arena',
      emotionType: 'motivation',
      displayName: 'The Champions Arena',
      description: 'Where heroes are forged and challenges conquered. Feel the fire of determination burn bright.',
      environment: {
        bgColor: 'from-red-600 via-orange-500 to-yellow-500',
        textColor: 'text-white',
        accentColor: 'border-red-400',
        ambientEffect: 'storm',
        musicSuggestion: 'Epic motivational music or workout beats'
      },
      unlockConditions: {
        streakDays: 14,
        completedQuests: 25,
        totalXP: 1500
      }
    },
    {
      id: 'confidence_castle',
      name: 'Confidence Castle',
      emotionType: 'confidence',
      displayName: 'The Confidence Castle',
      description: 'A mighty fortress where self-doubt is banished and inner strength reigns supreme.',
      environment: {
        bgColor: 'from-indigo-600 via-purple-500 to-pink-500',
        textColor: 'text-white',
        accentColor: 'border-indigo-400',
        ambientEffect: 'aurora',
        musicSuggestion: 'Empowering music or confidence-building affirmations'
      },
      unlockConditions: {
        streakDays: 21,
        totalXP: 2500,
        specificAchievements: ['adhd_champion', 'unstoppable_momentum']
      }
    }
  ];

  // Get default realms with initial state
  static getDefaultRealms(): EmotionRealm[] {
    return this.defaultRealms.map(realm => ({
      ...realm,
      isUnlocked: this.checkUnlockConditions(realm.unlockConditions, {
        streakDays: 0,
        completedQuests: 0,
        totalXP: 0,
        unlockedAchievements: []
      }),
      currentIntensity: 50, // Default middle intensity
      realmEvents: this.getDefaultEventsForRealm(realm.id),
      narrativeFragments: this.getDefaultNarrativesForRealm(realm.id)
    }));
  }

  // Check if realm unlock conditions are met
  static checkUnlockConditions(
    conditions: EmotionRealm['unlockConditions'], 
    playerState: {
      streakDays: number;
      completedQuests: number;
      totalXP: number;
      unlockedAchievements: string[];
    }
  ): boolean {
    if (conditions.streakDays && playerState.streakDays < conditions.streakDays) return false;
    if (conditions.completedQuests && playerState.completedQuests < conditions.completedQuests) return false;
    if (conditions.totalXP && playerState.totalXP < conditions.totalXP) return false;
    if (conditions.specificAchievements) {
      const hasAllAchievements = conditions.specificAchievements.every(
        achievement => playerState.unlockedAchievements.includes(achievement)
      );
      if (!hasAllAchievements) return false;
    }
    return true;
  }

  // Generate mood-based environment sync
  static generateMoodEnvironmentSync(
    mood: number, // 1-5 scale
    currentEmotion: EmotionRealm['emotionType'],
    realms: EmotionRealm[]
  ): MoodEnvironmentSync {
    const targetRealm = realms.find(realm => realm.emotionType === currentEmotion);
    
    return {
      currentMood: mood,
      currentEmotion: currentEmotion,
      activeRealm: targetRealm?.id || null,
      transitionDuration: 2, // 2 second smooth transition
      lastMoodUpdate: new Date()
    };
  }

  // Map mood to dominant emotion
  static mapMoodToEmotion(mood: number, context?: 'morning' | 'work' | 'evening'): EmotionRealm['emotionType'] {
    if (mood <= 2) {
      return context === 'work' ? 'anxiety' : 'calm'; // Low mood: anxiety at work, seek calm otherwise
    } else if (mood <= 3) {
      return 'focus'; // Medium-low: need focus boost
    } else if (mood === 4) {
      return context === 'evening' ? 'calm' : 'energy'; // Good mood: calm in evening, energy otherwise
    } else {
      return context === 'work' ? 'creativity' : 'motivation'; // High mood: creativity at work, motivation otherwise
    }
  }

  // Default realm events
  private static getDefaultEventsForRealm(realmId: string): RealmEvent[] {
    const eventMap: Record<string, RealmEvent[]> = {
      shadowlands: [
        {
          id: 'anxiety_storm',
          title: 'Anxiety Storm Brewing',
          description: 'Dark clouds gather as anxiety intensifies. Time for grounding techniques.',
          triggerCondition: {
            moodRange: [1, 2],
            realmIntensity: [70, 100]
          },
          effects: {
            environmentChange: {
              ambientEffect: 'storm',
              bgColor: 'from-gray-900 via-red-900 to-gray-900'
            },
            narrativeUnlock: 'storm_survival_wisdom'
          },
          isActive: false
        },
        {
          id: 'courage_discovery',
          title: 'Courage Crystal Found',
          description: 'In the depths of worry, you discover an inner strength you didn\'t know existed.',
          triggerCondition: {
            moodRange: [1, 3],
            streakDay: 3
          },
          effects: {
            xpMultiplier: 1.5,
            buffDuration: 60,
            narrativeUnlock: 'courage_awakening'
          },
          isActive: false
        }
      ],
      clarity_peaks: [
        {
          id: 'perfect_focus',
          title: 'Perfect Focus Achieved',
          description: 'The mountain air clears your mind completely. Everything becomes crystal clear.',
          triggerCondition: {
            moodRange: [4, 5],
            timeOfDay: 'morning'
          },
          effects: {
            xpMultiplier: 2.0,
            buffDuration: 120,
            environmentChange: {
              ambientEffect: 'clarity',
              bgColor: 'from-blue-50 via-cyan-50 to-white'
            }
          },
          isActive: false
        }
      ],
      creative_cosmos: [
        {
          id: 'idea_supernova',
          title: 'Idea Supernova',
          description: 'Your creativity explodes like a supernova, generating countless brilliant ideas.',
          triggerCondition: {
            moodRange: [4, 5],
            realmIntensity: [80, 100]
          },
          effects: {
            xpMultiplier: 2.5,
            buffDuration: 90,
            environmentChange: {
              ambientEffect: 'sparkles'
            },
            narrativeUnlock: 'cosmic_inspiration'
          },
          isActive: false
        }
      ]
    };

    return eventMap[realmId] || [];
  }

  // Default narrative fragments
  private static getDefaultNarrativesForRealm(realmId: string): NarrativeFragment[] {
    const narrativeMap: Record<string, NarrativeFragment[]> = {
      shadowlands: [
        {
          id: 'first_shadow_encounter',
          title: 'First Steps into Shadow',
          content: 'You take your first tentative steps into the Shadowlands. The mist swirls around you, but you notice it responds to your breathing. When you breathe deeply, the shadows seem less threatening.',
          unlockCondition: {
            moodTrend: 'stable',
            realmVisits: 1
          },
          isUnlocked: false,
          category: 'discovery'
        },
        {
          id: 'shadow_wisdom',
          title: 'Wisdom from the Shadows',
          content: 'After many visits, you realize the shadows were never your enemy. They were teaching you to find light within yourself. Anxiety becomes a teacher, not a tormentor.',
          unlockCondition: {
            moodTrend: 'improving',
            realmVisits: 10,
            consecutiveDays: 7
          },
          isUnlocked: false,
          category: 'wisdom'
        }
      ],
      clarity_peaks: [
        {
          id: 'mountain_ascent',
          title: 'The Ascent Begins',
          content: 'Each step up the Clarity Peaks makes your thoughts sharper, your purpose clearer. The view from here shows you exactly what needs to be done.',
          unlockCondition: {
            moodTrend: 'improving',
            realmVisits: 3
          },
          isUnlocked: false,
          category: 'discovery'
        }
      ],
      creative_cosmos: [
        {
          id: 'cosmic_awakening',
          title: 'Cosmic Creative Awakening',
          content: 'You float through the Creative Cosmos, ideas swirling around you like galaxies. Each thought spawns new universes of possibility.',
          unlockCondition: {
            moodTrend: 'stable',
            realmVisits: 5,
            journalEntries: 10
          },
          isUnlocked: false,
          category: 'discovery'
        }
      ]
    };

    return narrativeMap[realmId] || [];
  }

  // Update realm intensity based on activity
  static updateRealmIntensity(
    realm: EmotionRealm,
    activity: 'visit' | 'quest_complete' | 'meditation' | 'journal_entry' | 'focus_session',
    duration?: number // in minutes
  ): number {
    let intensityChange = 0;
    
    switch (activity) {
      case 'visit':
        intensityChange = 5;
        break;
      case 'quest_complete':
        intensityChange = 10;
        break;
      case 'meditation':
        intensityChange = duration ? Math.min(duration * 2, 20) : 15;
        break;
      case 'journal_entry':
        intensityChange = 8;
        break;
      case 'focus_session':
        intensityChange = duration ? Math.min(duration * 1.5, 25) : 20;
        break;
    }

    // Apply multiplier based on realm type
    if (realm.emotionType === 'calm' && activity === 'meditation') {
      intensityChange *= 1.5;
    } else if (realm.emotionType === 'focus' && activity === 'focus_session') {
      intensityChange *= 1.5;
    } else if (realm.emotionType === 'creativity' && activity === 'journal_entry') {
      intensityChange *= 1.5;
    }

    return Math.min(100, Math.max(0, realm.currentIntensity + intensityChange));
  }

  // Check and trigger realm events
  static checkRealmEvents(
    realm: EmotionRealm,
    currentMood: number,
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night',
    streakDay: number
  ): RealmEvent[] {
    const triggeredEvents: RealmEvent[] = [];

    for (const event of realm.realmEvents) {
      if (event.isActive) continue; // Skip already active events

      const condition = event.triggerCondition;
      let shouldTrigger = true;

      // Check mood range
      if (!this.isInRange(currentMood, condition.moodRange)) {
        shouldTrigger = false;
      }

      // Check time of day
      if (condition.timeOfDay && condition.timeOfDay !== timeOfDay) {
        shouldTrigger = false;
      }

      // Check streak day
      if (condition.streakDay && streakDay < condition.streakDay) {
        shouldTrigger = false;
      }

      // Check realm intensity
      if (condition.realmIntensity && !this.isInRange(realm.currentIntensity, condition.realmIntensity)) {
        shouldTrigger = false;
      }

      if (shouldTrigger) {
        triggeredEvents.push(event);
      }
    }

    return triggeredEvents;
  }

  private static isInRange(value: number, range: [number, number]): boolean {
    return value >= range[0] && value <= range[1];
  }

  // Get theme configuration for current realm
  static getThemeForRealm(realm: EmotionRealm | null): Record<string, string> {
    if (!realm) {
      return {
        '--bg-gradient': 'from-gray-50 to-gray-100',
        '--text-primary': 'text-gray-900',
        '--accent-color': 'border-blue-500'
      };
    }

    return {
      '--bg-gradient': realm.environment.bgColor,
      '--text-primary': realm.environment.textColor,
      '--accent-color': realm.environment.accentColor
    };
  }
}

export default InnerRealmSystem;
