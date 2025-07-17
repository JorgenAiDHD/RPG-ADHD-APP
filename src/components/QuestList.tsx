import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'framer-motion';
import { Clock, Star, Edit3, CheckCircle, Coins, Plus } from 'lucide-react';
import NewQuestDialog from './NewQuestDialog';
import type { ChangeEvent } from 'react';
import type { Quest } from '../types/game';

// Funkcja obliczająca złoto na podstawie typu i trudności questa
const calculateGoldReward = (quest: Quest): number => {
  // If the quest already has a goldReward property defined, use that
  if (quest.goldReward !== undefined) {
    return quest.goldReward;
  }
  
  // Podstawowe złoto za quest
  let baseGold = 5;
  
  // Modyfikator za typ questa
  const typeModifier = {
    'main': 5,
    'side': 3,
    'daily': 2,
    'weekly': 4
  };
  
  // Modyfikator za poziom trudności
  const difficultyModifier = quest.difficultyLevel;
  
  // Modyfikator za priorytet
  const priorityModifier = {
    'urgent': 2.0,
    'high': 1.5,
    'medium': 1.25,
    'low': 1.0
  };
  
  // Obliczanie końcowej nagrody
  const goldReward = Math.floor(
    baseGold * 
    (typeModifier[quest.type] || 1) * 
    (difficultyModifier * 0.5) * 
    (priorityModifier[quest.priority] || 1)
  );
  
  const finalReward = Math.max(1, goldReward); // Minimalnie 1 złoto
  return finalReward;
};

// Funkcja do kolorowego kodowania kategorii questów z systemem ADHD
const getCategoryColor = (category: string) => {
  const categoryColors = {
    'work': 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-700/20 dark:text-primary-300 dark:border-primary-600/50',
    'personal': 'bg-success-100 text-success-700 border-success-200 dark:bg-success-700/20 dark:text-success-300 dark:border-success-600/50',
    'health': 'bg-error-100 text-error-700 border-error-200 dark:bg-error-700/20 dark:text-error-300 dark:border-error-600/50',
    'learning': 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-secondary-700/20 dark:text-secondary-300 dark:border-secondary-600/50',
    'creative': 'bg-adhd-creative-100 text-adhd-creative-700 border-adhd-creative-200 dark:bg-adhd-creative-700/20 dark:text-adhd-creative-300 dark:border-adhd-creative-600/50',
    'social': 'bg-adhd-energy-100 text-adhd-energy-700 border-adhd-energy-200 dark:bg-adhd-energy-700/20 dark:text-adhd-energy-300 dark:border-adhd-energy-600/50'
  };
  return categoryColors[category as keyof typeof categoryColors] || 'bg-surface-100 text-surface-700 border-surface-200 dark:bg-surface-700/20 dark:text-surface-300 dark:border-surface-600/50';
};

// Funkcja do ikony kategorii
const getCategoryIcon = (category: string) => {
  const categoryIcons = {
    'work': '💼',
    'personal': '🏠',
    'health': '💪',
    'learning': '📚',
    'creative': '🎨',
    'social': '👥'
  };
  return categoryIcons[category as keyof typeof categoryIcons] || '📋';
};


const QuestList = () => {
  const { state, actions } = useGame();
  // Only show quests that are not completed
  const activeQuests = state.quests.filter(q => q.status !== 'completed');
  // Stan do edycji questa
  const [editOpen, setEditOpen] = useState(false);
  // const [editingQuest, setEditingQuest] = useState<Quest | null>(null); // unused
  const [editQuest, setEditQuest] = useState<Quest | null>(null);
  const [editError, setEditError] = useState('');
  // Removed duplicate actions declaration

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editQuest) return;
    setEditQuest({ ...editQuest, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  const openEditDialog = (quest: Quest) => {
    setEditQuest({ ...quest });
    setEditError('');
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editQuest) return;
    if (!editQuest.title.trim()) {
      setEditError('Title is required');
      return;
    }
    actions.editQuest(editQuest);
    setEditOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="card-primary">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDgxQ0IiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMThjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0xOGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0wIDM2YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-primary-200 dark:border-primary-700/60 relative z-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-0">
            <div className="icon-container-primary">
              <CheckCircle size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gradient-primary">
                Quest Journal
              </h2>
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                {activeQuests.length} active quest{activeQuests.length !== 1 ? 's' : ''} awaiting completion
              </p>
            </div>
          </div>
          <NewQuestDialog />
        </div>

        {/* Enhanced Empty State */}
        {activeQuests.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-8 w-4 h-4 bg-cyan-500 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-8 left-12 w-6 h-6 bg-purple-500 rounded-full animate-pulse delay-700"></div>
            </div>
            
            <div className="relative z-10">
              <CheckCircle size={64} className="text-slate-400 dark:text-slate-500 mx-auto mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-3">Ready for Adventure?</h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
                Your quest journal is empty and waiting for epic adventures. Create your first quest to begin your journey!
              </p>
              <div className="space-y-4">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl px-8 py-4 flex items-center gap-3 shadow-xl border border-blue-500/50 transition-all hover:shadow-blue-500/30 hover:scale-105 mx-auto"
                  onClick={() => {
                    const newQuestBtn = document.querySelector('[data-new-quest-trigger]') as HTMLButtonElement;
                    if (newQuestBtn) newQuestBtn.click();
                  }}
                >
                  <Plus size={20} />
                  Create Your First Quest
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  💡 Tip: Start with a simple daily task to get familiar with the system
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quest List with improved spacing and readability - responsive height */}
        <div className="space-y-4 sm:space-y-5 max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-220px)] lg:max-h-[60vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar pb-4 sm:pb-6 pt-1 sm:pt-2">
        {activeQuests.map((quest) => (
          <motion.div 
            key={quest.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={`relative p-0 rounded-xl sm:rounded-2xl shadow-md overflow-hidden ${
                quest.status === 'completed' ? 'opacity-75' : ''
              }`}
            >
              {/* Priority indicator - visible but not distracting */}
              <div className={`absolute top-0 left-0 w-1.5 sm:w-2 h-full ${
                quest.priority === 'urgent' ? 'bg-gradient-to-b from-red-400 to-red-600 dark:from-red-500 dark:to-red-700' : 
                quest.priority === 'high' ? 'bg-gradient-to-b from-orange-400 to-orange-600 dark:from-orange-500 dark:to-orange-700' :
                quest.priority === 'medium' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600 dark:from-yellow-500 dark:to-yellow-700' :
                'bg-gradient-to-b from-green-400 to-green-600 dark:from-green-500 dark:to-green-700'
              }`}></div>
              
              <Card className={`p-4 sm:p-6 pl-5 sm:pl-7 h-full border-l-0 ${
                quest.status === 'completed' 
                  ? 'bg-gray-50 dark:bg-zinc-800/30 border-gray-200 dark:border-zinc-700/50' 
                  : 'bg-white dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-700/50'
              } shadow-md hover:shadow-lg transition-shadow`}>
                <div className="flex flex-col space-y-3 sm:space-y-5">
                  {/* Title and Type */}
                  <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col gap-1.5 sm:gap-2 flex-grow">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                        <h3 className={`font-bold text-base sm:text-xl ${
                          quest.status === 'completed' 
                            ? 'line-through text-gray-500 dark:text-zinc-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {quest.title}
                        </h3>
                        
                        {/* Quest type badges with improved colors for light/dark mode */}
                        {quest.type === 'main' && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-white border border-yellow-200 dark:border-yellow-700/50 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full">
                            Main
                          </Badge>
                        )}
                        {quest.type === 'side' && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600 dark:text-white border border-blue-200 dark:border-blue-700/50 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full">
                            Side
                          </Badge>
                        )}
                        {quest.type === 'daily' && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-600 dark:text-white border border-green-200 dark:border-green-700/50 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full">
                            Daily
                          </Badge>
                        )}
                        {quest.type === 'weekly' && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-600 dark:text-white border border-purple-200 dark:border-purple-700/50 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full">
                            Weekly
                          </Badge>
                        )}
                        
                        {/* Category badge */}
                        {quest.category && (
                          <Badge className={`${getCategoryColor(quest.category)} flex items-center gap-1 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full border`}>
                            <span>{getCategoryIcon(quest.category)}</span>
                            {quest.category.charAt(0).toUpperCase() + quest.category.slice(1)}
                          </Badge>
                        )}
                        
                        {/* Status badges */}
                        {quest.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-100 border border-green-200 dark:border-green-700/50 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full">
                            <CheckCircle size={12} /> Completed
                          </Badge>
                        )}
                        
                        {quest.status === 'active' && (
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-100 border border-blue-200 dark:border-blue-700/50 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full">
                            Active
                          </Badge>
                        )}
                      </div>
                      
                      {/* XP i Gold rewards badges */}
                      <div className="flex-shrink-0 flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-600/80 dark:text-white whitespace-nowrap font-medium flex items-center border border-blue-200 dark:border-blue-700/50 rounded-full">
                          <Star size={14} className="mr-1" /> {quest.xpReward} XP
                        </Badge>
                        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-600/80 dark:text-white whitespace-nowrap font-medium flex items-center border border-amber-200 dark:border-amber-700/50 rounded-full">
                          <Coins size={14} className="mr-1" /> {calculateGoldReward(quest)} Gold
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description - more readable with better contrast */}
                  <div className={`text-base leading-relaxed bg-gray-50 dark:bg-zinc-900/70 p-5 rounded-xl border border-gray-200 dark:border-zinc-700/30 ${
                    quest.status === 'completed' ? 'text-gray-500 dark:text-zinc-500' : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {quest.description}
                  </div>
                  
                  {/* Quest Details - clear categories with consistent styling and improved readability */}
                  <div className="flex flex-wrap gap-3 mt-2">
                    {/* Priority Badge - Color coded by priority level */}
                    <Badge className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-md ${
                      quest.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-100 border border-red-200 dark:border-red-700/50' :
                      quest.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/70 dark:text-orange-100 border border-orange-200 dark:border-orange-700/50' :
                      quest.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-700/50' :
                      'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-100 border border-green-200 dark:border-green-700/50'
                    }`}>
                      {quest.priority.charAt(0).toUpperCase() + quest.priority.slice(1)} Priority
                    </Badge>
                    
                    {/* Time Badge - With clear icon and concise display */}
                    <Badge className="bg-gray-100 dark:bg-zinc-800/70 text-gray-700 dark:text-blue-100 border border-gray-200 dark:border-zinc-700/50 flex items-center gap-1.5 whitespace-nowrap px-3 py-1 text-xs rounded-md">
                      <Clock size={14} className="text-blue-600 dark:text-blue-300" /> {quest.estimatedTime} min
                    </Badge>
                    
                    {/* Difficulty Badge - Color coded by difficulty level */}
                    <Badge 
                      className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1 text-xs font-medium rounded-md ${
                        quest.difficultyLevel >= 4 ? 'bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-100 border border-red-200 dark:border-red-700/50' :
                        quest.difficultyLevel === 3 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-700/50' :
                        'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-100 border border-green-200 dark:border-green-700/50'
                      }`}
                    >
                      <Star size={14} className={`${
                        quest.difficultyLevel >= 4 ? 'text-red-600 dark:text-red-300' :
                        quest.difficultyLevel === 3 ? 'text-yellow-600 dark:text-yellow-300' :
                        'text-green-600 dark:text-green-300'
                      }`} /> 
                      Difficulty: {quest.difficultyLevel}
                    </Badge>
                    
                    {/* Energy Badge - With appropriate coloring */}
                    <Badge 
                      className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-md ${
                        quest.energyRequired === 'high' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/70 dark:text-purple-100 border border-purple-200 dark:border-purple-700/50' :
                        quest.energyRequired === 'medium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-100 border border-blue-200 dark:border-blue-700/50' :
                        'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/70 dark:text-cyan-100 border border-cyan-200 dark:border-cyan-700/50'
                      }`}
                    >
                      Energy: {quest.energyRequired}
                    </Badge>
                    
                    {/* Comfort/Anxiety Level Badge - With appropriate coloring */}
                    <Badge 
                      className={`whitespace-nowrap px-3 py-1 text-xs font-medium rounded-md ${
                        quest.anxietyLevel === 'daunting' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/70 dark:text-orange-100 border border-orange-200 dark:border-orange-700/50' :
                        quest.anxietyLevel === 'challenging' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/70 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-700/50' :
                        quest.anxietyLevel === 'mild' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-100 border border-blue-200 dark:border-blue-700/50' :
                        'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-100 border border-green-200 dark:border-green-700/50'
                      }`}
                    >
                      Comfort: {quest.anxietyLevel}
                    </Badge>
                  </div>
                  
                  {/* Action Buttons - clearly separated and styled */}
                  <div className="mt-3 flex flex-wrap sm:flex-nowrap gap-3 justify-end">
                    {quest.status === 'active' && (
                      <Button 
                        variant="default" 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white shadow-md px-4 py-2.5 border border-green-500/50 rounded-xl transition-all hover:shadow-green-500/20 text-sm" 
                        onClick={() => {
                          try {
                            const goldReward = quest.goldReward || calculateGoldReward(quest);
                            actions.completeQuest(quest.id);
                            if (goldReward > 0) {
                              actions.addGold(goldReward, `Completed quest: ${quest.title}`);
                              setTimeout(() => {}, 0);
                            } else {
                              actions.addGold(1, `Completed quest: ${quest.title}`);
                            }
                            actions.updateStreak();
                          } catch (error) {
                            console.error('Error completing quest:', error);
                          }
                        }}
                      >
                        <CheckCircle size={18} /> 
                        <span className="flex items-center gap-1">
                          Complete 
                          <span className="flex items-center text-xs gap-0.5 bg-green-500 rounded-full px-2 py-0.5 ml-1">
                            <Coins size={12} className="text-yellow-300" />
                            <span>{quest.goldReward || calculateGoldReward(quest)}</span>
                          </span>
                        </span>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 bg-transparent border-gray-300 text-gray-700 dark:border-blue-500/50 dark:text-blue-300 hover:bg-gray-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-200 shadow-sm px-4 py-2.5 rounded-xl transition-all dark:hover:border-blue-400 hover:shadow-sm text-sm" 
                      onClick={() => openEditDialog(quest)}
                    >
                      <Edit3 size={18} /> Edit Quest
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white shadow-md px-4 py-2.5 border border-red-500/50 rounded-xl transition-all hover:shadow-red-500/20 text-sm"
                      onClick={() => actions.removeQuest(quest.id)}
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {/* Add Quest Button at the bottom of the list */}
          <div className="mt-6">
            <Button 
              id="add-quest-button-bottom"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md border border-blue-500/50 transition-all"
              onClick={() => window.document.getElementById('add-quest-button')?.click()}
            >
              <span className="text-lg font-bold">+</span> Add New Quest
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Edit Quest Dialog - Improved for ADHD-friendly UI */}
      {editOpen && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-md w-full rounded-2xl p-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-6 border-b border-blue-100 dark:border-blue-900/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-blue-800 dark:text-blue-200">Edit Quest</DialogTitle>
              </DialogHeader>
            </div>
            
            {editQuest && (
              <form className="p-6 space-y-5" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Quest Title</label>
                  <Input 
                    name="title" 
                    placeholder="Enter quest title" 
                    value={editQuest.title} 
                    onChange={handleEditChange} 
                    autoFocus 
                    className="h-11 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</label>
                  <Textarea 
                    name="description" 
                    placeholder="Describe your quest" 
                    value={editQuest.description} 
                    onChange={handleEditChange} 
                    className="min-h-[80px] text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Quest Type</label>
                    <select
                      name="type"
                      value={editQuest.type}
                      onChange={handleEditChange}
                      className="w-full h-11 text-base border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="main">Main Quest</option>
                      <option value="side">Side Quest</option>
                      <option value="daily">Daily Quest</option>
                      <option value="weekly">Weekly Quest</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      name="category"
                      value={editQuest.category || 'personal'}
                      onChange={handleEditChange}
                      className="w-full h-11 text-base border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="work">💼 Work</option>
                      <option value="personal">🏠 Personal</option>
                      <option value="health">💪 Health</option>
                      <option value="learning">📚 Learning</option>
                      <option value="creative">🎨 Creative</option>
                      <option value="social">👥 Social</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Priority Level</label>
                    <select
                      name="priority"
                      value={editQuest.priority}
                      onChange={handleEditChange}
                      className="w-full h-11 text-base border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent Priority</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">XP Reward</label>
                    <Input
                      name="xpReward"
                      type="number"
                      min={1}
                      value={editQuest.xpReward}
                      onChange={handleEditChange}
                      className="h-11 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Estimated Time (min)</label>
                    <Input
                      name="estimatedTime"
                      type="number"
                      min={1}
                      value={editQuest.estimatedTime}
                      onChange={handleEditChange}
                      className="h-11 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Energy Required</label>
                    <Input
                      name="energyRequired"
                      type="number"
                      min={1}
                      max={10}
                      value={editQuest.energyRequired}
                      onChange={handleEditChange}
                      className="h-11 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Anxiety Level</label>
                    <Input
                      name="anxietyLevel"
                      type="number"
                      min={1}
                      max={10}
                      value={editQuest.anxietyLevel}
                      onChange={handleEditChange}
                      className="h-11 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Difficulty Level</label>
                  <Input
                    name="difficultyLevel"
                    type="number"
                    min={1}
                    max={10}
                    value={editQuest.difficultyLevel}
                    onChange={handleEditChange}
                    className="h-11 text-base bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {editError && (
                  <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg">
                    <p className="text-red-700 dark:text-red-400 text-sm">{editError}</p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-3">
                  <Button 
                    type="button" 
                    onClick={() => setEditOpen(false)} 
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-gray-200 font-medium rounded-xl py-2.5 border border-transparent"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl py-2.5 border border-blue-500/50 shadow-md hover:shadow-blue-500/20"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default QuestList;
