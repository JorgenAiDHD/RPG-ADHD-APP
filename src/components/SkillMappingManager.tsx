import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { SkillChartSystem } from '../utils/characterClasses';
import { Settings, Plus, Edit } from 'lucide-react';

interface SkillMappingRule {
  id: string;
  name: string;
  description: string;
  activityType: string;
  category?: string;
  skillMappings: { skillId: string; xp: number }[];
  enabled: boolean;
}

const defaultSkillMappingRules: SkillMappingRule[] = [
  {
    id: 'quest_completed',
    name: 'Quest Completed',
    description: 'When a quest is completed',
    activityType: 'quest_completed',
    skillMappings: [
      { skillId: 'organization', xp: 5 },
      { skillId: 'resilience', xp: 3 }
    ],
    enabled: true
  },
  {
    id: 'daily_action_health',
    name: 'Health Daily Action',
    description: 'When a health daily action is completed',
    activityType: 'daily_action_completed',
    category: 'health',
    skillMappings: [
      { skillId: 'exercise', xp: 8 },
      { skillId: 'meditation', xp: 6 }
    ],
    enabled: true
  },
  {
    id: 'daily_action_learning',
    name: 'Learning Daily Action',
    description: 'When a learning daily action is completed',
    activityType: 'daily_action_completed',
    category: 'learning',
    skillMappings: [
      { skillId: 'learning', xp: 10 }
    ],
    enabled: true
  },
  {
    id: 'daily_action_creative',
    name: 'Creative Daily Action', 
    description: 'When a creative daily action is completed',
    activityType: 'daily_action_completed',
    category: 'creative',
    skillMappings: [
      { skillId: 'creativity', xp: 10 }
    ],
    enabled: true
  },
  {
    id: 'focus_session',
    name: 'Focus Session',
    description: 'When a focus/pomodoro session is completed',
    activityType: 'focus_session',
    skillMappings: [
      { skillId: 'focus', xp: 10 },
      { skillId: 'meditation', xp: 6 }
    ],
    enabled: true
  }
];

interface SkillMappingManagerProps {
  trigger?: React.ReactNode;
}

export const SkillMappingManager: React.FC<SkillMappingManagerProps> = ({ trigger }) => {
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<SkillMappingRule[]>(defaultSkillMappingRules);

  const availableSkills = SkillChartSystem.getDefaultSkills();

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'health': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'learning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'creative': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'work': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'social': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getSkillIcon = (skillId: string) => {
    const skill = availableSkills.find(s => s.id === skillId);
    return skill?.icon || '⚡';
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings size={16} />
            Skill Rules
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Skill Mapping Rules
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure how different activities affect your skill progression
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={`p-4 transition-all ${rule.enabled ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' : 'border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800/20'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{rule.name}</h3>
                    {rule.category && (
                      <Badge className={getCategoryColor(rule.category)}>
                        {rule.category}
                      </Badge>
                    )}
                    <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {rule.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Skill Effects:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {rule.skillMappings.map((mapping, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
                          <span>{getSkillIcon(mapping.skillId)}</span>
                          <span className="capitalize">{mapping.skillId}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            +{mapping.xp} XP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRule(rule.id)}
                    className={rule.enabled ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Edit size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" disabled>
            <Plus size={16} className="mr-2" />
            Add Custom Rule
          </Button>
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🎯 How Skill Rules Work
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Rules determine which skills get XP when you complete activities</li>
            <li>• Each rule can target specific activity types and categories</li>
            <li>• Disabled rules won't affect skill progression</li>
            <li>• Daily actions update skills based on their category</li>
            <li>• Future updates will allow creating custom rules</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillMappingManager;
