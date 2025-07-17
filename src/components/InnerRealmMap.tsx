// v0.3 Inner Realms Expansion - Inner Realm Map Component 🗺️
import React, { useState, useEffect } from 'react';
import { EmotionRealm, RealmEvent, MoodEnvironmentSync } from '../types/game';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { InnerRealmSystem } from '../utils/innerRealmSystem';
import { MoodEnvironmentEngine } from '../utils/moodEnvironmentEngine';
import { 
  Mountain, 
  Cloud, 
  Sparkles, 
  Leaf, 
  Sun, 
  Zap, 
  Crown,
  Lock,
  Info,
  PlayCircle,
  Timer
} from 'lucide-react';

interface InnerRealmMapProps {
  emotionRealms: EmotionRealm[];
  currentMoodSync: MoodEnvironmentSync | null;
  currentMood: number;
  streakDays: number;
  totalXP: number;
  completedQuests: number;
  unlockedAchievements: string[];
  onRealmSelect: (realmId: string) => void;
  onMoodUpdate: (mood: number, emotion: EmotionRealm['emotionType']) => void;
}

export const InnerRealmMap: React.FC<InnerRealmMapProps> = ({
  emotionRealms,
  currentMoodSync,
  currentMood,
  streakDays,
  totalXP,
  completedQuests,
  unlockedAchievements,
  onRealmSelect,
  onMoodUpdate
}) => {
  const [hoveredRealm, setHoveredRealm] = useState<string | null>(null);
  const [activeEvents, setActiveEvents] = useState<RealmEvent[]>([]);

  // Update active events when mood or time changes
  useEffect(() => {
    const currentTime = new Date();
    const timeOfDay = getTimeOfDay(currentTime);
    
    const newActiveEvents: RealmEvent[] = [];
    
    emotionRealms.forEach(realm => {
      if (realm.isUnlocked) {
        const triggeredEvents = InnerRealmSystem.checkRealmEvents(
          realm,
          currentMood,
          timeOfDay,
          streakDays
        );
        newActiveEvents.push(...triggeredEvents);
      }
    });
    
    setActiveEvents(newActiveEvents);
  }, [emotionRealms, currentMood, streakDays]);

  // Get realm icon based on emotion type
  const getRealmIcon = (emotionType: EmotionRealm['emotionType']): React.ReactNode => {
    const iconMap = {
      anxiety: <Cloud className="w-8 h-8" />,
      focus: <Mountain className="w-8 h-8" />,
      creativity: <Sparkles className="w-8 h-8" />,
      calm: <Leaf className="w-8 h-8" />,
      energy: <Sun className="w-8 h-8" />,
      motivation: <Zap className="w-8 h-8" />,
      confidence: <Crown className="w-8 h-8" />
    };
    return iconMap[emotionType];
  };

  // Get time of day for event checking
  const getTimeOfDay = (date: Date): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  // Handle realm selection and environment change
  const handleRealmSelect = async (realm: EmotionRealm) => {
    if (!realm.isUnlocked) return;
    
    onRealmSelect(realm.id);
    
    // Apply environment change
    await MoodEnvironmentEngine.applyMoodEnvironment(
      currentMood,
      realm.emotionType,
      emotionRealms,
      true
    );
  };

  // Handle quick mood update and realm sync
  const handleQuickMoodUpdate = (mood: number) => {
    const currentTime = getTimeOfDay(new Date());
    // Map time to context for emotion mapping
    const context = currentTime === 'afternoon' ? 'work' : 
                   currentTime === 'night' ? 'evening' : 
                   currentTime;
    const mappedEmotion = InnerRealmSystem.mapMoodToEmotion(mood, context as 'morning' | 'work' | 'evening');
    onMoodUpdate(mood, mappedEmotion);
  };

  // Check if realm is unlocked
  const checkRealmUnlock = (realm: EmotionRealm): { isUnlocked: boolean; missingRequirements: string[] } => {
    const missing: string[] = [];
    const conditions = realm.unlockConditions;
    
    if (conditions.streakDays && streakDays < conditions.streakDays) {
      missing.push(`${conditions.streakDays} day streak`);
    }
    if (conditions.completedQuests && completedQuests < conditions.completedQuests) {
      missing.push(`${conditions.completedQuests} completed quests`);
    }
    if (conditions.totalXP && totalXP < conditions.totalXP) {
      missing.push(`${conditions.totalXP} total XP`);
    }
    if (conditions.specificAchievements) {
      const missingAchievements = conditions.specificAchievements.filter(
        achievement => !unlockedAchievements.includes(achievement)
      );
      if (missingAchievements.length > 0) {
        missing.push(`Achievements: ${missingAchievements.join(', ')}`);
      }
    }
    
    return {
      isUnlocked: missing.length === 0,
      missingRequirements: missing
    };
  };

  // Get realm activity status
  const getRealmActivity = (realm: EmotionRealm): {
    hasActiveEvents: boolean;
    eventCount: number;
    intensityLevel: 'low' | 'medium' | 'high';
  } => {
    const realmEvents = activeEvents.filter(event => 
      realm.realmEvents.some(re => re.id === event.id)
    );
    
    let intensityLevel: 'low' | 'medium' | 'high' = 'low';
    if (realm.currentIntensity >= 70) intensityLevel = 'high';
    else if (realm.currentIntensity >= 40) intensityLevel = 'medium';
    
    return {
      hasActiveEvents: realmEvents.length > 0,
      eventCount: realmEvents.length,
      intensityLevel
    };
  };

  return (
    <div className="space-y-6">
      {/* Mood Selector */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            Inner Realm Navigator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Current Mood (affects realm environment)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(mood => (
                  <Button
                    key={mood}
                    variant={currentMood === mood ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickMoodUpdate(mood)}
                    className="flex-1"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                1=Low, 2=Anxious, 3=Neutral, 4=Good, 5=Excellent
              </div>
            </div>
            
            {currentMoodSync && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Current Emotion: <strong>{currentMoodSync.currentEmotion}</strong></span>
                <span>Active Realm: <strong>{currentMoodSync.activeRealm || 'None'}</strong></span>
                {currentMoodSync.transitionDuration > 0 && (
                  <Badge variant="outline">
                    <Timer className="w-3 h-3 mr-1" />
                    Transitioning...
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Realm Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emotionRealms.map(realm => {
          const unlockStatus = checkRealmUnlock(realm);
          const activity = getRealmActivity(realm);
          const isActive = currentMoodSync?.activeRealm === realm.id;
          
          return (
            <Card
              key={realm.id}
              className={`
                transition-all duration-300 cursor-pointer transform hover:scale-105
                ${isActive ? 'ring-2 ring-blue-500 shadow-lg' : ''}
                ${!unlockStatus.isUnlocked ? 'opacity-60 grayscale' : ''}
                ${hoveredRealm === realm.id ? 'shadow-xl' : ''}
              `}
              onMouseEnter={() => setHoveredRealm(realm.id)}
              onMouseLeave={() => setHoveredRealm(null)}
              onClick={() => unlockStatus.isUnlocked && handleRealmSelect(realm)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${unlockStatus.isUnlocked ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {unlockStatus.isUnlocked ? getRealmIcon(realm.emotionType) : <Lock className="w-8 h-8" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{realm.name}</CardTitle>
                      <p className="text-sm text-gray-600">{realm.displayName}</p>
                    </div>
                  </div>
                  
                  {/* Activity indicators */}
                  <div className="flex flex-col items-end gap-1">
                    {activity.hasActiveEvents && (
                      <Badge variant="destructive" className="text-xs">
                        {activity.eventCount} Events
                      </Badge>
                    )}
                    {isActive && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700">{realm.description}</p>
                
                {/* Realm Intensity */}
                {unlockStatus.isUnlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Realm Intensity</span>
                      <span>{realm.currentIntensity}%</span>
                    </div>
                    <Progress value={realm.currentIntensity} className="h-2" />
                    <div className="text-xs text-gray-600">
                      Activity Level: <span className="capitalize">{activity.intensityLevel}</span>
                    </div>
                  </div>
                )}
                
                {/* Unlock requirements */}
                {!unlockStatus.isUnlocked && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <Lock className="w-4 h-4" />
                      Locked
                    </div>
                    <div className="text-xs text-gray-600">
                      Requirements:
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {unlockStatus.missingRequirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                {unlockStatus.isUnlocked && (
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Info className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getRealmIcon(realm.emotionType)}
                            {realm.displayName}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-gray-700">{realm.description}</p>
                          
                          {/* Environment preview */}
                          <div className="space-y-2">
                            <h4 className="font-medium">Environment</h4>
                            <div className={`p-4 rounded-lg ${realm.environment.bgColor} ${realm.environment.textColor}`}>
                              <div className="flex items-center gap-2">
                                <span>Ambient Effect: {realm.environment.ambientEffect}</span>
                                <Badge className={realm.environment.accentColor}>
                                  Preview
                                </Badge>
                              </div>
                              {realm.environment.musicSuggestion && (
                                <p className="text-sm mt-2 opacity-80">
                                  🎵 {realm.environment.musicSuggestion}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Active events */}
                          {activity.hasActiveEvents && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Active Events</h4>
                              <div className="space-y-2">
                                {activeEvents
                                  .filter(event => realm.realmEvents.some(re => re.id === event.id))
                                  .map(event => (
                                    <div key={event.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                      <div className="font-medium text-yellow-800">{event.title}</div>
                                      <div className="text-sm text-yellow-700">{event.description}</div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          )}
                          
                          {/* Narrative fragments */}
                          {realm.narrativeFragments.some(frag => frag.isUnlocked) && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Discovered Stories</h4>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {realm.narrativeFragments
                                  .filter(frag => frag.isUnlocked)
                                  .map(fragment => (
                                    <div key={fragment.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                                      <div className="font-medium text-blue-800">{fragment.title}</div>
                                      <div className="text-sm text-blue-700 mt-1">{fragment.content}</div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      onClick={() => handleRealmSelect(realm)}
                      disabled={isActive}
                      className="flex-1"
                    >
                      <PlayCircle className="w-4 h-4 mr-1" />
                      {isActive ? 'Active' : 'Enter'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Active Events Summary */}
      {activeEvents.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Zap className="w-5 h-5" />
              Active Realm Events ({activeEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeEvents.map(event => (
                <div key={event.id} className="p-3 bg-white border border-yellow-200 rounded">
                  <div className="font-medium text-yellow-900">{event.title}</div>
                  <div className="text-sm text-yellow-700 mt-1">{event.description}</div>
                  {event.effects.xpMultiplier && (
                    <Badge variant="outline" className="mt-2">
                      {event.effects.xpMultiplier}x XP Boost
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InnerRealmMap;
