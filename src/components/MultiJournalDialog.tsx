import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Search, 
  TrendingUp,
  Star,
  DollarSign
} from 'lucide-react';
import { JournalSystem } from '../utils/journalSystem';
import type { Journal } from '../types/game';
import { toast } from 'sonner';

interface MultiJournalDialogProps {
  trigger: React.ReactNode;
}

export const MultiJournalDialog: React.FC<MultiJournalDialogProps> = ({ trigger }) => {
  const { state, actions } = useGame();
  const [activeTab, setActiveTab] = useState<'journals' | 'analytics' | 'search'>('journals');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New entry form state
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  const [newEntryMood, setNewEntryMood] = useState<number>(5);
  const [newEntryAmount, setNewEntryAmount] = useState<number>(0);
  const [newEntryTags, setNewEntryTags] = useState('');

  const journals = state.journals || [];

  // Initialize journals if empty
  useEffect(() => {
    if (journals.length === 0) {
      actions.initializeJournals();
    }
  }, [journals.length, actions]);

  const getJournalIcon = (type: Journal['type']) => {
    switch (type) {
      case 'gratitude': return '🙏';
      case 'good_deeds': return '❤️';
      case 'savings': return '💰';
      case 'ideas': return '💡';
      case 'reflection': return '🤔';
      case 'goals': return '🎯';
      default: return '📝';
    }
  };

  const handleCreateEntry = () => {
    if (!selectedJournal || !newEntryTitle.trim() || !newEntryContent.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    const entry = JournalSystem.createEntry(
      selectedJournal.type,
      newEntryTitle.trim(),
      newEntryContent.trim(),
      {
        mood: selectedJournal.type === 'gratitude' || selectedJournal.type === 'reflection' ? newEntryMood : undefined,
        amount: selectedJournal.type === 'savings' ? newEntryAmount : undefined,
        tags: newEntryTags.trim() ? newEntryTags.split(',').map(tag => tag.trim()) : undefined
      }
    );

    actions.addJournalEntry(selectedJournal.id, entry);
    
    // Reset form
    setNewEntryTitle('');
    setNewEntryContent('');
    setNewEntryMood(5);
    setNewEntryAmount(0);
    setNewEntryTags('');
    setShowNewEntry(false);
    
    toast.success(`Added entry to ${selectedJournal.name}!`);
  };

  const renderJournalCard = (journal: Journal) => {
    const stats = JournalSystem.getJournalStats(journal);
    const insights = JournalSystem.getJournalInsights(journal);

    return (
      <motion.div
        key={journal.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            selectedJournal?.id === journal.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedJournal(journal)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getJournalIcon(journal.type)}</div>
                <div>
                  <CardTitle className="text-lg">{journal.name}</CardTitle>
                  <p className="text-sm text-gray-500">{journal.description}</p>
                </div>
              </div>
              <Badge variant="secondary">{stats.totalEntries}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="font-semibold text-lg">{stats.currentStreak}</div>
                <div className="text-xs text-gray-500">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg">{stats.todayEntries}</div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
            </div>
            
            {journal.type === 'savings' && (
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-700">${stats.totalSaved}</div>
                <div className="text-xs text-green-600">Total Saved</div>
              </div>
            )}

            {insights.length > 0 && (
              <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600">{insights[0]}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderJournalEntries = () => {
    if (!selectedJournal) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-2xl">{getJournalIcon(selectedJournal.type)}</span>
            {selectedJournal.name}
          </h3>
          <Button onClick={() => setShowNewEntry(true)} size="sm">
            <Plus size={16} className="mr-1" />
            New Entry
          </Button>
        </div>

        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEntryTitle}
                    onChange={(e) => setNewEntryTitle(e.target.value)}
                    placeholder="Entry title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newEntryContent}
                    onChange={(e) => setNewEntryContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    rows={4}
                  />
                </div>

                {(selectedJournal.type === 'gratitude' || selectedJournal.type === 'reflection') && (
                  <div>
                    <Label>Mood (1-10)</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[...Array(10)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setNewEntryMood(i + 1)}
                          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                            newEntryMood >= i + 1
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedJournal.type === 'savings' && (
                  <div>
                    <Label htmlFor="amount">Amount Saved ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={newEntryAmount}
                      onChange={(e) => setNewEntryAmount(Number(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newEntryTags}
                    onChange={(e) => setNewEntryTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateEntry}>Add Entry</Button>
                  <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {selectedJournal.entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{entry.title}</h4>
                  <div className="text-xs text-gray-500">
                    {entry.date.toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{entry.content}</p>
                
                <div className="flex items-center gap-4 text-xs">
                  {entry.mood && (
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500" />
                      <span>{entry.mood}/10</span>
                    </div>
                  )}
                  {entry.amount && (
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} className="text-green-500" />
                      <span>${entry.amount}</span>
                    </div>
                  )}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex gap-1">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
          
          {selectedJournal.entries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p>No entries yet. Create your first entry!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const allEntries = journals.flatMap(journal => 
      journal.entries.map(entry => ({ ...entry, journalType: journal.type }))
    );

    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyStats = {
      totalEntries: allEntries.filter(entry => entry.date >= thisWeek).length,
      gratitudeEntries: allEntries.filter(entry => 
        entry.journalType === 'gratitude' && entry.date >= thisWeek
      ).length,
      avgMood: allEntries
        .filter(entry => entry.mood && entry.date >= thisWeek)
        .reduce((sum, entry) => sum + (entry.mood || 0), 0) / 
        (allEntries.filter(entry => entry.mood && entry.date >= thisWeek).length || 1)
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp size={20} />
          Journal Analytics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalEntries}</div>
              <div className="text-sm text-gray-500">Entries This Week</div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(weeklyStats.avgMood * 10) / 10}
              </div>
              <div className="text-sm text-gray-500">Average Mood</div>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          {journals.map(journal => {
            const stats = JournalSystem.getJournalStats(journal);
            const insights = JournalSystem.getJournalInsights(journal);
            
            return (
              <Card key={journal.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getJournalIcon(journal.type)}</span>
                    <span className="font-medium">{journal.name}</span>
                  </div>
                  <Badge>{stats.currentStreak} day streak</Badge>
                </div>
                
                {insights.length > 0 && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    {insights[0]}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSearch = () => {
    const searchResults = searchQuery.trim() 
      ? JournalSystem.searchEntries(journals, searchQuery)
      : [];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
          />
        </div>

        {searchQuery.trim() && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {searchResults.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{entry.title}</h4>
                  <div className="text-xs text-gray-500">
                    {entry.date.toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{entry.content}</p>
              </Card>
            ))}
            
            {searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No entries found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen size={24} />
            Multi-Journal System
          </DialogTitle>
        </DialogHeader>

        <div className="flex space-x-4">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            <Button
              variant={activeTab === 'journals' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('journals')}
            >
              <BookOpen size={16} className="mr-2" />
              Journals
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp size={16} className="mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === 'search' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('search')}
            >
              <Search size={16} className="mr-2" />
              Search
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'journals' && (
                <motion.div
                  key="journals"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {!selectedJournal ? (
                    <div className="grid grid-cols-2 gap-4">
                      {journals.map(renderJournalCard)}
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedJournal(null)}
                        className="mb-4"
                      >
                        ← Back to Journals
                      </Button>
                      {renderJournalEntries()}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderAnalytics()}
                </motion.div>
              )}

              {activeTab === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {renderSearch()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
