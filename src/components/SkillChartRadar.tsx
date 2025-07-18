import React, { useMemo } from 'react';
import type { SkillChart } from '../types/game';
import { useGame } from '../context/GameContext';
import { SkillChartSystem } from '../utils/characterClasses';

interface SkillChartRadarProps {
  skillChart: SkillChart;
  size?: number;
  className?: string;
}

export const SkillChartRadar: React.FC<SkillChartRadarProps> = ({ 
  skillChart, 
  size = 200, 
  className = "" 
}) => {
  console.log('📊 SkillChartRadar rendering with skills:', skillChart.skills);
  
  const { skills } = skillChart;
  
  // Calculate radar chart points
  const radarData = useMemo(() => {
    const angleStep = (2 * Math.PI) / skills.length;
    const maxRadius = size / 2 - 20; // Leave margin for labels
    const center = size / 2;
    
    // Generate background grid (concentric polygons)
    const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
    const gridPaths = gridLevels.map(level => {
      const points = skills.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const radius = maxRadius * level;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return `${x},${y}`;
      }).join(' ');
      return points;
    });
    
    // Generate axis lines (from center to each skill point)
    const axisLines = skills.map((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x1 = center;
      const y1 = center;
      const x2 = center + maxRadius * Math.cos(angle);
      const y2 = center + maxRadius * Math.sin(angle);
      return { x1, y1, x2, y2 };
    });
    
    // Generate skill data points
    const skillPoints = skills.map((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedLevel = Math.min(skill.level / 100, 1); // Normalize to 0-1
      const radius = maxRadius * normalizedLevel;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      // Label position (slightly outside the chart)
      const labelRadius = maxRadius + 15;
      const labelX = center + labelRadius * Math.cos(angle);
      const labelY = center + labelRadius * Math.sin(angle);
      
      return {
        x,
        y,
        labelX,
        labelY,
        skill,
        angle: angle + Math.PI / 2 // Adjust for text rotation
      };
    });
    
    // Create the skill level polygon path
    const skillPath = skillPoints.map(point => `${point.x},${point.y}`).join(' ');
    
    return {
      gridPaths,
      axisLines,
      skillPoints,
      skillPath
    };
  }, [skills, size]);
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'physical': return '#ef4444'; // red
      case 'mental': return '#3b82f6';   // blue
      case 'social': return '#10b981';   // green
      case 'creative': return '#8b5cf6'; // purple
      case 'technical': return '#f59e0b'; // orange
      default: return '#6b7280';         // gray
    }
  };
  
  const getSkillColor = (level: number): string => {
    if (level >= 80) return '#10b981'; // green - expert
    if (level >= 60) return '#3b82f6'; // blue - advanced
    if (level >= 40) return '#f59e0b'; // orange - intermediate
    if (level >= 20) return '#ef4444'; // red - beginner
    return '#6b7280'; // gray - novice
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="drop-shadow-sm">
        {/* Background Grid */}
        {radarData.gridPaths.map((path, index) => (
          <polygon
            key={`grid-${index}`}
            points={path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
            opacity={0.3}
          />
        ))}
        
        {/* Axis Lines */}
        {radarData.axisLines.map((line, index) => (
          <line
            key={`axis-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-300 dark:text-gray-600"
            opacity={0.4}
          />
        ))}
        
        {/* Skill Level Area */}
        <polygon
          points={radarData.skillPath}
          fill="url(#skillGradient)"
          stroke="#3b82f6"
          strokeWidth="2"
          opacity={0.6}
        />
        
        {/* Skill Points */}
        {radarData.skillPoints.map((point, index) => (
          <circle
            key={`point-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={getCategoryColor(point.skill.category)}
            stroke="white"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
        ))}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="skillGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Skill Labels */}
      {radarData.skillPoints.map((point, index) => {
        const isRightSide = point.labelX > size / 2;
        const isTopHalf = point.labelY < size / 2;
        
        return (
          <div
            key={`label-${index}`}
            className="absolute text-xs font-medium pointer-events-none"
            style={{
              left: `${point.labelX}px`,
              top: `${point.labelY}px`,
              transform: `translate(${isRightSide ? '-100%' : '0%'}, ${isTopHalf ? '0%' : '-100%'})`,
              color: getCategoryColor(point.skill.category)
            }}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <span>{point.skill.icon}</span>
                <span className="font-semibold">{point.skill.name}</span>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg" style={{ color: getSkillColor(point.skill.level) }}>
                  {point.skill.level}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {point.skill.category}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Center Stats */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {skillChart.overallLevel}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Overall
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 font-medium">
            {skillChart.balance}% Balance
          </div>
        </div>
      </div>
    </div>
  );
};

// Simpler hexagon version for smaller displays
export const SkillChartHexagon: React.FC<SkillChartRadarProps> = ({ 
  skillChart, 
  size = 120, 
  className = "" 
}) => {
  console.log('🔷 SkillChartHexagon rendering with skills:', skillChart.skills);
  
  const topSkills = skillChart.skills
    .sort((a, b) => b.level - a.level)
    .slice(0, 6); // Show top 6 skills in hexagon
  
  console.log('🔷 Top skills for hexagon:', topSkills);
  
  const { state: gameState } = useGame();
  
  const hexagonData = useMemo(() => {
    const angleStep = Math.PI / 3; // 60 degrees for hexagon
    const maxRadius = size / 2 - 30;
    const center = size / 2;
    
    // Ensure we have exactly 6 skills for hexagon
    const hexSkills = [...topSkills];
    while (hexSkills.length < 6) {
      hexSkills.push({ 
        id: `empty-${hexSkills.length}`, 
        name: 'Empty', 
        level: 0, 
        experience: 0, 
        maxLevel: 100, 
        category: 'mental', 
        icon: '⚪', 
        description: 'No skill assigned' 
      });
    }
    const skillsToShow = hexSkills.slice(0, 6);
    
    // Calculate REAL progress based on completed quests and activities
    const calculateSkillProgress = (skill: any): number => {
      // Base progress from experience
      const baseProgress = Math.min(100, (skill.experience / SkillChartSystem.getRequiredXPForLevel(skill.level + 1)) * 100);
      
      // Enhanced progress calculation based on actual activities
      let activityBonus = 0;
      const recentActivities = gameState.recentActivity || [];
      const completedQuests = gameState.quests?.filter((q: any) => q.status === 'completed') || [];
      const healthActivities = gameState.customHealthActivities || [];
      
      // Count skill-relevant activities for last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentRelevantActivities = recentActivities.filter((a: any) => 
        new Date(a.timestamp) > thirtyDaysAgo
      );
      
      // Skill-specific progress calculation
      switch (skill.id) {
        case 'focus':
          activityBonus += recentRelevantActivities.filter((a: any) => 
            a.description.toLowerCase().includes('focus') || 
            a.description.toLowerCase().includes('concentrate') ||
            a.description.toLowerCase().includes('meditation') ||
            a.type === 'focus_session'
          ).length * 3;
          break;
        
        case 'exercise':
          activityBonus += recentRelevantActivities.filter((a: any) => 
            a.description.toLowerCase().includes('exercise') || 
            a.description.toLowerCase().includes('workout') ||
            a.description.toLowerCase().includes('physical') ||
            a.type === 'health_activity'
          ).length * 4;
          activityBonus += healthActivities.filter((h: any) => h.category === 'physical').length * 3;
          break;
        
        case 'learning':
          activityBonus += completedQuests.filter((q: any) => 
            q.category === 'learning' || 
            q.tags?.includes('education') ||
            q.tags?.includes('skill development') ||
            q.tags?.includes('reading')
          ).length * 5;
          break;
        
        case 'creativity':
          activityBonus += completedQuests.filter((q: any) => 
            q.category === 'creative' || 
            q.tags?.includes('creative') ||
            q.tags?.includes('art') ||
            q.tags?.includes('design')
          ).length * 6;
          break;
        
        case 'social':
          activityBonus += completedQuests.filter((q: any) => 
            q.category === 'social' || 
            q.tags?.includes('communication') ||
            q.tags?.includes('networking') ||
            q.tags?.includes('relationship')
          ).length * 4;
          break;
        
        case 'organization':
          activityBonus += completedQuests.filter((q: any) => 
            q.category === 'work' || q.category === 'personal' ||
            q.tags?.includes('planning') ||
            q.tags?.includes('organization') ||
            q.tags?.includes('productivity')
          ).length * 3;
          // Bonus for completing quests on time
          activityBonus += completedQuests.filter((q: any) => 
            q.estimatedTime && q.estimatedTime <= 30
          ).length * 2;
          break;
        
        case 'meditation':
          activityBonus += recentRelevantActivities.filter((a: any) => 
            a.description.toLowerCase().includes('meditat') || 
            a.description.toLowerCase().includes('mindful') ||
            a.description.toLowerCase().includes('breathing')
          ).length * 5;
          activityBonus += healthActivities.filter((h: any) => 
            h.category === 'mental' && h.name.toLowerCase().includes('meditat')
          ).length * 4;
          break;
        
        case 'resilience':
          // Big bonus for completing difficult tasks
          activityBonus += completedQuests.filter((q: any) => 
            q.difficultyLevel >= 4 || 
            q.anxietyLevel === 'daunting' ||
            q.priority === 'urgent'
          ).length * 8;
          // Bonus for maintaining streaks
          activityBonus += Math.min(20, gameState.player?.currentStreak || 0);
          break;
      }
      
      // Additional bonuses based on overall player progress
      const playerLevel = gameState.player?.level || 1;
      const levelBonus = Math.min(15, playerLevel * 0.5);
      
      // Cap the total progress at 100%
      const totalProgress = Math.min(100, baseProgress + activityBonus + levelBonus);
      return Math.max(8, totalProgress); // Minimum 8% for visibility
    };

    // Get detailed progress information for tooltips
    const getSkillProgressDetails = (skill: any) => {
      const completedQuests = gameState.quests?.filter((q: any) => q.status === 'completed') || [];
      const totalQuests = gameState.quests?.length || 1;
      const questCompletionRate = Math.round((completedQuests.length / totalQuests) * 100);
      
      const skillRelevantQuests = completedQuests.filter((q: any) => {
        const category = q.category?.toLowerCase() || '';
        const tags = q.tags?.join(' ').toLowerCase() || '';
        const skillKeywords = getSkillKeywords(skill.id);
        
        return skillKeywords.some(keyword => 
          category.includes(keyword) || tags.includes(keyword)
        );
      });
      
      return {
        relevantQuests: skillRelevantQuests.length,
        totalQuests: completedQuests.length,
        questCompletionRate,
        currentLevel: skill.level,
        experience: skill.experience,
        experienceNeeded: SkillChartSystem.getRequiredXPForLevel(skill.level + 1),
        realProgress: calculateSkillProgress(skill)
      };
    };

    // Get keywords for skill matching
    const getSkillKeywords = (skillId: string): string[] => {
      const keywordMap: Record<string, string[]> = {
        'focus': ['focus', 'concentrate', 'attention', 'meditation'],
        'exercise': ['exercise', 'workout', 'physical', 'fitness', 'health'],
        'learning': ['learning', 'education', 'study', 'skill', 'knowledge', 'reading'],
        'creativity': ['creative', 'art', 'design', 'innovation', 'artistic'],
        'social': ['social', 'communication', 'networking', 'relationship'],
        'organization': ['organization', 'planning', 'management', 'productivity'],
        'meditation': ['meditation', 'mindful', 'mental', 'relaxation'],
        'resilience': ['challenge', 'difficult', 'stress', 'overcome']
      };
      return keywordMap[skillId] || [];
    };
    
    // Generate hexagon triangular segments with ENHANCED PROGRESS
    const triangularSegments = skillsToShow.map((skill, index) => {
      const startAngle = index * angleStep - Math.PI / 2;
      const endAngle = (index + 1) * angleStep - Math.PI / 2;
      
      // Calculate REAL progress percentage (0-100)
      const realProgressPercent = calculateSkillProgress(skill);
      const progressRadius = maxRadius * (realProgressPercent / 100);
      
      // Get detailed progress information
      const progressDetails = getSkillProgressDetails(skill);
      
      // Points for the triangular segment
      const outerStart = {
        x: center + maxRadius * Math.cos(startAngle),
        y: center + maxRadius * Math.sin(startAngle)
      };
      const outerEnd = {
        x: center + maxRadius * Math.cos(endAngle),
        y: center + maxRadius * Math.sin(endAngle)
      };
      const progressStart = {
        x: center + progressRadius * Math.cos(startAngle),
        y: center + progressRadius * Math.sin(startAngle)
      };
      const progressEnd = {
        x: center + progressRadius * Math.cos(endAngle),
        y: center + progressRadius * Math.sin(endAngle)
      };
      
      // Label position (at 85% of max radius for better visibility)
      const labelAngle = startAngle + angleStep / 2;
      const labelRadius = maxRadius * 0.85;
      const labelPos = {
        x: center + labelRadius * Math.cos(labelAngle),
        y: center + labelRadius * Math.sin(labelAngle)
      };
      
      return {
        skill: {
          ...skill,
          realProgress: realProgressPercent,
          progressDetails
        },
        index,
        // Background triangle (full size)
        backgroundPath: `M ${center},${center} L ${outerStart.x},${outerStart.y} L ${outerEnd.x},${outerEnd.y} Z`,
        // Progress triangle (REAL skill progress)
        progressPath: `M ${center},${center} L ${progressStart.x},${progressStart.y} L ${progressEnd.x},${progressEnd.y} Z`,
        // Outline for the full triangle
        outlinePath: `M ${center},${center} L ${outerStart.x},${outerStart.y} L ${outerEnd.x},${outerEnd.y} Z`,
        labelPos,
        progressRadius,
        maxRadius,
        realProgressPercent
      };
    });
    
    return { triangularSegments };
  }, [topSkills, size, gameState]);

  const getProgressColor = (level: number): string => {
    if (level >= 80) return '#10b981'; // Green for high levels
    if (level >= 60) return '#3b82f6'; // Blue for good levels  
    if (level >= 40) return '#f59e0b'; // Orange for medium levels
    if (level >= 20) return '#eab308'; // Yellow for low levels
    return '#6b7280'; // Gray for very low levels
  };

  const getProgressIntensity = (progress: number): number => {
    return Math.max(0.3, Math.min(1.0, progress / 100));
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size}>
        <defs>
          {/* Enhanced gradients for each segment */}
          {hexagonData.triangularSegments.map((segment, index) => (
            <radialGradient key={index} id={`skillGradient-${index}`} cx="30%" cy="30%" r="70%">
              <stop 
                offset="0%" 
                stopColor={getProgressColor(segment.realProgressPercent)} 
                stopOpacity="0.8" 
              />
              <stop 
                offset="70%" 
                stopColor={getProgressColor(segment.realProgressPercent)} 
                stopOpacity="0.6" 
              />
              <stop 
                offset="100%" 
                stopColor={getProgressColor(segment.realProgressPercent)} 
                stopOpacity="0.3" 
              />
            </radialGradient>
          ))}
          
          {/* Glow effect for high-progress skills */}
          <filter id="skillGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Subtle animation for progress indicators */}
          <filter id="progressPulse" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge> 
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Render triangular segments with ENHANCED VISUALIZATION */}
        {hexagonData.triangularSegments.map((segment, index) => (
          <g key={index}>
            {/* Background triangle (outline) */}
            <path
              d={segment.backgroundPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gray-400 dark:text-gray-500"
              opacity={0.4}
            />
            
            {/* Progress triangle (filled based on REAL skill progress) */}
            {segment.realProgressPercent > 8 && (
              <path
                d={segment.progressPath}
                fill={`url(#skillGradient-${index})`}
                stroke={getProgressColor(segment.realProgressPercent)}
                strokeWidth="1.5"
                opacity={getProgressIntensity(segment.realProgressPercent)}
                className="transition-all duration-500 ease-in-out"
              />
            )}
            
            {/* Progress indicator ring (shows percentage) */}
            {segment.realProgressPercent > 15 && (
              <circle
                cx={segment.labelPos.x}
                cy={segment.labelPos.y}
                r="3"
                fill={getProgressColor(segment.realProgressPercent)}
                stroke="white"
                strokeWidth="1"
                className="drop-shadow-sm"
              />
            )}
            
            {/* Skill label and progress info */}
            {segment.skill.level > 0 && (
              <g className="pointer-events-none">
                {/* Skill icon and name */}
                <text
                  x={segment.labelPos.x}
                  y={segment.labelPos.y - 12}
                  textAnchor="middle"
                  className="text-xs font-bold fill-current text-gray-800 dark:text-gray-200"
                >
                  {segment.skill.icon}
                </text>
                <text
                  x={segment.labelPos.x}
                  y={segment.labelPos.y - 2}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-current text-gray-700 dark:text-gray-300"
                >
                  {segment.skill.name}
                </text>
                
                {/* Progress percentage and level */}
                <text
                  x={segment.labelPos.x}
                  y={segment.labelPos.y + 8}
                  textAnchor="middle"
                  className="text-xs font-bold fill-current"
                  fill={getProgressColor(segment.realProgressPercent)}
                >
                  {Math.round(segment.realProgressPercent)}%
                </text>
                <text
                  x={segment.labelPos.x}
                  y={segment.labelPos.y + 18}
                  textAnchor="middle"
                  className="text-xs font-medium fill-current text-gray-600 dark:text-gray-400"
                >
                  Lv {segment.skill.level}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Enhanced center circle with hexagon info */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="25"
          fill="white"
          stroke="#3b82f6"
          strokeWidth="3"
          className="drop-shadow-lg"
          filter="url(#skillGlow)"
        />
        
        {/* Center text for hexagon - Essential Info */}
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          className="text-sm font-bold fill-current text-blue-600 dark:text-blue-400"
        >
          Lv {skillChart.overallLevel}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 6}
          textAnchor="middle"
          className="text-xs font-medium fill-current text-gray-600 dark:text-gray-400"
        >
          Overall
        </text>
      </svg>
      
      {/* Professional UI Layout - No Overlapping Elements */}
      <div className="absolute inset-0 pointer-events-none">        
        {/* Progress Legend - Bottom Right */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200/30 dark:border-gray-600/30">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Expert</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Good</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Fair</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">Basic</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Info Panel - Top Right (no overlap with center) */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {topSkills.length} Active Skills
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 font-bold">
                {Math.round(hexagonData.triangularSegments.reduce((sum, seg) => sum + seg.realProgressPercent, 0) / hexagonData.triangularSegments.length)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Avg Progress
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Development Debug Panel - Positioned Outside Chart */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-4 left-0 right-0 mt-4">
          <div className="bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg p-3 shadow-xl border border-gray-700/50 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-yellow-300">🎯 Development Debug</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {hexagonData.triangularSegments.slice(0, 4).map((seg, i) => (
                <div key={i} className="bg-gray-800/50 rounded p-2">
                  <div className="font-medium text-yellow-300 text-xs mb-1">
                    {seg.skill.icon} {seg.skill.name}
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">
                      {Math.round(seg.realProgressPercent)}%
                    </span>
                    <span className="text-blue-400">
                      Lv {seg.skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-gray-400 text-xs">
              Real-time progress calculation active
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

// Export both components for external use

