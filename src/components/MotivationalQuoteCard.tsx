// UX/UI Enhancements - Motivational Quote Card Component v0.2
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MotivationalQuote, MotivationalSystem } from '../utils/motivationalContent';
import { Quote, Shuffle, Heart, Star, BookOpen } from 'lucide-react';

interface MotivationalQuoteCardProps {
  context?: 'quest_completion' | 'level_up' | 'streak_milestone' | 'challenge_start' | 'daily_greeting' | 'random';
  category?: MotivationalQuote['category'];
  className?: string;
  showControls?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // minutes
}

const categoryIcons = {
  focus: <Star className="w-4 h-4" />,
  productivity: <BookOpen className="w-4 h-4" />,
  adhd: <Heart className="w-4 h-4" />,
  learning: <BookOpen className="w-4 h-4" />,
  mindfulness: <Quote className="w-4 h-4" />,
  growth: <Star className="w-4 h-4" />,
  success: <Star className="w-4 h-4" />
};

const categoryColors = {
  focus: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  productivity: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  adhd: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  learning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  mindfulness: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
  growth: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  success: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
};

export const MotivationalQuoteCard: React.FC<MotivationalQuoteCardProps> = ({
  context = 'random',
  category,
  className = '',
  showControls = true,
  autoRefresh = false,
  refreshInterval = 10
}) => {
  const [currentQuote, setCurrentQuote] = useState<MotivationalQuote | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [fadeClass, setFadeClass] = useState('');

  // Load new quote
  const loadNewQuote = () => {
    setFadeClass('opacity-50 transition-opacity duration-300');
    
    setTimeout(() => {
      let newQuote: MotivationalQuote;
      
      if (category) {
        newQuote = MotivationalSystem.getQuoteByCategory(category);
      } else if (context === 'random') {
        newQuote = MotivationalSystem.getRandomQuote();
      } else {
        newQuote = MotivationalSystem.getContextualQuote(context);
      }
      
      setCurrentQuote(newQuote);
      setIsLiked(false);
      setFadeClass('opacity-100 transition-opacity duration-300');
    }, 150);
  };

  // Initialize quote on mount
  useEffect(() => {
    loadNewQuote();
  }, [context, category]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(loadNewQuote, refreshInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Handle like toggle
  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Save liked quotes to localStorage or user preferences
  };

  if (!currentQuote) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 border-l-4 border-l-blue-500 dark:border-l-blue-400 ${className}`}>
      <CardContent className={`p-0 space-y-4 ${fadeClass}`}>
        {/* Quote Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge className={categoryColors[currentQuote.category as keyof typeof categoryColors]}>
              {categoryIcons[currentQuote.category as keyof typeof categoryIcons]}
              <span className="ml-1 capitalize">{currentQuote.category.replace('_', ' ')}</span>
            </Badge>
            {currentQuote.source && (
              <Badge variant="outline" className="text-xs">
                {currentQuote.source}
              </Badge>
            )}
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={isLiked ? 'text-red-500' : 'text-gray-400'}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadNewQuote}
                title="New quote"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Quote Text */}
        <blockquote className="text-lg font-medium leading-relaxed text-gray-900 dark:text-gray-100 italic">
          <Quote className="w-6 h-6 text-blue-500 dark:text-blue-400 mb-2" />
          "{currentQuote.text}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center justify-between">
          <cite className="text-sm font-semibold text-gray-700 dark:text-gray-300 not-italic">
            — {currentQuote.author}
          </cite>
          
          {/* Tags */}
          {currentQuote.tags && currentQuote.tags.length > 0 && (
            <div className="flex gap-1">
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

        {/* Context Message for Special Moments */}
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
      </CardContent>
    </Card>
  );
};

// Quick motivational banner for between sections
export const MotivationalBanner: React.FC<{
  context?: MotivationalQuoteCardProps['context'];
  compact?: boolean;
}> = ({ context = 'random', compact = false }) => {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);

  useEffect(() => {
    const newQuote = context === 'random' 
      ? MotivationalSystem.getRandomQuote()
      : MotivationalSystem.getContextualQuote(context);
    setQuote(newQuote);
  }, [context]);

  if (!quote) return null;

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800 my-4">
        <p className="text-sm text-center italic text-gray-700 dark:text-gray-300">
          "{quote.text}" <span className="font-semibold">— {quote.author}</span>
        </p>
      </div>
    );
  }

  return <MotivationalQuoteCard context={context} showControls={false} className="my-6" />;
};

export default MotivationalQuoteCard;
