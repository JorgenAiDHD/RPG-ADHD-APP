import React, { useMemo } from 'react';
import type { SkillChart } from '../types/game';

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
  
  const hexagonData = useMemo(() => {
    const angleStep = Math.PI / 3; // 60 degrees for hexagon
    const maxRadius = size / 2 - 20;
    const center = size / 2;
    
    // Generate background hexagon points (max radius)
    const backgroundHexPoints = Array.from({ length: 6 }, (_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = center + maxRadius * Math.cos(angle);
      const y = center + maxRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    
    // Generate skill level points
    const skillPoints = topSkills.map((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedLevel = Math.min(skill.level / 100, 1);
      const radius = maxRadius * normalizedLevel;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      return { x, y, skill };
    });
    
    // Fill remaining points if we have less than 6 skills
    while (skillPoints.length < 6) {
      const index = skillPoints.length;
      // Center point for empty skills
      skillPoints.push({ 
        x: center, 
        y: center, 
        skill: { 
          id: `empty-${index}`, 
          name: 'Empty', 
          level: 0, 
          experience: 0, 
          maxLevel: 100, 
          category: 'mental', 
          icon: '⚪', 
          description: 'No skill assigned' 
        } 
      });
    }
    
    const skillPath = skillPoints.map(point => `${point.x},${point.y}`).join(' ');
    
    return { skillPoints, skillPath, backgroundHexPoints };
  }, [topSkills, size]);
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'physical': return '#ef4444';
      case 'mental': return '#3b82f6';
      case 'social': return '#10b981';
      case 'creative': return '#8b5cf6';
      case 'technical': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size}>
        {/* Background hexagon */}
        <polygon
          points={hexagonData.backgroundHexPoints}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-200 dark:text-gray-700"
          opacity={0.3}
        />
        
        {/* Skill area */}
        <polygon
          points={hexagonData.skillPath}
          fill="url(#hexGradient)"
          stroke="#3b82f6"
          strokeWidth="2"
          opacity={0.6}
        />
        
        {/* Skill points */}
        {hexagonData.skillPoints.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill={getCategoryColor(point.skill.category)}
              stroke="white"
              strokeWidth="1"
            />
            {/* Skill labels */}
            {point.skill.level > 0 && (
              <text
                x={point.x}
                y={point.y - 8}
                textAnchor="middle"
                className="text-xs font-medium fill-current text-gray-600 dark:text-gray-400"
              >
                {point.skill.name}
              </text>
            )}
          </g>
        ))}
        
        <defs>
          <radialGradient id="hexGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Center display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
            Lv {skillChart.overallLevel}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {topSkills.length} Skills
          </div>
        </div>
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
          Skills: {skillChart.skills.length} | Top: {topSkills.length}
        </div>
      )}
    </div>
  );
};
