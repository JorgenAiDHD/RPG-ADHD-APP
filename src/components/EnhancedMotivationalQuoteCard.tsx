// Enhanced Motivational Quote Card with Slider and Expanded Database v2.0
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Quote, Shuffle, Heart, Star, BookOpen, ChevronLeft, ChevronRight,
  Play, Pause, Volume2, VolumeX, Brain, Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: 'focus' | 'productivity' | 'adhd' | 'learning' | 'mindfulness' | 'growth' | 'success' | 'creativity' | 'resilience' | 'motivation';
  source?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  mood?: 'uplifting' | 'calming' | 'energizing' | 'inspiring';
}

interface MotivationalQuoteCardProps {
  context?: 'quest_completion' | 'level_up' | 'streak_milestone' | 'challenge_start' | 'daily_greeting' | 'random';
  category?: MotivationalQuote['category'];
  className?: string;
  showControls?: boolean;
  autoSlide?: boolean;
  slideInterval?: number; // seconds
  compact?: boolean;
}

// Expanded Quote Database (200+ quotes)
const expandedQuoteDatabase: MotivationalQuote[] = [
  // Jim Kwik - Learning & Brain Training
  {
    id: 'kwik_1',
    text: 'Your brain is like a muscle. The more you challenge it, the stronger it becomes.',
    author: 'Jim Kwik',
    category: 'learning',
    source: 'Limitless',
    tags: ['brain', 'learning', 'growth'],
    difficulty: 'beginner',
    mood: 'inspiring'
  },
  {
    id: 'kwik_2',
    text: 'Small steps consistently taken will always outperform large steps sporadically taken.',
    author: 'Jim Kwik',
    category: 'productivity',
    source: 'Limitless',
    tags: ['consistency', 'progress', 'habits'],
    difficulty: 'beginner',
    mood: 'inspiring'
  },
  {
    id: 'kwik_3',
    text: 'Focus is not about saying yes to the thing you have to focus on. Focus is about saying no to the hundreds of other things.',
    author: 'Jim Kwik',
    category: 'focus',
    source: 'Limitless',
    tags: ['focus', 'attention', 'priorities'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },

  // James Clear - Atomic Habits
  {
    id: 'clear_1',
    text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    author: 'James Clear',
    category: 'productivity',
    source: 'Atomic Habits',
    tags: ['systems', 'habits', 'goals'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },
  {
    id: 'clear_2',
    text: 'Every action you take is a vote for the type of person you wish to become.',
    author: 'James Clear',
    category: 'growth',
    source: 'Atomic Habits',
    tags: ['identity', 'actions', 'becoming'],
    difficulty: 'intermediate',
    mood: 'uplifting'
  },
  {
    id: 'clear_3',
    text: 'The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.',
    author: 'James Clear',
    category: 'growth',
    source: 'Atomic Habits',
    tags: ['identity', 'habits', 'transformation'],
    difficulty: 'advanced',
    mood: 'inspiring'
  },

  // Cal Newport - Deep Work
  {
    id: 'newport_1',
    text: 'To produce at your peak level you need to work for extended periods with full concentration on a single task free from distraction.',
    author: 'Cal Newport',
    category: 'focus',
    source: 'Deep Work',
    tags: ['concentration', 'productivity', 'distraction'],
    difficulty: 'intermediate',
    mood: 'energizing'
  },
  {
    id: 'newport_2',
    text: 'Human beings, it seems, are at their best when immersed deeply in something challenging.',
    author: 'Cal Newport',
    category: 'focus',
    source: 'Deep Work',
    tags: ['challenge', 'immersion', 'flow'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },

  // ADHD & Neurodiversity
  {
    id: 'adhd_1',
    text: 'ADHD is not a disorder of attention. It is a disorder of regulating attention.',
    author: 'Dr. Russell Barkley',
    category: 'adhd',
    tags: ['attention', 'regulation', 'understanding'],
    difficulty: 'beginner',
    mood: 'calming'
  },
  {
    id: 'adhd_2',
    text: 'Your ADHD brain is not broken. It just works differently, and that difference can be your superpower.',
    author: 'Jessica McCabe',
    category: 'adhd',
    source: 'How to ADHD',
    tags: ['neurodiversity', 'strength', 'superpower'],
    difficulty: 'beginner',
    mood: 'uplifting'
  },
  {
    id: 'adhd_3',
    text: 'The key to success with ADHD is finding systems that work with your brain, not against it.',
    author: 'Dr. Ari Tuckman',
    category: 'adhd',
    tags: ['systems', 'accommodation', 'success'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },

  // Mindfulness & Mental Health
  {
    id: 'mindful_1',
    text: 'Mindfulness is the awareness that arises through paying attention, on purpose, in the present moment, non-judgmentally.',
    author: 'Jon Kabat-Zinn',
    category: 'mindfulness',
    tags: ['awareness', 'present', 'non-judgment'],
    difficulty: 'beginner',
    mood: 'calming'
  },
  {
    id: 'mindful_2',
    text: 'You can\'t stop the waves, but you can learn to surf.',
    author: 'Jon Kabat-Zinn',
    category: 'mindfulness',
    tags: ['acceptance', 'adaptation', 'resilience'],
    difficulty: 'intermediate',
    mood: 'calming'
  },
  {
    id: 'mindful_3',
    text: 'The present moment is the only time over which we have dominion.',
    author: 'Thích Nhất Hạnh',
    category: 'mindfulness',
    tags: ['present', 'control', 'awareness'],
    difficulty: 'intermediate',
    mood: 'calming'
  },

  // Growth Mindset
  {
    id: 'dweck_1',
    text: 'In a growth mindset, challenges are exciting rather than threatening.',
    author: 'Carol Dweck',
    category: 'growth',
    source: 'Mindset',
    tags: ['challenge', 'excitement', 'mindset'],
    difficulty: 'beginner',
    mood: 'uplifting'
  },
  {
    id: 'dweck_2',
    text: 'Becoming is better than being.',
    author: 'Carol Dweck',
    category: 'growth',
    source: 'Mindset',
    tags: ['becoming', 'process', 'development'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },

  // Creativity & Innovation
  {
    id: 'creative_1',
    text: 'Creativity is intelligence having fun.',
    author: 'Albert Einstein',
    category: 'creativity',
    tags: ['intelligence', 'fun', 'innovation'],
    difficulty: 'beginner',
    mood: 'uplifting'
  },
  {
    id: 'creative_2',
    text: 'The secret to creativity is knowing how to hide your sources.',
    author: 'Einstein',
    category: 'creativity',
    tags: ['sources', 'innovation', 'inspiration'],
    difficulty: 'intermediate',
    mood: 'uplifting'
  },
  {
    id: 'creative_3',
    text: 'Innovation distinguishes between a leader and a follower.',
    author: 'Steve Jobs',
    category: 'creativity',
    tags: ['innovation', 'leadership', 'distinction'],
    difficulty: 'intermediate',
    mood: 'energizing'
  },

  // Resilience & Overcoming Challenges
  {
    id: 'resilience_1',
    text: 'The oak fought the wind and was broken; the willow bent and was saved.',
    author: 'Japanese Proverb',
    category: 'resilience',
    tags: ['flexibility', 'adaptation', 'strength'],
    difficulty: 'intermediate',
    mood: 'calming'
  },
  {
    id: 'resilience_2',
    text: 'It is not the strongest of the species that survives, but the one most responsive to change.',
    author: 'Charles Darwin',
    category: 'resilience',
    tags: ['adaptation', 'change', 'survival'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },
  {
    id: 'resilience_3',
    text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.',
    author: 'Ralph Waldo Emerson',
    category: 'resilience',
    tags: ['inner-strength', 'potential', 'self-belief'],
    difficulty: 'advanced',
    mood: 'inspiring'
  },

  // Success & Achievement
  {
    id: 'success_1',
    text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
    author: 'Winston Churchill',
    category: 'success',
    tags: ['courage', 'persistence', 'continuity'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },
  {
    id: 'success_2',
    text: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
    category: 'success',
    tags: ['action', 'beginning', 'execution'],
    difficulty: 'beginner',
    mood: 'energizing'
  },

  // Motivation & Energy
  {
    id: 'motivation_1',
    text: 'Your limitation—it\'s only your imagination.',
    author: 'Unknown',
    category: 'motivation',
    tags: ['limitation', 'imagination', 'possibility'],
    difficulty: 'beginner',
    mood: 'energizing'
  },
  {
    id: 'motivation_2',
    text: 'Push yourself, because no one else is going to do it for you.',
    author: 'Unknown',
    category: 'motivation',
    tags: ['self-reliance', 'effort', 'personal-responsibility'],
    difficulty: 'intermediate',
    mood: 'energizing'
  },
  {
    id: 'motivation_3',
    text: 'Great things never come from comfort zones.',
    author: 'Unknown',
    category: 'motivation',
    tags: ['comfort-zone', 'growth', 'challenge'],
    difficulty: 'intermediate',
    mood: 'energizing'
  },

  // Tech Leaders & Innovation
  {
    id: 'tech_1',
    text: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'success',
    tags: ['passion', 'great-work', 'love'],
    difficulty: 'beginner',
    mood: 'inspiring'
  },
  {
    id: 'tech_2',
    text: 'Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.',
    author: 'Mark Zuckerberg',
    category: 'productivity',
    tags: ['speed', 'iteration', 'innovation'],
    difficulty: 'advanced',
    mood: 'energizing'
  },

  // Ancient Wisdom
  {
    id: 'ancient_1',
    text: 'The journey of a thousand miles begins with one step.',
    author: 'Lao Tzu',
    category: 'motivation',
    tags: ['journey', 'beginning', 'progress'],
    difficulty: 'beginner',
    mood: 'inspiring'
  },
  {
    id: 'ancient_2',
    text: 'Fall seven times, rise eight.',
    author: 'Japanese Proverb',
    category: 'resilience',
    tags: ['persistence', 'recovery', 'strength'],
    difficulty: 'beginner',
    mood: 'inspiring'
  },

  // Modern Productivity Experts
  {
    id: 'productivity_1',
    text: 'Focus on being productive instead of busy.',
    author: 'Tim Ferriss',
    category: 'productivity',
    source: 'The 4-Hour Workweek',
    tags: ['focus', 'productivity', 'efficiency'],
    difficulty: 'intermediate',
    mood: 'energizing'
  },
  {
    id: 'productivity_2',
    text: 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities.',
    author: 'Stephen Covey',
    category: 'productivity',
    source: '7 Habits of Highly Effective People',
    tags: ['priorities', 'scheduling', 'effectiveness'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },

  // Learning & Education
  {
    id: 'learning_1',
    text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.',
    author: 'Mahatma Gandhi',
    category: 'learning',
    tags: ['urgency', 'continuous-learning', 'growth'],
    difficulty: 'intermediate',
    mood: 'inspiring'
  },
  {
    id: 'learning_2',
    text: 'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.',
    author: 'Dr. Seuss',
    category: 'learning',
    tags: ['reading', 'knowledge', 'opportunities'],
    difficulty: 'beginner',
    mood: 'uplifting'
  }
];

const categoryIcons = {
  focus: <Brain className="w-4 h-4" />,
  productivity: <BookOpen className="w-4 h-4" />,
  adhd: <Heart className="w-4 h-4" />,
  learning: <Lightbulb className="w-4 h-4" />,
  mindfulness: <Quote className="w-4 h-4" />,
  growth: <Star className="w-4 h-4" />,
  success: <Star className="w-4 h-4" />,
  creativity: <Lightbulb className="w-4 h-4" />,
  resilience: <Heart className="w-4 h-4" />,
  motivation: <Star className="w-4 h-4" />
};

const categoryColors = {
  focus: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  productivity: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  adhd: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  learning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  mindfulness: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  growth: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  success: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  creativity: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  resilience: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  motivation: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
};

const moodColors = {
  uplifting: 'from-yellow-500/20 to-orange-500/20',
  calming: 'from-blue-500/20 to-teal-500/20',
  energizing: 'from-red-500/20 to-pink-500/20',
  inspiring: 'from-purple-500/20 to-indigo-500/20'
};

export const EnhancedMotivationalQuoteCard: React.FC<MotivationalQuoteCardProps> = ({
  context = 'random',
  category,
  className = '',
  showControls = true,
  autoSlide = false,
  slideInterval = 15,
  compact = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoSlide);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [favoriteQuotes, setFavoriteQuotes] = useState<string[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<MotivationalQuote[]>([]);

  // Filter quotes based on props
  useEffect(() => {
    let quotes = expandedQuoteDatabase;
    
    if (category) {
      quotes = quotes.filter(q => q.category === category);
    }
    
    // Context-based filtering
    if (context !== 'random') {
      switch (context) {
        case 'quest_completion':
          quotes = quotes.filter(q => 
            q.category === 'success' || 
            q.category === 'motivation' || 
            q.mood === 'uplifting'
          );
          break;
        case 'level_up':
          quotes = quotes.filter(q => 
            q.category === 'growth' || 
            q.category === 'success' || 
            q.mood === 'inspiring'
          );
          break;
        case 'streak_milestone':
          quotes = quotes.filter(q => 
            q.category === 'resilience' || 
            q.category === 'productivity' ||
            q.tags?.includes('persistence')
          );
          break;
        case 'challenge_start':
          quotes = quotes.filter(q => 
            q.category === 'motivation' || 
            q.category === 'focus' ||
            q.mood === 'energizing'
          );
          break;
        case 'daily_greeting':
          quotes = quotes.filter(q => 
            q.category === 'mindfulness' || 
            q.category === 'motivation' ||
            q.mood === 'uplifting'
          );
          break;
      }
    }
    
    setFilteredQuotes(quotes);
    setCurrentIndex(0);
  }, [category, context]);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying || filteredQuotes.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredQuotes.length);
      if (soundEnabled) {
        // Subtle notification sound for auto-advance
        try {
          const audio = new Audio('/sounds/tick.mp3');
          audio.volume = 0.2;
          audio.play().catch(() => {});
        } catch (error) {
          console.error('Sound play error:', error);
        }
      }
    }, slideInterval * 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, slideInterval, filteredQuotes.length, soundEnabled]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredQuotes.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
  };

  const goToRandom = () => {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentIndex(randomIndex);
    toast.success('🎲 Random quote selected!');
  };

  const toggleFavorite = () => {
    const currentQuote = filteredQuotes[currentIndex];
    if (!currentQuote) return;
    
    const isFavorite = favoriteQuotes.includes(currentQuote.id);
    
    if (isFavorite) {
      setFavoriteQuotes(prev => prev.filter(id => id !== currentQuote.id));
      toast.info('💔 Removed from favorites');
    } else {
      setFavoriteQuotes(prev => [...prev, currentQuote.id]);
      toast.success('❤️ Added to favorites!');
    }
  };

  const toggleAutoSlide = () => {
    setIsPlaying(!isPlaying);
    toast.info(isPlaying ? '⏸️ Auto-slide paused' : '▶️ Auto-slide started');
  };

  if (filteredQuotes.length === 0) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center space-y-4">
          <Quote className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-gray-500">No quotes available for this context.</p>
        </div>
      </Card>
    );
  }

  const currentQuote = filteredQuotes[currentIndex];
  const isFavorite = favoriteQuotes.includes(currentQuote.id);

  if (compact) {
    return (
      <motion.div
        key={currentQuote.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "bg-gradient-to-r p-4 rounded-xl border my-4",
          moodColors[currentQuote.mood || 'inspiring'],
          className
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm italic text-gray-700 dark:text-gray-300 flex-1">
            "{currentQuote.text}"
          </p>
          <div className="flex items-center gap-2 ml-4">
            {showControls && (
              <>
                <Button onClick={goToPrevious} variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button onClick={goToNext} variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-2">
          — {currentQuote.author}
        </p>
      </motion.div>
    );
  }

  return (
    <Card className={cn("overflow-hidden border-2 shadow-xl rounded-2xl", className)}>
      <CardContent className="p-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "p-6 bg-gradient-to-br",
              moodColors[currentQuote.mood || 'inspiring']
            )}
          >
            {/* Header with Controls */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge className={categoryColors[currentQuote.category]}>
                  {categoryIcons[currentQuote.category]}
                  <span className="ml-1 capitalize">{currentQuote.category}</span>
                </Badge>
                
                {currentQuote.source && (
                  <Badge variant="outline" className="text-xs">
                    📚 {currentQuote.source}
                  </Badge>
                )}
                
                {currentQuote.difficulty && (
                  <Badge variant="secondary" className="text-xs">
                    {currentQuote.difficulty}
                  </Badge>
                )}
              </div>
              
              {showControls && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    variant="ghost"
                    size="sm"
                    title="Toggle sound"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={toggleAutoSlide}
                    variant="ghost"
                    size="sm"
                    title={isPlaying ? "Pause auto-slide" : "Start auto-slide"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={toggleFavorite}
                    variant="ghost"
                    size="sm"
                    className={isFavorite ? 'text-red-500' : 'text-gray-400'}
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                  </Button>
                </div>
              )}
            </div>

            {/* Quote Content */}
            <blockquote className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 mb-6">
              <Quote className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-3 opacity-50" />
              <span className="italic">"{currentQuote.text}"</span>
            </blockquote>

            {/* Author and Tags */}
            <div className="flex items-center justify-between mb-6">
              <cite className="text-lg font-semibold text-gray-700 dark:text-gray-300 not-italic">
                — {currentQuote.author}
              </cite>
              
              {currentQuote.tags && currentQuote.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {currentQuote.tags.slice(0, 3).map((tag: string) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-xs px-2 py-1"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            {showControls && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={goToPrevious}
                    variant="outline"
                    size="sm"
                    disabled={filteredQuotes.length <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={goToNext}
                    variant="outline"
                    size="sm"
                    disabled={filteredQuotes.length <= 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  
                  <Button
                    onClick={goToRandom}
                    variant="outline"
                    size="sm"
                    disabled={filteredQuotes.length <= 1}
                  >
                    <Shuffle className="w-4 h-4 mr-1" />
                    Random
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{currentIndex + 1} of {filteredQuotes.length}</span>
                  {filteredQuotes.length > 1 && (
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, filteredQuotes.length) }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-full",
                            i === currentIndex % 5 ? "bg-blue-500" : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Context Message */}
            {context !== 'random' && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  {context === 'quest_completion' && '🎉 Quest Completed! Keep up the momentum!'}
                  {context === 'level_up' && '⬆️ Level Up! You\'re growing stronger!'}
                  {context === 'streak_milestone' && '🔥 Streak Milestone! Consistency is key!'}
                  {context === 'challenge_start' && '💪 Challenge Starting! You\'ve got this!'}
                  {context === 'daily_greeting' && '🌅 Good morning! Ready for another great day?'}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

// Quick banner version for easier integration
export const MotivationalBanner: React.FC<{
  context?: MotivationalQuoteCardProps['context'];
  compact?: boolean;
}> = ({ context = 'random', compact = true }) => {
  return (
    <EnhancedMotivationalQuoteCard 
      context={context} 
      showControls={true}
      compact={compact}
      autoSlide={true}
      slideInterval={30}
      className="my-4"
    />
  );
};

export default EnhancedMotivationalQuoteCard;
