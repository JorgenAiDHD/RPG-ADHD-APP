// Quest templates for quick creation
export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'personal' | 'health' | 'learning' | 'creative' | 'social';
  type: 'main' | 'side' | 'daily' | 'weekly';
  xpReward: number;
  goldReward: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: number;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  energyRequired: 'low' | 'medium' | 'high';
  anxietyLevel: 'comfortable' | 'mild' | 'challenging' | 'daunting';
  tags: string[];
  icon: string;
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Work Templates
  {
    id: 'work_daily_standup',
    title: 'Attend Daily Standup',
    description: 'Participate in team daily standup meeting',
    category: 'work',
    type: 'daily',
    xpReward: 15,
    goldReward: 3,
    priority: 'medium',
    estimatedTime: 15,
    difficultyLevel: 1,
    energyRequired: 'low',
    anxietyLevel: 'comfortable',
    tags: ['meeting', 'team', 'communication'],
    icon: '💼'
  },
  {
    id: 'work_complete_project',
    title: 'Complete Project Milestone',
    description: 'Finish a significant project milestone or deliverable',
    category: 'work',
    type: 'main',
    xpReward: 100,
    goldReward: 25,
    priority: 'high',
    estimatedTime: 240,
    difficultyLevel: 4,
    energyRequired: 'high',
    anxietyLevel: 'challenging',
    tags: ['project', 'milestone', 'delivery'],
    icon: '🎯'
  },
  {
    id: 'work_email_cleanup',
    title: 'Clean Email Inbox',
    description: 'Process and organize email inbox to zero',
    category: 'work',
    type: 'side',
    xpReward: 20,
    goldReward: 5,
    priority: 'low',
    estimatedTime: 30,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'mild',
    tags: ['organization', 'productivity', 'email'],
    icon: '📧'
  },

  // Health Templates
  {
    id: 'health_morning_workout',
    title: 'Morning Workout',
    description: 'Complete 30-minute morning exercise routine',
    category: 'health',
    type: 'daily',
    xpReward: 30,
    goldReward: 8,
    priority: 'high',
    estimatedTime: 30,
    difficultyLevel: 3,
    energyRequired: 'high',
    anxietyLevel: 'mild',
    tags: ['exercise', 'fitness', 'morning'],
    icon: '💪'
  },
  {
    id: 'health_drink_water',
    title: 'Drink 8 Glasses of Water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    type: 'daily',
    xpReward: 10,
    goldReward: 2,
    priority: 'medium',
    estimatedTime: 5,
    difficultyLevel: 1,
    energyRequired: 'low',
    anxietyLevel: 'comfortable',
    tags: ['hydration', 'health', 'wellness'],
    icon: '💧'
  },
  {
    id: 'health_meditation',
    title: '10-Minute Meditation',
    description: 'Practice mindfulness meditation for mental clarity',
    category: 'health',
    type: 'daily',
    xpReward: 25,
    goldReward: 6,
    priority: 'medium',
    estimatedTime: 10,
    difficultyLevel: 2,
    energyRequired: 'low',
    anxietyLevel: 'comfortable',
    tags: ['mindfulness', 'mental health', 'meditation'],
    icon: '🧘'
  },

  // Learning Templates
  {
    id: 'learning_read_article',
    title: 'Read Educational Article',
    description: 'Read and summarize one educational article or blog post',
    category: 'learning',
    type: 'daily',
    xpReward: 20,
    goldReward: 5,
    priority: 'medium',
    estimatedTime: 20,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'comfortable',
    tags: ['reading', 'education', 'knowledge'],
    icon: '📚'
  },
  {
    id: 'learning_online_course',
    title: 'Complete Course Module',
    description: 'Finish one module of an online course',
    category: 'learning',
    type: 'side',
    xpReward: 50,
    goldReward: 12,
    priority: 'medium',
    estimatedTime: 60,
    difficultyLevel: 3,
    energyRequired: 'medium',
    anxietyLevel: 'mild',
    tags: ['course', 'skill development', 'learning'],
    icon: '🎓'
  },
  {
    id: 'learning_practice_language',
    title: 'Language Practice',
    description: 'Practice foreign language for 15 minutes',
    category: 'learning',
    type: 'daily',
    xpReward: 15,
    goldReward: 4,
    priority: 'low',
    estimatedTime: 15,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'comfortable',
    tags: ['language', 'practice', 'communication'],
    icon: '🗣️'
  },

  // Personal Templates
  {
    id: 'personal_clean_room',
    title: 'Organize Living Space',
    description: 'Clean and organize your room or workspace',
    category: 'personal',
    type: 'side',
    xpReward: 25,
    goldReward: 6,
    priority: 'medium',
    estimatedTime: 45,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'mild',
    tags: ['organization', 'cleaning', 'environment'],
    icon: '🏠'
  },
  {
    id: 'personal_gratitude_journal',
    title: 'Write Gratitude Journal',
    description: 'Write down 3 things you are grateful for today',
    category: 'personal',
    type: 'daily',
    xpReward: 15,
    goldReward: 3,
    priority: 'low',
    estimatedTime: 5,
    difficultyLevel: 1,
    energyRequired: 'low',
    anxietyLevel: 'comfortable',
    tags: ['gratitude', 'reflection', 'mental health'],
    icon: '🙏'
  },
  {
    id: 'personal_meal_prep',
    title: 'Meal Preparation',
    description: 'Prepare healthy meals for the next day',
    category: 'personal',
    type: 'weekly',
    xpReward: 40,
    goldReward: 10,
    priority: 'medium',
    estimatedTime: 90,
    difficultyLevel: 3,
    energyRequired: 'medium',
    anxietyLevel: 'mild',
    tags: ['cooking', 'health', 'preparation'],
    icon: '🍳'
  },

  // Creative Templates
  {
    id: 'creative_sketch',
    title: 'Daily Sketch',
    description: 'Draw or sketch for 15 minutes',
    category: 'creative',
    type: 'daily',
    xpReward: 20,
    goldReward: 5,
    priority: 'low',
    estimatedTime: 15,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'comfortable',
    tags: ['art', 'creativity', 'drawing'],
    icon: '🎨'
  },
  {
    id: 'creative_write_story',
    title: 'Creative Writing',
    description: 'Write 500 words of creative content',
    category: 'creative',
    type: 'side',
    xpReward: 35,
    goldReward: 8,
    priority: 'low',
    estimatedTime: 30,
    difficultyLevel: 3,
    energyRequired: 'medium',
    anxietyLevel: 'mild',
    tags: ['writing', 'creativity', 'storytelling'],
    icon: '✍️'
  },

  // Social Templates
  {
    id: 'social_call_friend',
    title: 'Call a Friend',
    description: 'Have a meaningful conversation with a friend or family member',
    category: 'social',
    type: 'side',
    xpReward: 30,
    goldReward: 7,
    priority: 'medium',
    estimatedTime: 20,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'mild',
    tags: ['friendship', 'communication', 'social'],
    icon: '📞'
  },
  {
    id: 'social_help_someone',
    title: 'Help Someone',
    description: 'Do something kind or helpful for another person',
    category: 'social',
    type: 'daily',
    xpReward: 25,
    goldReward: 6,
    priority: 'low',
    estimatedTime: 15,
    difficultyLevel: 2,
    energyRequired: 'medium',
    anxietyLevel: 'comfortable',
    tags: ['kindness', 'helping', 'community'],
    icon: '🤝'
  }
];

// Get templates by category
export const getTemplatesByCategory = (category: string): QuestTemplate[] => {
  return QUEST_TEMPLATES.filter(template => template.category === category);
};

// Get random template
export const getRandomTemplate = (): QuestTemplate => {
  return QUEST_TEMPLATES[Math.floor(Math.random() * QUEST_TEMPLATES.length)];
};

// Get template by id
export const getTemplateById = (id: string): QuestTemplate | undefined => {
  return QUEST_TEMPLATES.find(template => template.id === id);
};
