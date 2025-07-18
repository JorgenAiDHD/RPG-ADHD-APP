import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useGame } from '../context/GameContext';
import { CharacterClassSystem, SkillChartSystem, type CharacterClass } from '../utils/characterClasses';
import { SkillChartRadar, SkillChartHexagon } from './SkillChartRadar';
import { SkillMappingManager } from './SkillMappingManager';
import type { PlayerSkill } from '../types/game';

interface CharacterClassDialogProps {
  trigger?: React.ReactNode;
}

export const CharacterClassDialog: React.FC<CharacterClassDialogProps> = ({ trigger }) => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<'classes' | 'skills'>('classes');

  const currentClass = CharacterClassSystem.getCurrentClass(state);
  const availableClasses = CharacterClassSystem.getAvailableClasses(state);
  const lockedClasses = CharacterClassSystem.getLockedClassesWithProgress(state);
  const activeBonuses = CharacterClassSystem.getActiveBonuses(state);

  // Always use fresh skill data
  const skillChart = SkillChartSystem.generateSkillChart(state.playerSkills || []);
  const skillRecommendations = SkillChartSystem.getSkillRecommendations(skillChart);
  
  console.log('🎭 CharacterClassDialog rendering with playerSkills:', state.playerSkills);
  console.log('🎭 Generated skillChart:', skillChart);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'master': return 'bg-gold-100 text-gold-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'text-red-600 dark:text-red-400';
      case 'mental': return 'text-blue-600 dark:text-blue-400';
      case 'social': return 'text-green-600 dark:text-green-400';
      case 'creative': return 'text-purple-600 dark:text-purple-400';
      case 'technical': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderCharacterClassCard = (characterClass: CharacterClass, isLocked: boolean = false, progress?: string) => (
    <div 
      key={characterClass.id}
      className={`p-4 border rounded-lg transition-all duration-200 ${
        characterClass.id === currentClass.id
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
          : isLocked
          ? 'border-gray-300 bg-gray-50 dark:bg-gray-800 opacity-75'
          : 'border-gray-200 bg-white dark:bg-gray-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{characterClass.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{characterClass.name}</h3>
            <Badge className={getTierColor(characterClass.tier)}>
              {characterClass.tier}
            </Badge>
            {characterClass.id === currentClass.id && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Current
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {characterClass.description}
          </p>

          {isLocked && progress && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Progress: {progress}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {characterClass.unlockDescription}
              </p>
            </div>
          )}

          {!isLocked && characterClass.bonuses.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Bonuses:</p>
              {characterClass.bonuses.map((bonus, index) => (
                <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <span>⚡</span>
                  <span>{bonus.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSkillCard = (skill: PlayerSkill) => {
    const progress = (skill.experience / SkillChartSystem['getRequiredXPForLevel'](skill.level + 1)) * 100;
    
    return (
      <div key={skill.id} className="p-4 border rounded-lg bg-white dark:bg-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{skill.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{skill.name}</h3>
              <span className={`text-sm font-medium ${getCategoryColor(skill.category)}`}>
                Lv. {skill.level}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {skill.description}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress to next level</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span className={getCategoryColor(skill.category)}>
              {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
            </span>
            <span>{skill.experience} XP</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSkillChart = () => (
    <div className="space-y-6">
      {/* Skill Chart Radar */}
      <div className="flex justify-center mb-6">
        <div className="hidden md:block">
          <SkillChartRadar 
            key={`radar-${skillChart.overallLevel}-${skillChart.skills.reduce((acc, s) => acc + s.level + s.experience, 0)}`}
            skillChart={skillChart} 
            size={300} 
          />
        </div>
        <div className="md:hidden">
          <SkillChartHexagon 
            key={`hex-${skillChart.overallLevel}-${skillChart.skills.reduce((acc, s) => acc + s.level + s.experience, 0)}`}
            skillChart={skillChart} 
            size={200} 
          />
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {skillChart.overallLevel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Overall Level</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {skillChart.balance}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Balance</div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
            🏆 Strongest Skill
          </div>
          <div className="text-lg font-semibold">{skillChart.strongestSkill}</div>
        </div>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-sm font-medium text-red-700 dark:text-red-300">
            📈 Growth Area
          </div>
          <div className="text-lg font-semibold">{skillChart.weakestSkill}</div>
        </div>
      </div>

      {/* Recommendations */}
      {skillRecommendations.length > 0 && (
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
            💡 Recommendations
          </h3>
          <ul className="space-y-1">
            {skillRecommendations.map((rec, index) => (
              <li key={index} className="text-sm text-purple-600 dark:text-purple-400">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* All Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillChart.skills.map(renderSkillCard)}
      </div>
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <span className="text-lg">{currentClass.icon}</span>
            {currentClass.name}
            <Badge className={getTierColor(currentClass.tier)}>
              {currentClass.tier}
            </Badge>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{currentClass.icon}</span>
            Character Classes & Skills
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'classes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('classes')}
            className="flex-1"
          >
            Character Classes
          </Button>
          <Button
            variant={activeTab === 'skills' ? 'default' : 'outline'}
            onClick={() => setActiveTab('skills')}
            className="flex-1"
          >
            Skill Chart
          </Button>
          {activeTab === 'skills' && (
            <SkillMappingManager 
              trigger={
                <Button variant="outline" size="sm">
                  ⚙️ Rules
                </Button>
              }
            />
          )}
        </div>

        {activeTab === 'classes' && (
          <div className="space-y-6">
            {/* Current Class Summary */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Your Current Class</h3>
              {renderCharacterClassCard(currentClass)}
              
              {activeBonuses.length > 0 && (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                    🌟 Active Bonuses
                  </h4>
                  <div className="space-y-1">
                    {activeBonuses.map((bonus, index) => (
                      <div key={index} className="text-sm text-green-600 dark:text-green-400">
                        ⚡ {bonus.description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Available Classes */}
            {availableClasses.length > 1 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Available Classes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableClasses
                    .filter(cls => cls.id !== currentClass.id)
                    .map(cls => renderCharacterClassCard(cls))}
                </div>
              </div>
            )}

            {/* Locked Classes */}
            {lockedClasses.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Unlock More Classes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedClasses.map(cls => 
                    renderCharacterClassCard(cls, true, cls.progress)
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && renderSkillChart()}
      </DialogContent>
    </Dialog>
  );
};
