import type { HealthActivityType } from '../types/game';

// Enhanced health activities with Energy system for v0.2
export const DEFAULT_HEALTH_ACTIVITIES: HealthActivityType[] = [
  // Pozytywne aktywności (Health + Energy)
  { 
    id: 'meditation', 
    name: '10-min Meditation', 
    healthChangeAmount: 15, 
    energyChangeAmount: 10,
    xpChangeAmount: 5, 
    category: 'mental', 
    duration: 10, 
    description: 'Calm your mind and reduce stress', 
    icon: '🧘', 
    isPositive: true,
    reducesAnxiety: true
  },
  { 
    id: 'nature_walk', 
    name: 'Nature Walk', 
    healthChangeAmount: 10, 
    energyChangeAmount: 15,
    xpChangeAmount: 5, 
    category: 'physical', 
    duration: 20, 
    description: 'Get fresh air and gentle movement', 
    icon: '🚶', 
    isPositive: true,
    affectsMood: true
  },
  { 
    id: 'good_sleep', 
    name: 'Full Night Sleep', 
    healthChangeAmount: 20, 
    energyChangeAmount: 25,
    xpChangeAmount: 10, 
    category: 'physical', 
    duration: 480, 
    description: '7-8 hours of quality sleep', 
    icon: '😴', 
    isPositive: true
  },
  { 
    id: 'exercise', 
    name: 'Exercise Session', 
    healthChangeAmount: 15, 
    energyChangeAmount: 20,
    xpChangeAmount: 8, 
    category: 'physical', 
    duration: 30, 
    description: 'Any form of physical exercise', 
    icon: '💪', 
    isPositive: true,
    affectsMood: true
  },
  { 
    id: 'social_connection', 
    name: 'Quality Social Time', 
    healthChangeAmount: 12, 
    energyChangeAmount: 8,
    xpChangeAmount: 7, 
    category: 'social', 
    duration: 60, 
    description: 'Meaningful conversation with someone', 
    icon: '👥', 
    isPositive: true,
    affectsMood: true,
    reducesAnxiety: true
  },
  { 
    id: 'creative_activity', 
    name: 'Creative Expression', 
    healthChangeAmount: 10, 
    energyChangeAmount: 12,
    xpChangeAmount: 7, 
    category: 'creative', 
    duration: 30, 
    description: 'Art, music, writing, or crafts', 
    icon: '🎨', 
    isPositive: true,
    affectsMood: true
  },
  { 
    id: 'healthy_meal', 
    name: 'Nutritious Meal', 
    healthChangeAmount: 8, 
    energyChangeAmount: 5,
    xpChangeAmount: 3, 
    category: 'physical', 
    duration: 15, 
    description: 'Balanced, wholesome food', 
    icon: '🥗', 
    isPositive: true
  },
  { 
    id: 'learning', 
    name: 'Learning Session', 
    healthChangeAmount: 10, 
    energyChangeAmount: -5,
    xpChangeAmount: 8, 
    category: 'mental', 
    duration: 45, 
    description: 'Engaging with new knowledge', 
    icon: '📚', 
    isPositive: true
  },
  
  // Negatywne aktywności (Health - Energy -)
  { 
    id: 'social_media_binge', 
    name: 'Social Media Binge', 
    healthChangeAmount: -8, 
    energyChangeAmount: -12,
    xpChangeAmount: -5, 
    category: 'mental', 
    duration: 60, 
    description: 'Extended mindless scrolling', 
    icon: '📱', 
    isPositive: false
  },
  { 
    id: 'poor_sleep', 
    name: 'Poor Sleep Night', 
    healthChangeAmount: -15, 
    energyChangeAmount: -25,
    xpChangeAmount: -10, 
    category: 'physical', 
    duration: 0, 
    description: 'Less than 5 hours or restless sleep', 
    icon: '😵', 
    isPositive: false
  },
  { 
    id: 'junk_food', 
    name: 'Junk Food Binge', 
    healthChangeAmount: -5, 
    energyChangeAmount: -8,
    xpChangeAmount: -3, 
    category: 'physical', 
    duration: 0, 
    description: 'Excessive processed or sugary food', 
    icon: '🍟', 
    isPositive: false
  },
  { 
    id: 'isolation', 
    name: 'Social Isolation', 
    healthChangeAmount: -10, 
    energyChangeAmount: -6,
    xpChangeAmount: -5, 
    category: 'social', 
    duration: 0, 
    description: 'Avoiding social connections', 
    icon: '😔', 
    isPositive: false
  },
  { 
    id: 'overwork', 
    name: 'Overworking', 
    healthChangeAmount: -12, 
    energyChangeAmount: -20,
    xpChangeAmount: -7, 
    category: 'mental', 
    duration: 0, 
    description: 'Working beyond healthy limits', 
    icon: '😤', 
    isPositive: false
  },
  { 
    id: 'procrastination_spiral', 
    name: 'Procrastination Spiral', 
    healthChangeAmount: -8, 
    energyChangeAmount: -10,
    xpChangeAmount: -5, 
    category: 'mental', 
    duration: 0, 
    description: 'Avoiding important tasks', 
    icon: '⏰', 
    isPositive: false
  }
];
