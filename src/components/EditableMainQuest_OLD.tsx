
import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit, Save, Target, Crown, Calendar, Clock, 
  Star, Trophy, Sparkles, ChevronRight, Settings,
  Play, Pause, RotateCcw, CheckCircle, AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

const EditableMainQuest = () => {
  const { state, actions } = useGame();
  const { mainQuest, quests, activeQuestId } = state;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mainQuest.title);
  const [description, setDescription] = useState(mainQuest.description);

  const activeQuest = activeQuestId ? quests.find(q => q.id === activeQuestId) : null;
  const availableQuests = quests.filter(q => q.status === 'active');

  const handleSave = () => {
    actions.setMainQuest(title, description);
    setEditing(false);
  };

  const setActiveQuest = (questId: string | null) => {
    actions.setActiveQuest(questId);
  };

  return (
    <div className="space-y-4">
      {/* Main Quest Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-br from-purple-900/60 to-zinc-900 border-purple-800 text-white shadow-lg shadow-purple-900/30 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-purple-400">
              <Crown size={20} />
              Main Quest
              {!editing && (
                <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
                  <Edit size={18} />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-2">
                <input
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-white"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
                <textarea
                  className="w-full rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-white"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <Button onClick={handleSave} className="mt-2 flex items-center gap-1">
                  <Save size={16} /> Save
                </Button>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-xl mb-1">{mainQuest.title}</div>
                <div className="text-gray-300 text-sm">{mainQuest.description}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Quest Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-blue-900/60 to-zinc-900 border-blue-800 text-white shadow-lg shadow-blue-900/30 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-blue-400">
              <Target size={20} />
              Active Quest
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeQuest ? (
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-xl mb-1 flex items-center gap-2">
                    {activeQuest.title}
                    <Badge className="text-xs px-2 py-1">
                      {activeQuest.xpReward} XP
                    </Badge>
                  </div>
                  <div className="text-gray-300 text-sm mb-2">{activeQuest.description}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge className="bg-gray-700 text-gray-300">
                      {activeQuest.type}
                    </Badge>
                    <Badge className="bg-gray-700 text-gray-300">
                      {activeQuest.category}
                    </Badge>
                    <span className="text-gray-400">
                      {activeQuest.estimatedTime} min
                    </span>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveQuest(null)} 
                  variant="outline" 
                  size="sm"
                  className="text-white border-gray-600 hover:bg-gray-700"
                >
                  Clear Active Quest
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-gray-400 text-sm mb-3">
                  No active quest selected. Choose one from your quest list:
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableQuests.slice(0, 5).map(quest => (
                    <button
                      key={quest.id}
                      onClick={() => setActiveQuest(quest.id)}
                      className="w-full text-left p-2 rounded border border-gray-600 hover:bg-gray-700 transition-colors"
                    >
                      <div className="font-medium text-sm">{quest.title}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{quest.type}</span>
                        <span>•</span>
                        <span>{quest.category}</span>
                        <span>•</span>
                        <span>{quest.xpReward} XP</span>
                      </div>
                    </button>
                  ))}
                </div>
                {availableQuests.length === 0 && (
                  <div className="text-gray-500 text-sm italic">
                    No active quests available. Create a new quest to get started!
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditableMainQuest;
