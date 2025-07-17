import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Plus, Zap, AlertCircle, Star, ArrowLeft, ArrowRight, 
  Activity, Brain, Moon, Utensils, Gamepad2, Book, 
  Target, Timer, TrendingUp, Settings, RefreshCw,
  Sparkles, Shield, Flame, Battery
} from 'lucide-react';
import type { HealthActivityType } from '../types/game';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import './HealthActions.css';

// Enhanced category system with better icons and colors
const CATEGORY_CONFIG = {
  physical: { 
    icon: Activity, 
    color: 'emerald', 
    name: 'Physical',
    description: 'Movement & Exercise'
  },
  mental: { 
    icon: Brain, 
    color: 'purple', 
    name: 'Mental',
    description: 'Cognitive & Focus'
  },
  energy: { 
    icon: Zap, 
    color: 'yellow', 
    name: 'Energy',
    description: 'Vitality & Alertness'
  },
  rest: { 
    icon: Moon, 
    color: 'indigo', 
    name: 'Rest',
    description: 'Recovery & Sleep'
  },
  nutrition: { 
    icon: Utensils, 
    color: 'orange', 
    name: 'Nutrition',
    description: 'Food & Hydration'
  },
  social: { 
    icon: Heart, 
    color: 'pink', 
    name: 'Social',
    description: 'Connection & Support'
  },
  creative: { 
    icon: Sparkles, 
    color: 'cyan', 
    name: 'Creative',
    description: 'Art & Expression'
  },
  mindfulness: { 
    icon: Shield, 
    color: 'teal', 
    name: 'Mindfulness',
    description: 'Meditation & Awareness'
  }
};

const HealthActions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'impact' | 'recent' | 'category'>('impact');
  const sliderRef = useRef<HTMLDivElement>(null);
  const { state, actions } = useGame();
  
  const healthActivities = state.healthActionTypes;
  const healthValue = state.healthBar.current;
  const energyValue = state.energySystem.current;
  const maxHealth = state.healthBar.maximum;
  const maxEnergy = state.energySystem.maximum;
  
  // Enhanced filtering and sorting
  const filteredActivities = healthActivities
    .filter(activity => activeCategory === 'all' || activity.category === activeCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'impact':
          return Math.abs(b.healthChangeAmount + b.energyChangeAmount) - Math.abs(a.healthChangeAmount + a.energyChangeAmount);
        case 'recent':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  // Get unique categories from activities
  const availableCategories = Array.from(new Set(healthActivities.map(a => a.category)));

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const cardWidth = viewMode === 'grid' ? 280 : 400;
      const gap = 16;
      const scrollAmount = cardWidth + gap;
      
      const scrollLeft = sliderRef.current.scrollLeft;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollLeft - scrollAmount) 
        : scrollLeft + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleHealthAction = (activityType: HealthActivityType) => {
    // Calculate impact with enhanced feedback
    const healthImpact = Math.min(maxHealth - healthValue, Math.max(0, activityType.healthChangeAmount));
    const energyImpact = Math.min(maxEnergy - energyValue, Math.max(0, activityType.energyChangeAmount));
    
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
    const newEnergy = Math.max(0, Math.min(maxEnergy, energyValue + activityType.energyChangeAmount));
    
    actions.updateEnergySystem({
      ...state.energySystem,
      current: newEnergy,
      lastUpdated: new Date()
    });
    
    // Add XP with category bonus
    if (activityType.xpChangeAmount) {
      const categoryBonus = getCategoryBonus(activityType.category);
      const totalXP = activityType.xpChangeAmount + categoryBonus;
      actions.addXP({ 
        amount: totalXP, 
        reason: `${activityType.name}${categoryBonus > 0 ? ` (Category Bonus: +${categoryBonus})` : ''}` 
      });
    }

    // Enhanced toast with visual feedback
    const categoryConfig = CATEGORY_CONFIG[activityType.category as keyof typeof CATEGORY_CONFIG];
    const IconComponent = categoryConfig?.icon || Activity;
    
    toast.success(`${activityType.name} completed!`, {
      description: generateToastDescription(activityType, healthImpact, energyImpact),
      duration: 4000,
      icon: React.createElement(IconComponent, { size: 20 })
    });

    // Add visual feedback animation
    triggerSuccessAnimation(activityType.id);
  };

  const getCategoryBonus = (category: string): number => {
    // Bonus XP for completing activities in different categories
    const bonusMap: Record<string, number> = {
      physical: 5,
      mental: 8,
      creative: 10,
      mindfulness: 7,
      social: 6
    };
    return bonusMap[category] || 0;
  };

  const generateToastDescription = (
    activity: HealthActivityType, 
    healthImpact: number, 
    energyImpact: number
  ): string => {
    const parts = [];
    
    if (healthImpact !== 0) {
      parts.push(`${healthImpact > 0 ? '+' : ''}${healthImpact} Health`);
    }
    if (energyImpact !== 0) {
      parts.push(`${energyImpact > 0 ? '+' : ''}${energyImpact} Energy`);
    }
    if (activity.xpChangeAmount) {
      const bonus = getCategoryBonus(activity.category);
      parts.push(`+${activity.xpChangeAmount + bonus} XP`);
    }
    
    return parts.join(', ');
  };

  const triggerSuccessAnimation = (activityId: string) => {
    // Add success animation class to the activity card
    const element = document.querySelector(`[data-activity-id="${activityId}"]`);
    if (element) {
      element.classList.add('success-pulse');
      setTimeout(() => element.classList.remove('success-pulse'), 1000);
    }
  };

  const getHealthStatus = () => {
    if (healthValue >= 80) return { status: 'excellent', color: 'emerald', icon: Star };
    if (healthValue >= 60) return { status: 'good', color: 'green', icon: TrendingUp };
    if (healthValue >= 40) return { status: 'fair', color: 'yellow', icon: Target };
    if (healthValue >= 20) return { status: 'poor', color: 'orange', icon: AlertCircle };
    return { status: 'critical', color: 'red', icon: AlertCircle };
  };

  const getEnergyStatus = () => {
    if (energyValue >= 80) return { status: 'high', color: 'blue', icon: Flame };
    if (energyValue >= 60) return { status: 'good', color: 'cyan', icon: Zap };
    if (energyValue >= 40) return { status: 'moderate', color: 'yellow', icon: Battery };
    if (energyValue >= 20) return { status: 'low', color: 'orange', icon: AlertCircle };
    return { status: 'depleted', color: 'red', icon: AlertCircle };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/10 border-2 border-blue-100 dark:border-blue-800/50 shadow-2xl">
        {/* Enhanced Header with Status */}
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Heart size={28} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Health & Energy Hub
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your wellbeing with smart actions
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="rounded-xl"
              >
                {viewMode === 'grid' ? <Book size={16} /> : <Gamepad2 size={16} />}
              </Button>
              <Button 
                onClick={() => setShowDialog(true)} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6 shadow-lg"
              >
                <Settings size={18} className="mr-2" />
                Manage
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Enhanced Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Health Status */}
            <Card className="bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/10 border border-emerald-200 dark:border-emerald-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {React.createElement(getHealthStatus().icon, { 
                      size: 20, 
                      className: `text-${getHealthStatus().color}-600` 
                    })}
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Health</h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`bg-${getHealthStatus().color}-100 text-${getHealthStatus().color}-800 border-${getHealthStatus().color}-300`}
                  >
                    {getHealthStatus().status}
                  </Badge>
                </div>
                <Progress value={(healthValue / maxHealth) * 100} className="h-3 mb-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{healthValue}/{maxHealth}</span>
                  <span className={`font-medium text-${getHealthStatus().color}-600`}>
                    {Math.round((healthValue / maxHealth) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Energy Status */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-800/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {React.createElement(getEnergyStatus().icon, { 
                      size: 20, 
                      className: `text-${getEnergyStatus().color}-600` 
                    })}
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Energy</h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`bg-${getEnergyStatus().color}-100 text-${getEnergyStatus().color}-800 border-${getEnergyStatus().color}-300`}
                  >
                    {getEnergyStatus().status}
                  </Badge>
                </div>
                <Progress value={(energyValue / maxEnergy) * 100} className="h-3 mb-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{energyValue}/{maxEnergy}</span>
                  <span className={`font-medium text-${getEnergyStatus().color}-600`}>
                    {Math.round((energyValue / maxEnergy) * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Filter Controls */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(category => {
                    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
                    return (
                      <option key={category} value={category}>
                        {config?.name || category}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <option value="impact">By Impact</option>
                  <option value="category">By Category</option>
                  <option value="recent">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Actions Grid */}
          <div className="relative">
            {/* Scroll Controls */}
            {filteredActivities.length > 3 && (
              <div className="flex justify-end absolute -top-12 right-0 gap-2 z-20">
                <Button 
                  onClick={() => scroll('left')} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full w-10 h-10 p-0 shadow-lg"
                >
                  <ArrowLeft size={16} />
                </Button>
                <Button 
                  onClick={() => scroll('right')} 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full w-10 h-10 p-0 shadow-lg"
                >
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}

            {/* Actions Container */}
            <div 
              ref={sliderRef}
              className={cn(
                "overflow-x-auto scrollbar-hide",
                viewMode === 'grid' 
                  ? "flex gap-4 pb-4" 
                  : "space-y-3"
              )}
            >
              <AnimatePresence>
                {filteredActivities.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600"
                  >
                    <AlertCircle size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      No Activities Found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                      {activeCategory === 'all' 
                        ? "Add some health activities to get started"
                        : `No activities in the ${activeCategory} category`
                      }
                    </p>
                    <Button onClick={() => setShowDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus size={16} className="mr-2" />
                      Add Activities
                    </Button>
                  </motion.div>
                ) : (
                  filteredActivities.map((activity, index) => {
                    const categoryConfig = CATEGORY_CONFIG[activity.category as keyof typeof CATEGORY_CONFIG];
                    const IconComponent = categoryConfig?.icon || Activity;
                    const impactLevel = Math.abs(activity.healthChangeAmount + activity.energyChangeAmount);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        data-activity-id={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          "group cursor-pointer transition-all duration-300",
                          viewMode === 'grid' 
                            ? "flex-shrink-0 w-72" 
                            : "w-full"
                        )}
                        onClick={() => handleHealthAction(activity)}
                      >
                        <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <CardContent className="p-5">
                            {/* Activity Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl bg-gradient-to-br from-${categoryConfig?.color || 'gray'}-100 to-${categoryConfig?.color || 'gray'}-200 dark:from-${categoryConfig?.color || 'gray'}-900/50 dark:to-${categoryConfig?.color || 'gray'}-800/50`}>
                                  <IconComponent size={24} className={`text-${categoryConfig?.color || 'gray'}-600 dark:text-${categoryConfig?.color || 'gray'}-300`} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {activity.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {categoryConfig?.description || activity.category}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Impact Badge */}
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "font-semibold",
                                  impactLevel >= 20 ? "bg-red-100 text-red-800 border-red-300" :
                                  impactLevel >= 10 ? "bg-orange-100 text-orange-800 border-orange-300" :
                                  impactLevel >= 5 ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                                  "bg-green-100 text-green-800 border-green-300"
                                )}
                              >
                                {impactLevel >= 20 ? "High" :
                                 impactLevel >= 10 ? "Medium" :
                                 impactLevel >= 5 ? "Low" : "Minimal"} Impact
                              </Badge>
                            </div>

                            {/* Activity Description */}
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                              {activity.description}
                            </p>

                            {/* Effects Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              {activity.healthChangeAmount !== 0 && (
                                <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                  <Heart size={16} className="text-emerald-600 dark:text-emerald-400" />
                                  <span className={cn(
                                    "text-sm font-semibold",
                                    activity.healthChangeAmount > 0 
                                      ? "text-emerald-700 dark:text-emerald-300" 
                                      : "text-red-700 dark:text-red-300"
                                  )}>
                                    {activity.healthChangeAmount > 0 ? '+' : ''}{activity.healthChangeAmount} Health
                                  </span>
                                </div>
                              )}
                              
                              {activity.energyChangeAmount !== 0 && (
                                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <Zap size={16} className="text-blue-600 dark:text-blue-400" />
                                  <span className={cn(
                                    "text-sm font-semibold",
                                    activity.energyChangeAmount > 0 
                                      ? "text-blue-700 dark:text-blue-300" 
                                      : "text-red-700 dark:text-red-300"
                                  )}>
                                    {activity.energyChangeAmount > 0 ? '+' : ''}{activity.energyChangeAmount} Energy
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Activity Metadata */}
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                              {activity.duration && (
                                <div className="flex items-center gap-1">
                                  <Timer size={12} />
                                  <span>{activity.duration} min</span>
                                </div>
                              )}
                              {activity.xpChangeAmount && (
                                <div className="flex items-center gap-1">
                                  <Star size={12} />
                                  <span>+{activity.xpChangeAmount + getCategoryBonus(activity.category)} XP</span>
                                </div>
                              )}
                            </div>

                            {/* Action Button */}
                            <Button 
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHealthAction(activity);
                              }}
                            >
                              <RefreshCw size={16} className="mr-2 group-hover:animate-spin" />
                              Complete Activity
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Management Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings size={24} />
              Manage Health Activities
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add, edit, or remove health activities to customize your wellness routine.
            </p>
            {/* Placeholder for activity management interface */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <Settings size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Activity management interface coming soon...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default HealthActions;
