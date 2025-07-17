import { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plus, Zap, AlertCircle, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import type { HealthActivityType } from '../types/game';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import './HealthActions.css';

const HealthActions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'positive' | 'negative'>('positive');
  const sliderRef = useRef<HTMLDivElement>(null);
  const { state, actions } = useGame();
  const healthActivities = state.healthActionTypes;
  const healthValue = state.healthBar.current;
  const energyValue = state.healthBar.current; // Using healthBar as energy for now
  
  // Filter activities based on active tab
  const positiveActivities = healthActivities.filter(activity => activity.healthChangeAmount > 0);
  const negativeActivities = healthActivities.filter(activity => activity.healthChangeAmount < 0);
  
  // Enhanced scroll handlers for slider
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      // Dynamically calculate scroll amount based on viewport width
      const cardWidth = window.innerWidth < 640 ? 240 : window.innerWidth < 768 ? 260 : 280;
      const gap = window.innerWidth < 640 ? 12 : window.innerWidth < 768 ? 16 : 20;
      const scrollAmount = cardWidth + gap; // Card width + gap
      
      const scrollLeft = sliderRef.current.scrollLeft;
      const newPosition = direction === 'left' ? Math.max(0, scrollLeft - scrollAmount) : scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleHealthAction = (activityType: HealthActivityType) => {
    // Update Health
    actions.updateHealth(activityType.healthChangeAmount, {
      id: activityType.id,
      name: activityType.name,
      healthChange: activityType.healthChangeAmount,
      category: activityType.category,
      duration: activityType.duration,
      description: activityType.description,
      icon: activityType.icon
    });

    // Update Energy System
    const currentEnergy = state.energySystem.current;
    const newEnergy = Math.max(0, Math.min(100, currentEnergy + activityType.energyChangeAmount));
    
    actions.updateEnergySystem({
      ...state.energySystem,
      current: newEnergy,
      lastUpdated: new Date()
    });
    
    // Add XP if the activity provides it
    if (activityType.xpChangeAmount) {
      actions.addXP({ amount: activityType.xpChangeAmount, reason: `Health Activity: ${activityType.name}` });
    }

    // Show enhanced toast with both health and energy changes
    const healthText = activityType.healthChangeAmount > 0 ? `+${activityType.healthChangeAmount} Health` : `${activityType.healthChangeAmount} Health`;
    const energyText = activityType.energyChangeAmount > 0 ? `+${activityType.energyChangeAmount} Energy` : `${activityType.energyChangeAmount} Energy`;
    
    toast.success(`${activityType.name} completed!`, {
      description: `${healthText}, ${energyText}${activityType.xpChangeAmount ? `, +${activityType.xpChangeAmount} XP` : ''}`,
      duration: 3000
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-cyan-900/60 dark:to-blue-900/80 border border-gray-200 dark:border-blue-800 text-gray-900 dark:text-white shadow-xl dark:shadow-blue-900/30 rounded-3xl">
        {/* Animated background effects - subtle in light mode */}
        <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-500/5 animate-pulse-slow"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDgxQ0IiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0xOGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0wIDM2YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-cyan-800/40 relative z-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="p-2.5 bg-gradient-to-br from-cyan-100 to-blue-200 dark:from-cyan-500/80 dark:to-blue-700/80 rounded-full shadow-md border border-cyan-200 dark:border-cyan-400/30">
              <Heart size={26} className="text-cyan-600 dark:text-cyan-100" fill="rgba(8, 145, 178, 0.2)" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-cyan-800 dark:bg-gradient-to-r dark:from-cyan-300 dark:to-blue-200 dark:bg-clip-text dark:text-transparent drop-shadow-sm">
              Health Actions
            </h2>
          </div>
          
          <Button 
            onClick={() => setShowDialog(true)} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-full text-sm px-5 py-2.5 flex items-center gap-2 shadow-md border border-cyan-500/50 transition-all hover:shadow-cyan-500/20"
          >
            <Plus size={18} /> Manage Actions
          </Button>
        </div>
        
        {/* Stats Overview - Enhanced Responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 relative z-10">
          <Card className="p-3 sm:p-4 bg-white dark:bg-gradient-to-br dark:from-emerald-900/30 dark:to-cyan-900/30 border border-emerald-100 dark:border-emerald-800/40 text-gray-800 dark:text-white shadow-md dark:shadow-lg rounded-2xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-600/60 dark:to-emerald-800/60 rounded-lg shadow-inner border border-emerald-200 dark:border-emerald-500/30">
                <Heart size={24} className="text-emerald-600 dark:text-emerald-200" />
              </div>
              <div className="flex-grow">
                <p className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-200/80 mb-1">Health</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full" style={{ width: `${healthValue}%` }}></div>
                </div>
                <p className="text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-100 mt-1">{healthValue}/100</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 sm:p-4 bg-white dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800/40 text-gray-800 dark:text-white shadow-md dark:shadow-lg rounded-2xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-600/60 dark:to-blue-800/60 rounded-lg shadow-inner border border-blue-200 dark:border-blue-500/30">
                <Zap size={24} className="text-blue-600 dark:text-blue-200" />
              </div>
              <div className="flex-grow">
                <p className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-200/80 mb-1">Energy</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-full rounded-full" style={{ width: `${energyValue}%` }}></div>
                </div>
                <p className="text-base sm:text-lg font-bold text-blue-800 dark:text-blue-100 mt-1">{energyValue}/100</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tab Navigation - Enhanced Responsive */}
        <div className="flex gap-2 mb-4 relative z-10">
          <Button 
            onClick={() => setActiveTab('positive')} 
            className={cn(
              "flex-1 gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all focus:ring-4 focus:outline-none",
              activeTab === 'positive' 
                ? "bg-emerald-600 text-white border border-emerald-500/50 shadow-md focus:ring-emerald-500/30" 
                : "bg-white/80 dark:bg-white/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-700/30 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:ring-emerald-200/50 dark:focus:ring-emerald-800/30"
            )}
          >
            <Heart size={14} className="flex-shrink-0" /> 
            <span className="inline-block">Health Actions</span>
          </Button>
          <Button 
            onClick={() => setActiveTab('negative')} 
            className={cn(
              "flex-1 gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all focus:ring-4 focus:outline-none",
              activeTab === 'negative' 
                ? "bg-blue-600 text-white border border-blue-500/50 shadow-md focus:ring-blue-500/30" 
                : "bg-white/80 dark:bg-white/10 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:ring-blue-200/50 dark:focus:ring-blue-800/30"
            )}
          >
            <Zap size={14} className="flex-shrink-0" />
            <span className="inline-block">Energy Actions</span>
          </Button>
        </div>
        
        {/* Actions Horizontal Slider */}
        <div className="relative mt-6 z-10">
          {/* Enhanced Responsive Slider Controls */}
          <div className="flex justify-end absolute -top-12 right-0 gap-2 z-20">
            <Button 
              onClick={() => scroll('left')} 
              size="sm" 
              variant="outline" 
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md focus:ring-4 focus:outline-none focus:ring-blue-300/30 dark:focus:ring-blue-800/40 transition-all touch-manipulation"
              aria-label="Scroll left"
            >
              <ArrowLeft size={16} className="sm:hidden" />
              <ArrowLeft size={18} className="hidden sm:block" />
            </Button>
            <Button 
              onClick={() => scroll('right')} 
              size="sm" 
              variant="outline" 
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md focus:ring-4 focus:outline-none focus:ring-blue-300/30 dark:focus:ring-blue-800/40 transition-all touch-manipulation"
              aria-label="Scroll right"
            >
              <ArrowRight size={16} className="sm:hidden" />
              <ArrowRight size={18} className="hidden sm:block" />
            </Button>
          </div>
          
          <AnimatePresence mode="wait">
            {(activeTab === 'positive' ? positiveActivities : negativeActivities).length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6 text-gray-500 dark:text-cyan-100/70 rounded-xl border border-dashed border-gray-300 dark:border-cyan-800/50"
              >
                <AlertCircle className="mx-auto mb-3 opacity-60" size={32} />
                <p className="text-base">No {activeTab === 'positive' ? 'health' : 'energy'} activities available.</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div 
            ref={sliderRef}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '1px' }}
          >
            {(activeTab === 'positive' ? positiveActivities : negativeActivities).map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                className="w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-center"
              >
              <Card 
                className={`w-full min-h-[180px] flex flex-col p-4 bg-white dark:bg-gradient-to-br ${
                  activity.healthChangeAmount > 0 
                    ? 'border-emerald-200 hover:border-emerald-400 dark:from-emerald-900/40 dark:to-emerald-800/20 dark:border-emerald-700/40 dark:hover:border-emerald-600/60' 
                    : 'border-blue-200 hover:border-blue-400 dark:from-blue-900/40 dark:to-blue-800/20 dark:border-blue-700/40 dark:hover:border-blue-600/60'
                } border text-gray-800 dark:text-white rounded-2xl transition-all shadow-sm hover:shadow-md`}
              >
                <div className="flex flex-col items-center justify-between h-full py-2">
                  {/* Icon at top with proper sizing and clear separation */}
                  <div className={`text-4xl ${
                    activity.healthChangeAmount > 0 
                      ? 'text-emerald-500 dark:text-emerald-400' 
                      : 'text-blue-500 dark:text-blue-400'
                  } mb-2 flex-shrink-0`}>
                    {activity.icon || (activity.healthChangeAmount > 0 ? "🍃" : "⚡")}
                  </div>
                  
                  {/* Activity Name - Improved readability and spacing */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white text-center line-clamp-2 mb-3 px-2">
                    {activity.name}
                  </h3>
                  
                  {/* Activity Effects - Better grouping and alignment */}
                  <div className="mt-auto flex flex-col items-center text-sm font-medium whitespace-nowrap gap-1">
                    {/* Health Badge */}
                    <Badge className={`${
                      activity.healthChangeAmount > 0
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 dark:border-emerald-800/40'
                        : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/60 dark:text-red-100 dark:border-red-800/40'
                    } flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full whitespace-nowrap`}>
                      <Heart size={12} className={activity.healthChangeAmount > 0 ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"} />
                      {activity.healthChangeAmount > 0 ? '+' : ''}{activity.healthChangeAmount} Health
                    </Badge>
                    
                    {/* Energy Badge */}
                    <Badge className={`${
                      activity.energyChangeAmount > 0
                        ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/60 dark:text-blue-100 dark:border-blue-800/40'
                        : 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/60 dark:text-orange-100 dark:border-orange-800/40'
                    } flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full whitespace-nowrap`}>
                      <Zap size={12} className={activity.energyChangeAmount > 0 ? "text-blue-600 dark:text-blue-300" : "text-orange-600 dark:text-orange-300"} />
                      {activity.energyChangeAmount > 0 ? '+' : ''}{activity.energyChangeAmount} Energy
                    </Badge>
                    
                    {activity.xpChangeAmount && activity.xpChangeAmount > 0 && (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/60 dark:text-yellow-100 dark:border-yellow-800/40 flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full whitespace-nowrap">
                        <Star size={12} className="text-yellow-600 dark:text-yellow-300" />
                        +{activity.xpChangeAmount} XP
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    onClick={() => handleHealthAction(activity)}
                    className={`w-full mt-3 flex items-center justify-center gap-2 ${
                      activity.healthChangeAmount > 0
                        ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 hover:shadow-emerald-500/20'
                        : 'bg-blue-600 hover:bg-blue-500 border-blue-500/50 hover:shadow-blue-500/20'
                    } text-white font-medium shadow-sm hover:shadow-md border py-1.5 px-3 text-sm rounded-xl transition-all`}
                  >
                    {activity.healthChangeAmount > 0 ? (
                      <>
                        <Heart size={16} /> Done
                      </>
                    ) : (
                      <>
                        <Zap size={16} /> Done
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        </div>

        {/* Manage Activities Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-md rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Manage Health Activities</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <Button className="w-full" onClick={() => {
                setShowDialog(false);
                document.getElementById('manage-health-btn')?.click();
              }}>
                Open Health Activities Manager
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </motion.div>
  );
};

export default HealthActions;
