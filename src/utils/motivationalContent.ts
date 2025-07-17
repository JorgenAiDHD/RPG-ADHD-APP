// UX/UI Enhancements - Motivational Content System v0.2
export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: 'focus' | 'productivity' | 'adhd' | 'learning' | 'mindfulness' | 'growth' | 'success';
  source?: string;
  tags?: string[];
}

export class MotivationalSystem {
  private static quotes: MotivationalQuote[] = [
    // Jim Kwik - Learning & Brain Training
    {
      id: 'kwik_1',
      text: 'Your brain is like a muscle. The more you challenge it, the stronger it becomes.',
      author: 'Jim Kwik',
      category: 'learning',
      source: 'Limitless',
      tags: ['brain', 'learning', 'growth']
    },
    {
      id: 'kwik_2',
      text: 'Small steps consistently taken will always outperform large steps sporadically taken.',
      author: 'Jim Kwik',
      category: 'productivity',
      source: 'Limitless',
      tags: ['consistency', 'progress', 'habits']
    },
    {
      id: 'kwik_3',
      text: 'Focus is not about saying yes to the thing you have to focus on. Focus is about saying no to the hundreds of other things.',
      author: 'Jim Kwik',
      category: 'focus',
      source: 'Limitless',
      tags: ['focus', 'attention', 'priorities']
    },

    // James Clear - Habits & Systems
    {
      id: 'clear_1',
      text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
      author: 'James Clear',
      category: 'productivity',
      source: 'Atomic Habits',
      tags: ['systems', 'habits', 'goals']
    },
    {
      id: 'clear_2',
      text: 'Every action you take is a vote for the type of person you wish to become.',
      author: 'James Clear',
      category: 'growth',
      source: 'Atomic Habits',
      tags: ['identity', 'actions', 'growth']
    },
    {
      id: 'clear_3',
      text: 'The difference between good days and bad days is how quickly you are able to get back on track.',
      author: 'James Clear',
      category: 'mindfulness',
      source: 'Atomic Habits',
      tags: ['resilience', 'recovery', 'consistency']
    },

    // Cal Newport - Deep Work & Focus
    {
      id: 'newport_1',
      text: 'Focus will become a superpower in the new economy.',
      author: 'Cal Newport',
      category: 'focus',
      source: 'Deep Work',
      tags: ['focus', 'attention', 'productivity']
    },
    {
      id: 'newport_2',
      text: 'The ability to quickly master hard things and the ability to produce at an elite level are crucial.',
      author: 'Cal Newport',
      category: 'learning',
      source: 'Deep Work',
      tags: ['mastery', 'learning', 'excellence']
    },
    {
      id: 'newport_3',
      text: 'Clarity about what matters provides clarity about what does not.',
      author: 'Cal Newport',
      category: 'focus',
      source: 'Digital Minimalism',
      tags: ['clarity', 'priorities', 'focus']
    },

    // ADHD-Specific Motivational Quotes
    {
      id: 'adhd_1',
      text: 'ADHD is not a disorder of attention. It is a disorder of attention regulation.',
      author: 'Dr. Russell Barkley',
      category: 'adhd',
      tags: ['adhd', 'understanding', 'awareness']
    },
    {
      id: 'adhd_2',
      text: 'Your ADHD brain is not broken. It just works differently, and that difference can be your superpower.',
      author: 'ADHD Community',
      category: 'adhd',
      tags: ['adhd', 'strengths', 'neurodiversity']
    },
    {
      id: 'adhd_3',
      text: 'Progress, not perfection. Every small step forward is a victory worth celebrating.',
      author: 'ADHD Wisdom',
      category: 'adhd',
      tags: ['adhd', 'progress', 'self-compassion']
    },

    // Tim Ferriss - Productivity & Optimization
    {
      id: 'ferriss_1',
      text: 'Focus on being productive instead of busy.',
      author: 'Tim Ferriss',
      category: 'productivity',
      source: 'The 4-Hour Workweek',
      tags: ['productivity', 'efficiency', 'focus']
    },
    {
      id: 'ferriss_2',
      text: 'What we fear doing most is usually what we most need to do.',
      author: 'Tim Ferriss',
      category: 'growth',
      source: 'The 4-Hour Workweek',
      tags: ['courage', 'growth', 'challenges']
    },

    // Mindfulness & Meditation
    {
      id: 'mindfulness_1',
      text: 'Wherever you are, be there totally.',
      author: 'Eckhart Tolle',
      category: 'mindfulness',
      source: 'The Power of Now',
      tags: ['presence', 'mindfulness', 'awareness']
    },
    {
      id: 'mindfulness_2',
      text: 'Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts.',
      author: 'Arianna Huffington',
      category: 'mindfulness',
      tags: ['meditation', 'thoughts', 'awareness']
    },

    // Success & Achievement
    {
      id: 'success_1',
      text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
      author: 'Winston Churchill',
      category: 'success',
      tags: ['persistence', 'courage', 'resilience']
    },
    {
      id: 'success_2',
      text: 'The only impossible journey is the one you never begin.',
      author: 'Tony Robbins',
      category: 'success',
      tags: ['action', 'beginning', 'possibility']
    }
  ];

  // Get random quote
  static getRandomQuote(): MotivationalQuote {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[randomIndex];
  }

  // Get quote by category
  static getQuoteByCategory(category: MotivationalQuote['category']): MotivationalQuote {
    const categoryQuotes = this.quotes.filter(quote => quote.category === category);
    if (categoryQuotes.length === 0) return this.getRandomQuote();
    
    const randomIndex = Math.floor(Math.random() * categoryQuotes.length);
    return categoryQuotes[randomIndex];
  }

  // Get quotes for specific context
  static getContextualQuote(context: 'quest_completion' | 'level_up' | 'streak_milestone' | 'challenge_start' | 'daily_greeting'): MotivationalQuote {
    switch (context) {
      case 'quest_completion':
        return this.getQuoteByCategory('success');
      case 'level_up':
        return this.getQuoteByCategory('growth');
      case 'streak_milestone':
        return this.getQuoteByCategory('productivity');
      case 'challenge_start':
        return this.getQuoteByCategory('focus');
      case 'daily_greeting':
        return this.getQuoteByCategory('mindfulness');
      default:
        return this.getRandomQuote();
    }
  }

  // Get quote for ADHD-specific moments
  static getADHDQuote(): MotivationalQuote {
    return this.getQuoteByCategory('adhd');
  }

  // Get all categories
  static getCategories(): MotivationalQuote['category'][] {
    return ['focus', 'productivity', 'adhd', 'learning', 'mindfulness', 'growth', 'success'];
  }

  // Search quotes
  static searchQuotes(query: string): MotivationalQuote[] {
    const searchLower = query.toLowerCase();
    return this.quotes.filter(quote => 
      quote.text.toLowerCase().includes(searchLower) ||
      quote.author.toLowerCase().includes(searchLower) ||
      quote.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
}

// Interactive Quizzes & Brain Training
export interface BrainTrainingQuiz {
  id: string;
  title: string;
  description: string;
  category: 'memory' | 'attention' | 'cognitive_flexibility' | 'working_memory' | 'processing_speed';
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  timeLimit?: number; // seconds
  xpReward: number;
  adhdBenefits: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'sequence' | 'pattern' | 'memory' | 'word_association';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  timeLimit?: number;
}

export class BrainTrainingSystem {
  private static quizzes: BrainTrainingQuiz[] = [
    {
      id: 'memory_sequence',
      title: 'Memory Sequence Challenge',
      description: 'Remember and repeat sequences of numbers or colors',
      category: 'memory',
      difficulty: 'medium',
      timeLimit: 300, // 5 minutes
      xpReward: 50,
      adhdBenefits: [
        'Improves working memory',
        'Enhances attention span',
        'Strengthens focus abilities'
      ],
      questions: [
        {
          id: 'seq_1',
          type: 'sequence',
          question: 'Remember this sequence: 3, 7, 1, 9, 4. What comes after 1?',
          correctAnswer: 9,
          timeLimit: 10
        },
        {
          id: 'seq_2',
          type: 'sequence',
          question: 'Color sequence: Red, Blue, Green, Yellow. What color comes after Green?',
          options: ['Red', 'Blue', 'Yellow', 'Purple'],
          correctAnswer: 'Yellow',
          timeLimit: 8
        }
      ]
    },
    {
      id: 'attention_focus',
      title: 'Attention Focus Training',
      description: 'Test and improve your sustained attention abilities',
      category: 'attention',
      difficulty: 'easy',
      timeLimit: 180, // 3 minutes
      xpReward: 30,
      adhdBenefits: [
        'Builds sustained attention',
        'Reduces distractibility',
        'Improves task completion'
      ],
      questions: [
        {
          id: 'att_1',
          type: 'multiple_choice',
          question: 'Which of these strategies helps maintain focus the longest?',
          options: [
            'Taking short breaks every 25 minutes',
            'Working for 3 hours straight',
            'Checking phone frequently',
            'Working with TV on'
          ],
          correctAnswer: 'Taking short breaks every 25 minutes',
          explanation: 'The Pomodoro Technique (25min work + 5min break) is scientifically proven to maintain focus.'
        }
      ]
    },
    {
      id: 'cognitive_flexibility',
      title: 'Mental Flexibility Gym',
      description: 'Train your brain to switch between different concepts and perspectives',
      category: 'cognitive_flexibility',
      difficulty: 'hard',
      timeLimit: 240, // 4 minutes
      xpReward: 75,
      adhdBenefits: [
        'Improves task switching',
        'Enhances problem-solving',
        'Reduces cognitive rigidity'
      ],
      questions: [
        {
          id: 'flex_1',
          type: 'word_association',
          question: 'What do these words have in common: Ocean, Sky, Sadness?',
          correctAnswer: 'Blue',
          explanation: 'All can be associated with the color blue - demonstrating cognitive flexibility in pattern recognition.'
        }
      ]
    }
  ];

  static getAllQuizzes(): BrainTrainingQuiz[] {
    return this.quizzes;
  }

  static getQuizByCategory(category: BrainTrainingQuiz['category']): BrainTrainingQuiz[] {
    return this.quizzes.filter(quiz => quiz.category === category);
  }

  static getRandomQuiz(): BrainTrainingQuiz {
    const randomIndex = Math.floor(Math.random() * this.quizzes.length);
    return this.quizzes[randomIndex];
  }

  static calculateScore(quiz: BrainTrainingQuiz, correctAnswers: number): {
    score: number;
    percentage: number;
    xpEarned: number;
    performance: 'excellent' | 'good' | 'average' | 'needs_improvement';
  } {
    const totalQuestions = quiz.questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    let xpMultiplier = 0.5; // Base 50% XP for attempting
    let performance: 'excellent' | 'good' | 'average' | 'needs_improvement' = 'needs_improvement';

    if (percentage >= 90) {
      xpMultiplier = 1.5;
      performance = 'excellent';
    } else if (percentage >= 75) {
      xpMultiplier = 1.2;
      performance = 'good';
    } else if (percentage >= 60) {
      xpMultiplier = 1.0;
      performance = 'average';
    }

    return {
      score: correctAnswers,
      percentage: Math.round(percentage),
      xpEarned: Math.round(quiz.xpReward * xpMultiplier),
      performance
    };
  }
}

// Music & Audio Integration
export interface AudioResource {
  id: string;
  title: string;
  description: string;
  category: 'nature_sounds' | 'focus_music' | 'meditation' | 'brown_noise' | 'binaural_beats';
  url: string;
  duration?: number; // minutes
  provider: 'mynoise' | 'youtube' | 'spotify' | 'freesound' | 'custom';
  adhdBenefits: string[];
  tags: string[];
}

export class AudioWellnessSystem {
  private static resources: AudioResource[] = [
    // Nature Sounds
    {
      id: 'rain_forest',
      title: 'Tropical Rainforest',
      description: 'Gentle rain with forest ambience for deep focus',
      category: 'nature_sounds',
      url: 'https://mynoise.net/NoiseMachines/rainNoiseGenerator.php',
      duration: 0, // Infinite loop
      provider: 'mynoise',
      adhdBenefits: [
        'Masks distracting noises',
        'Promotes calm focus',
        'Reduces anxiety'
      ],
      tags: ['rain', 'forest', 'ambient', 'focus']
    },
    {
      id: 'ocean_waves',
      title: 'Ocean Waves',
      description: 'Rhythmic ocean sounds for meditation and relaxation',
      category: 'nature_sounds',
      url: 'https://mynoise.net/NoiseMachines/oceanNoiseGenerator.php',
      provider: 'mynoise',
      adhdBenefits: [
        'Improves sleep quality',
        'Reduces hyperactivity',
        'Enhances relaxation'
      ],
      tags: ['ocean', 'waves', 'meditation', 'sleep']
    },

    // Focus Music
    {
      id: 'lofi_study',
      title: 'Lo-Fi Study Beats',
      description: 'Chill instrumental music perfect for studying and focus',
      category: 'focus_music',
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk', // Lo-fi study playlist
      duration: 180,
      provider: 'youtube',
      adhdBenefits: [
        'Maintains steady focus',
        'Reduces mental fatigue',
        'Improves task completion'
      ],
      tags: ['lofi', 'instrumental', 'study', 'concentration']
    },
    {
      id: 'brown_noise_focus',
      title: 'Brown Noise for ADHD',
      description: 'Deep, consistent brown noise scientifically proven to help ADHD focus',
      category: 'brown_noise',
      url: 'https://mynoise.net/NoiseMachines/brownianNoiseGenerator.php',
      provider: 'mynoise',
      adhdBenefits: [
        'Significantly improves ADHD focus',
        'Reduces cognitive load',
        'Minimizes external distractions'
      ],
      tags: ['brown-noise', 'adhd', 'focus', 'concentration']
    },

    // Meditation & Mindfulness
    {
      id: 'guided_meditation',
      title: '10-Minute ADHD Meditation',
      description: 'Specially designed meditation for ADHD minds',
      category: 'meditation',
      url: 'https://www.youtube.com/watch?v=meditation-adhd', // Placeholder
      duration: 10,
      provider: 'youtube',
      adhdBenefits: [
        'Builds attention muscle',
        'Reduces impulsivity',
        'Improves emotional regulation'
      ],
      tags: ['meditation', 'mindfulness', 'adhd', 'guided']
    },

    // Binaural Beats
    {
      id: 'alpha_waves',
      title: 'Alpha Wave Focus (10Hz)',
      description: 'Binaural beats to induce calm, focused state of mind',
      category: 'binaural_beats',
      url: 'https://mynoise.net/NoiseMachines/binauralBrainwaveGenerator.php',
      duration: 60,
      provider: 'mynoise',
      adhdBenefits: [
        'Promotes alpha brainwave state',
        'Enhances creative focus',
        'Reduces anxiety and stress'
      ],
      tags: ['binaural', 'alpha-waves', 'focus', 'creativity']
    }
  ];

  static getAllResources(): AudioResource[] {
    return this.resources;
  }

  static getResourcesByCategory(category: AudioResource['category']): AudioResource[] {
    return this.resources.filter(resource => resource.category === category);
  }

  static getResourcesForFocus(): AudioResource[] {
    return this.resources.filter(resource => 
      resource.category === 'focus_music' || 
      resource.category === 'brown_noise' ||
      resource.category === 'binaural_beats'
    );
  }

  static getResourcesForRelaxation(): AudioResource[] {
    return this.resources.filter(resource => 
      resource.category === 'nature_sounds' || 
      resource.category === 'meditation'
    );
  }

  static searchResources(query: string): AudioResource[] {
    const searchLower = query.toLowerCase();
    return this.resources.filter(resource => 
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
}
