
import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Plus, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { QUEST_TEMPLATES, getTemplatesByCategory, type QuestTemplate } from '../data/questTemplates';

import type { ChangeEvent, FormEvent } from 'react';
import type { Quest } from '../types/game';

const defaultQuest: Omit<Quest, 'id'> = {
  title: '',
  description: '',
  type: 'side',
  category: 'personal',
  xpReward: 10,
  goldReward: 5, // Added default goldReward
  priority: 'medium',
  status: 'active',
  createdDate: new Date(),
  estimatedTime: 15,
  difficultyLevel: 2,
  energyRequired: 'medium',
  anxietyLevel: 'mild', // Changed default from 'comfortable' to 'mild'
  tags: [],
};

const NewQuestDialog = () => {
  const { actions } = useGame();
  const [open, setOpen] = useState(false);
  const [quest, setQuest] = useState({ ...defaultQuest });
  const [error, setError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get filtered templates
  const filteredTemplates = selectedCategory === 'all' 
    ? QUEST_TEMPLATES 
    : getTemplatesByCategory(selectedCategory);

  const applyTemplate = (template: QuestTemplate) => {
    setQuest({
      ...quest,
      title: template.title,
      description: template.description,
      category: template.category,
      type: template.type,
      xpReward: template.xpReward,
      goldReward: template.goldReward,
      priority: template.priority,
      estimatedTime: template.estimatedTime,
      difficultyLevel: template.difficultyLevel,
      energyRequired: template.energyRequired,
      anxietyLevel: template.anxietyLevel,
      tags: [...template.tags]
    });
    setShowTemplates(false);
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError('');
    if (name === 'xpReward' || name === 'goldReward' || name === 'estimatedTime' || name === 'difficultyLevel') {
      setQuest({ ...quest, [name]: Number(value) });
    } else if (name === 'tags') {
      setQuest({ ...quest, tags: value.split(',').map(t => t.trim()).filter(Boolean) });
    } else {
      setQuest({ ...quest, [name]: value });
    }
  };


  const handleAdd = () => {
    if (!quest.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!quest.description.trim()) {
      setError('Description is required');
      return;
    }
    if (quest.xpReward < 1) {
      setError('XP Reward must be at least 1');
      return;
    }
    if (!quest.goldReward || quest.goldReward < 1) {
      setError('Gold Reward must be at least 1');
      return;
    }
    if (quest.estimatedTime < 1) {
      setError('Estimated time must be at least 1 minute');
      return;
    }
    if (quest.difficultyLevel < 1 || quest.difficultyLevel > 5) {
      setError('Difficulty must be between 1 and 5');
      return;
    }

    // Create a new quest with calculated gold reward if not set explicitly
    const newQuest = { 
      ...quest, 
      id: crypto.randomUUID(),
      goldReward: quest.goldReward // Ensure gold reward is saved
    };

    console.log('Adding new quest with gold reward:', newQuest.goldReward);
    actions.addQuest(newQuest);
    setQuest({ ...defaultQuest });
    setError('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          data-new-quest-trigger
          variant="default" 
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl text-sm px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-green-500/50 transition-all hover:shadow-green-500/20 hover:scale-105"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">New Quest</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-full rounded-2xl p-8 bg-white dark:bg-zinc-900 shadow-2xl border border-blue-200 dark:border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold mb-4 text-blue-700 dark:text-blue-300 tracking-tight">
            {quest.type === 'main' ? 'Add Main Quest' : 'Add New Quest'}
          </DialogTitle>
        </DialogHeader>

        {/* Quick Templates Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Templates</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs"
            >
              <Sparkles size={14} className="mr-1" />
              {showTemplates ? 'Hide' : 'Show'} Templates
            </Button>
          </div>
          
          {showTemplates && (
            <div className="space-y-3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-2 py-1 text-xs rounded-full border ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  All
                </button>
                {['work', 'health', 'learning', 'personal', 'creative', 'social'].map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-2 py-1 text-xs rounded-full border ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {filteredTemplates.slice(0, 6).map(template => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="text-left p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{template.icon}</span>
                      <span className="font-medium text-sm">{template.title}</span>
                      <Badge className="ml-auto text-xs px-1.5 py-0.5">
                        {template.xpReward} XP
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form className="space-y-6" onSubmit={(e: FormEvent) => { e.preventDefault(); handleAdd(); }}>
          <div>
            <label className="block text-base font-semibold mb-1">Title</label>
            <Input name="title" placeholder="e.g. Set Up Your Workspace" value={quest.title} onChange={handleChange} autoFocus className="h-11 text-lg" maxLength={60} />
            <span className="text-xs text-zinc-400">Max 60 characters</span>
          </div>
          <div>
            <label className="block text-base font-semibold mb-1">Description</label>
            <Textarea name="description" placeholder="Describe your quest, e.g. Organize your desk and digital workspace for maximum productivity" value={quest.description} onChange={handleChange} className="min-h-[70px] text-base" maxLength={200} />
            <span className="text-xs text-zinc-400">Max 200 characters</span>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Type</label>
              <select
                name="type"
                value={quest.type}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2 text-base bg-zinc-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
              >
                <option value="main">Main Quest</option>
                <option value="side">Side Quest</option>
                <option value="daily">Daily Task</option>
                <option value="weekly">Weekly Goal</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Category</label>
              <select
                name="category"
                value={quest.category}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2 text-base bg-zinc-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
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
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={quest.priority}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2 text-base bg-zinc-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">XP Reward</label>
              <Input
                name="xpReward"
                type="number"
                min={1}
                value={quest.xpReward}
                onChange={handleChange}
                className="h-10 text-base"
                placeholder="e.g. 50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Gold Reward</label>
              <Input
                name="goldReward"
                type="number"
                min={1}
                value={quest.goldReward || 5}
                onChange={handleChange}
                className="h-10 text-base"
                placeholder="e.g. 10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Estimated Time (min)</label>
              <Input
                name="estimatedTime"
                type="number"
                min={1}
                value={quest.estimatedTime}
                onChange={handleChange}
                className="h-10 text-base"
                placeholder="e.g. 30"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Difficulty</label>
              <select
                name="difficultyLevel"
                value={quest.difficultyLevel}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2 text-base bg-zinc-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
              >
                <option value={1}>1 - Very Easy</option>
                <option value={2}>2 - Easy</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - Hard</option>
                <option value={5}>5 - Epic</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Energy Required</label>
              <select
                name="energyRequired"
                value={quest.energyRequired}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2 text-base bg-zinc-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Anxiety Level</label>
              <select
                name="anxietyLevel"
                value={quest.anxietyLevel}
                onChange={handleChange}
                className="w-full border rounded px-2 py-2 text-base bg-zinc-50 dark:bg-zinc-800 border-blue-100 dark:border-zinc-700"
              >
                <option value="comfortable">Comfortable - Easy to start</option>
                <option value="mild">Mild - Slight hesitation</option>
                <option value="challenging">Challenging - Requires push</option>
                <option value="daunting">Daunting - High resistance</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">Tags (comma separated)</label>
              <Input
                name="tags"
                placeholder="e.g. Focus, AI Help, Reflection"
                value={quest.tags.join(', ')}
                onChange={handleChange}
                className="h-10 text-base"
                maxLength={60}
              />
              <span className="text-xs text-zinc-400">e.g. Focus, AI Help, Reflection</span>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
          <Button 
            type="submit" 
            className={`mt-4 w-full ${
              quest.type === 'main' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold rounded-lg h-12 text-lg shadow focus:ring-4 focus:outline-none ${
              quest.type === 'main' ? 'focus:ring-yellow-300/50' : 'focus:ring-blue-300/50'
            }`}
          >
            {quest.type === 'main' ? 'Add Main Quest' : 'Add Quest'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewQuestDialog;
