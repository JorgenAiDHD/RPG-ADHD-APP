import AICompanion from '../components/AICompanion';
// Główna strona aplikacji, łącząca wszystkie komponenty.
import { motion } from 'framer-motion';
import AchievementsDialog from '../components/AchievementsDialog';
import SkillTreeDialog from '../components/SkillTreeDialog';
import HealthActions from '../components/HealthActions';
import ActivityLog from '../components/ActivityLog';
import EditableMainQuest from '../components/EditableMainQuest';
import QuestList from '../components/QuestList';
import { PlayerStats } from '../components/PlayerStats';
import NewQuestDialog from '../components/NewQuestDialog';
import FocusTimer from '../components/FocusTimer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:via-zinc-950 dark:to-black font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-wide drop-shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent px-1">
            My Life: RPG Quest Log
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-normal mb-6 sm:mb-8">
            Transform your productivity into an epic adventure
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <AchievementsDialog />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SkillTreeDialog />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Layout - Enhanced Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8 xl:gap-10">
          {/* Left Column - Player Stats and Health Actions */}
          <div className="space-y-6 md:space-y-8">
            <PlayerStats />
            <HealthActions />
          </div>
          {/* Middle Column - Main Quest, Focus Timer and Activity Log */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center justify-between bg-gradient-to-br from-purple-900/30 to-zinc-900 p-3 md:p-4 rounded-xl border border-purple-800/50 shadow-lg">
              <div className="flex-grow">
                <EditableMainQuest />
              </div>
              <div className="ml-2 md:ml-3">
                <NewQuestDialog />
              </div>
            </div>
            <FocusTimer />
            <ActivityLog />
          </div>
          {/* Right Column - Quest List */}
          <div className="md:col-span-2 lg:col-span-1">
            <QuestList />
          </div>
        </div>


        {/* AI Companion */}
        <div className="mt-10 flex justify-center">
          <AICompanion />
        </div>

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
    </div>
  );
};

export default Index;
