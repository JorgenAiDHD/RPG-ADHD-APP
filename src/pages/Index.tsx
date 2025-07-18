import AICompanion from '../components/AICompanion';
import AIChatbotDialog from '../components/AIChatbotDialog';
// Główna strona aplikacji, łącząca wszystkie komponenty.
import { motion } from 'framer-motion';
import AchievementsDialog from '../components/AchievementsDialog';
import SkillTreeDialog from '../components/SkillTreeDialog';
import { CharacterClassDialog } from '../components/CharacterClassDialog';
import { SuperChallengesDialog } from '../components/SuperChallengesDialog';
import { ChallengeTimer } from '../components/ChallengeTimer';
import { QuickChallengeGenerator } from '../components/QuickChallengeGenerator';
import { MultiJournalDialog } from '../components/MultiJournalDialog';
import { StreakChallengesDialog } from '../components/StreakChallengesDialog';
// UX/UI Enhancements v0.2 imports
import { EnhancedMotivationalQuoteCard, MotivationalBanner } from '../components/EnhancedMotivationalQuoteCard';
import BrainTrainingQuizComponent from '../components/BrainTrainingQuizComponent';
import AudioWellnessDialog from '../components/AudioWellnessDialog';
// v0.3 Inner Realms Expansion imports 🌌
import InnerRealmMap from '../components/InnerRealmMap';
import HealthActions from '../components/HealthActions';
import EnergyMoodTracker from '../components/EnergyMoodTracker';
import ActivityLog from '../components/ActivityLog';
import EditableMainQuest from '../components/EditableMainQuest';
import QuestList from '../components/QuestList';
import { PlayerStats } from '../components/PlayerStats';
import FocusTimer from '../components/FocusTimer';
import RepeatableActionsPanel from '../components/RepeatableActionsPanel';
import UndoPanel from '../components/UndoPanel';
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Brain, Music, Map, Palette } from 'lucide-react';
import { useGame } from '../context/GameContext';
import ColorPaletteSelector from '../components/ColorPaletteSelector';

const Index = () => {
  const [showBrainTraining, setShowBrainTraining] = useState(false);
  const [showAudioWellness, setShowAudioWellness] = useState(false);
  const [showInnerRealms, setShowInnerRealms] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  
  // v0.3 Inner Realms Expansion - Access game state
  const { state, actions } = useGame();

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-neutral-900 dark:via-blue-950 dark:to-purple-950 font-sans text-neutral-900 dark:text-neutral-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
        {/* ADHD-Friendly Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          {/* Hero Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg"
          >
            <span className="animate-pulse">🎮</span>
            Level {state.player.level} Hero
            <span className="animate-bounce">⚡</span>
          </motion.div>

          {/* Dynamic Greeting Based on Streak */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4 tracking-tight"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="block text-gradient-primary mb-2">
              {state.player.currentStreak > 0 
                ? `🔥 ${state.player.currentStreak} Day Streak!` 
                : "🌟 Ready for Adventure?"
              }
            </span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {state.player.name}'s Quest Log
            </span>
          </motion.h1>

          {/* Dynamic Motivational Message */}
          <motion.p 
            className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 font-medium mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {state.player.currentStreak === 0 && (
              <span className="text-primary-600 font-semibold">🎯 Start your journey today!</span>
            )}
            {state.player.currentStreak > 0 && state.player.currentStreak < 7 && (
              <span className="text-success-600 font-semibold">🚀 Momentum building! Keep going!</span>
            )}
            {state.player.currentStreak >= 7 && (
              <span className="text-warning-600 font-semibold">🏆 You're on fire! Incredible consistency!</span>
            )}
            <span className="block mt-2 text-base opacity-80">
              Transform everyday tasks into epic adventures
            </span>
          </motion.p>

          {/* Progress Indicators - ADHD Dopamine Boost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8"
          >
            {/* XP Progress */}
            <div className="attention-focus p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <p className="font-semibold text-focus-dark">XP Progress</p>
                  <p className="text-sm opacity-80">{state.player.xp} / {state.player.xpToNextLevel}</p>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(state.player.xp / state.player.xpToNextLevel) * 100}%` }}
                  transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Current Streak */}
            <div className="attention-energy p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="font-semibold text-energy-dark">Streak Power</p>
                  <p className="text-sm opacity-80">{state.player.currentStreak} days strong</p>
                </div>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(7, state.player.currentStreak + 1) }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-4 h-4 rounded-full ${i < state.player.currentStreak ? 'bg-orange-500' : 'bg-orange-200'}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Available Quests */}
            <div className="attention-creative p-4 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-creative-dark">Active Quests</p>
                  <p className="text-sm opacity-80">{state.quests.filter(q => q.status === 'active').length} waiting</p>
                </div>
              </div>
              <div className="text-right">
                <motion.span 
                  className="text-2xl font-bold text-purple-600"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                >
                  {state.quests.filter(q => q.status === 'active').length}
                </motion.span>
              </div>
            </div>
          </motion.div>
          
          {/* Enhanced Motivational Quote Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <MotivationalBanner context="daily_greeting" compact={true} />
          </motion.div>
          
          {/* Action Buttons - More Prominent */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <CharacterClassDialog />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <SuperChallengesDialog />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <AchievementsDialog />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <SkillTreeDialog />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowColorPalette(true)}
                className="btn-primary-adhd flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Color Themes
              </Button>
            </motion.div>
          </motion.div>
          
          {/* UX/UI Enhancement Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              onClick={() => setShowBrainTraining(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <Brain className="w-4 h-4" />
              Brain Training
            </Button>
            <Button
              onClick={() => setShowAudioWellness(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
            >
              <Music className="w-4 h-4" />
              Audio Wellness
            </Button>
            {/* v0.3 Inner Realms Button */}
            <Button
              onClick={() => setShowInnerRealms(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              <Map className="w-4 h-4" />
              Inner Realms
            </Button>
          </div>
        </motion.div>

        {/* Main Layout - Enhanced Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8 xl:gap-10">
          {/* Left Column - Player Stats and Energy/Mood Tracker */}
          <div className="space-y-6 md:space-y-8">
            <PlayerStats />
            <EnergyMoodTracker />
            <HealthActions />
          </div>
          {/* Middle Column - Main Quest, Focus Timer, Quick Challenge Generator, Repeatable Actions and Activity Log */}
          <div className="space-y-6 md:space-y-8">
            <EditableMainQuest />
            <FocusTimer />
            <QuickChallengeGenerator />
            <MultiJournalDialog 
              trigger={
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <div>
                      <h3 className="font-semibold">Multi-Journal System</h3>
                      <p className="text-sm opacity-90">Track gratitude, savings, ideas & more</p>
                    </div>
                  </div>
                </motion.div>
              }
            />
            <StreakChallengesDialog 
              trigger={
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-4 rounded-xl shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <h3 className="font-semibold">Streak Challenges</h3>
                      <p className="text-sm opacity-90">No sugar, no alcohol, exercise daily</p>
                    </div>
                  </div>
                </motion.div>
              }
            />
            <EnhancedMotivationalQuoteCard 
              context="quest_completion" 
              className="mb-6"
              autoSlide={true}
              slideInterval={15}
            />
            <RepeatableActionsPanel />
            <ActivityLog />
          </div>
          {/* Right Column - Quest List */}
          <div className="md:col-span-2 lg:col-span-1">
            <QuestList />
          </div>
        </div>

        {/* Motivational Section Between Main Content and Footer */}
        <MotivationalBanner context="random" />

        {/* AI Companion */}
        <div className="mt-10 flex justify-center">
          <AICompanion />
        </div>

        {/* Floating Undo Panel */}
        <UndoPanel />

        {/* Floating Challenge Timer */}
        <ChallengeTimer />

        {/* UX/UI Enhancement Dialogs */}
        {showBrainTraining && (
          <BrainTrainingQuizComponent
            onClose={() => setShowBrainTraining(false)}
            onComplete={(score) => {
              console.log('Brain training completed with score:', score);
              setShowBrainTraining(false);
            }}
          />
        )}

        <AudioWellnessDialog
          open={showAudioWellness}
          onOpenChange={setShowAudioWellness}
        />

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16 pb-8"
        >
          <div className="h-px w-32 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-indigo-500/50 mx-auto mb-6"></div>
          <p className="text-sm text-gray-400">
            Your journey to productivity mastery begins now. Every quest completed makes you stronger.
          </p>
        </motion.div>
      </div>
      
      {/* Floating Components & Dialogs */}
      <ChallengeTimer />
      <AICompanion />
      
      {/* UX/UI Enhancement Dialogs */}
      {showBrainTraining && (
        <BrainTrainingQuizComponent onClose={() => setShowBrainTraining(false)} />
      )}
      
      {showAudioWellness && (
        <AudioWellnessDialog
          open={showAudioWellness}
          onOpenChange={setShowAudioWellness}
        />
      )}
      
      {/* v0.3 Inner Realms Dialog */}
      {showInnerRealms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Map className="w-6 h-6" />
                  Inner Realms Map
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setShowInnerRealms(false)}
                  className="rounded-full"
                >
                  ✕
                </Button>
              </div>
              
              <InnerRealmMap
                emotionRealms={state.emotionRealms}
                currentMoodSync={state.currentRealmState}
                currentMood={state.currentRealmState?.currentMood || 3}
                streakDays={state.player.currentStreak}
                totalXP={state.player.xp}
                completedQuests={state.statistics.totalQuestsCompleted}
                unlockedAchievements={state.unlockedAchievements}
                onRealmSelect={actions.selectRealm}
                onMoodUpdate={actions.updateMoodEnvironment}
              />
            </div>
          </div>
        </div>
      )}

      {/* Color Palette Selector Dialog */}
      <ColorPaletteSelector 
        open={showColorPalette} 
        onOpenChange={setShowColorPalette} 
      />
      
      {/* AI Companion Dialog (tylko jedno okno na stronie głównej) */}
      <AIChatbotDialog />
    </div>
  );
};

export default Index;
