// UX/UI Enhancements - Brain Training Quiz Component v0.2
import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { BrainTrainingQuiz, BrainTrainingSystem } from '../utils/motivationalContent';
import { useGame } from '../context/GameContext';
import { Brain, Clock, Star, CheckCircle, XCircle, Trophy, Play } from 'lucide-react';

interface BrainTrainingQuizComponentProps {
  quiz?: BrainTrainingQuiz;
  onClose?: () => void;
  onComplete?: (score: any) => void;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const categoryIcons = {
  memory: <Brain className="w-4 h-4" />,
  attention: <Star className="w-4 h-4" />,
  cognitive_flexibility: <Brain className="w-4 h-4" />,
  working_memory: <Brain className="w-4 h-4" />,
  processing_speed: <Clock className="w-4 h-4" />
};

export const BrainTrainingQuizComponent: React.FC<BrainTrainingQuizComponentProps> = ({
  quiz: initialQuiz,
  onClose,
  onComplete
}) => {
  const { actions } = useGame();
  const [quiz, setQuiz] = useState<BrainTrainingQuiz | null>(initialQuiz || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Load random quiz if none provided
  useEffect(() => {
    if (!quiz) {
      setQuiz(BrainTrainingSystem.getRandomQuiz());
    }
  }, [quiz]);

  // Timer for current question
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          handleNextQuestion();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Timer for entire quiz
  useEffect(() => {
    if (!isActive || !quiz?.timeLimit || quizTimeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setQuizTimeLeft(time => {
        if (time <= 1) {
          handleFinishQuiz();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, quizTimeLeft, quiz]);

  const startQuiz = () => {
    if (!quiz) return;
    
    setIsActive(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    
    if (quiz.timeLimit) {
      setQuizTimeLeft(quiz.timeLimit);
    }
    
    const firstQuestion = quiz.questions[0];
    if (firstQuestion?.timeLimit) {
      setTimeLeft(firstQuestion.timeLimit);
    }
  };

  const handleAnswer = (answer: string | number) => {
    if (!quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    
    // Auto-advance after a short delay to show the selection
    setTimeout(() => {
      handleNextQuestion();
    }, 500);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      const nextQuestion = quiz.questions[nextIndex];
      if (nextQuestion?.timeLimit) {
        setTimeLeft(nextQuestion.timeLimit);
      }
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (!quiz) return;
    
    setIsActive(false);
    
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const scoreResults = BrainTrainingSystem.calculateScore(quiz, correctAnswers);
    setResults(scoreResults);
    setShowResults(true);
    
    // Award XP
    actions.addXP({
      amount: scoreResults.xpEarned,
      reason: `Brain Training: ${quiz.title}`
    });
    
    // Award gold based on performance
    const goldReward = Math.round(scoreResults.xpEarned / 2);
    actions.addGold(goldReward, `Brain Training Reward: ${quiz.title}`);
    
    onComplete?.(scoreResults);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            {quiz.title}
          </DialogTitle>
        </DialogHeader>

        {!isActive && !showResults && (
          <div className="space-y-6">
            {/* Quiz Info */}
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">{quiz.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={difficultyColors[quiz.difficulty]}>
                  {quiz.difficulty.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {categoryIcons[quiz.category]}
                  {quiz.category.replace('_', ' ').toUpperCase()}
                </Badge>
                {quiz.timeLimit && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(quiz.timeLimit)}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {quiz.xpReward} XP
                </Badge>
              </div>
            </div>

            {/* ADHD Benefits */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🧠 ADHD Benefits:</h4>
              <ul className="space-y-1">
                {quiz.adhdBenefits.map((benefit, index) => (
                  <li key={index} className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions Preview */}
            <div>
              <h4 className="font-semibold mb-2">📝 Quiz Overview:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {quiz.questions.length} questions • Mixed difficulty • Interactive challenges
              </p>
            </div>

            <Button onClick={startQuiz} className="w-full flex items-center gap-2">
              <Play className="w-4 h-4" />
              Start Brain Training
            </Button>
          </div>
        )}

        {isActive && !showResults && currentQuestion && (
          <div className="space-y-6">
            {/* Progress and Timers */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <div className="flex gap-4">
                  {currentQuestion.timeLimit && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(timeLeft)}
                    </span>
                  )}
                  {quiz.timeLimit && (
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {formatTime(quizTimeLeft)}
                    </span>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Question */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start p-4 h-auto"
                      onClick={() => handleAnswer(option)}
                    >
                      <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'sequence' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enter your answer below:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Enter number..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          handleAnswer(parseInt(value) || 0);
                        }
                      }}
                      autoFocus
                    />
                    <Button onClick={() => {
                      const input = document.querySelector('input[type="number"]') as HTMLInputElement;
                      if (input) {
                        handleAnswer(parseInt(input.value) || 0);
                      }
                    }}>
                      Submit
                    </Button>
                  </div>
                </div>
              )}

              {currentQuestion.type === 'word_association' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type your answer:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600"
                      placeholder="Your answer..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          handleAnswer(value.toLowerCase());
                        }
                      }}
                      autoFocus
                    />
                    <Button onClick={() => {
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      if (input) {
                        handleAnswer(input.value.toLowerCase());
                      }
                    }}>
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {showResults && results && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="text-center">
              <div className="mb-4">
                {results.performance === 'excellent' && <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />}
                {results.performance === 'good' && <Star className="w-16 h-16 text-blue-500 mx-auto mb-2" />}
                {results.performance === 'average' && <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />}
                {results.performance === 'needs_improvement' && <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-2" />}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">
                {results.performance === 'excellent' && '🎉 Excellent Work!'}
                {results.performance === 'good' && '👍 Good Job!'}
                {results.performance === 'average' && '👌 Not Bad!'}
                {results.performance === 'needs_improvement' && '💪 Keep Practicing!'}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400">
                You scored {results.score} out of {quiz.questions.length} ({results.percentage}%)
              </p>
            </div>

            {/* Score Details */}
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-500">{results.xpEarned}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{Math.round(results.xpEarned / 2)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Gold Earned</div>
                </div>
              </div>
            </Card>

            {/* Performance Message */}
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">🧠 Brain Training Complete!</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                {results.performance === 'excellent' && 'Outstanding! Your cognitive skills are sharp. Keep challenging yourself with harder quizzes!'}
                {results.performance === 'good' && 'Great work! You\'re building strong mental muscles. Try more advanced challenges!'}
                {results.performance === 'average' && 'Good effort! Regular brain training will improve your cognitive abilities. Keep practicing!'}
                {results.performance === 'needs_improvement' && 'Every attempt makes you stronger! Focus on areas where you struggled and try again.'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setQuiz(BrainTrainingSystem.getRandomQuiz())} className="flex-1">
                Try Another Quiz
              </Button>
              <Button onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrainTrainingQuizComponent;
