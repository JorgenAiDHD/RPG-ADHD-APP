

import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Edit, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const EditableMainQuest = () => {
  const { state, actions } = useGame();
  const { mainQuest } = state;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mainQuest.title);
  const [description, setDescription] = useState(mainQuest.description);

  const handleSave = () => {
    actions.setMainQuest(title, description);
    setEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-br from-purple-900/60 to-zinc-900 border-purple-800 text-white shadow-lg shadow-purple-900/30 rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2 text-purple-400">
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
  );
};

export default EditableMainQuest;
