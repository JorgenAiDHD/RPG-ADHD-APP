import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX, 
  Clock, Plus, Minus
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import './FocusTimer_NEW.css';

const FocusTimer = () => {
  const { actions } = useGame();
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes (Pomodoro)
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25); // In minutes
  const [breakDuration, setBreakDuration] = useState(5); // In minutes
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  
  // UI states
  const [showTimeEditor, setShowTimeEditor] = useState(false);
  
  // Reference to store the interval ID
  const intervalRef = useRef<number | null>(null);
  
  // Audio elements for notifications
  const focusCompleteSound = useRef<HTMLAudioElement | null>(null);
  const breakCompleteSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    try {
      focusCompleteSound.current = new Audio('/sounds/complete.mp3');
      breakCompleteSound.current = new Audio('/sounds/break.mp3');
      
      if (focusCompleteSound.current) focusCompleteSound.current.volume = 0.5;
      if (breakCompleteSound.current) breakCompleteSound.current.volume = 0.5;
    } catch (error) {
      console.error('Error initializing audio elements:', error);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Timer management effect
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);
  
  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (sessionType === 'focus') {
      // Focus session completed
      const xpGain = Math.round(focusDuration * 2); // 2 XP per minute
      actions.addXP({
        amount: xpGain,
        reason: `Focused for ${focusDuration} minutes`
      });
      
      setCompletedSessions(prev => prev + 1);
      
      // Play completion sound
      if (soundEnabled && focusCompleteSound.current) {
        focusCompleteSound.current.play().catch(console.error);
      }
      
      toast.success(`🎯 Focus session complete!`, {
        description: `+${xpGain} XP earned for ${focusDuration} minutes of focus`,
        duration: 5000
      });
      
      // Switch to break
      setSessionType('break');
      setTimeLeft(breakDuration * 60);
      setInitialTime(breakDuration * 60);
    } else {
      // Break completed
      if (soundEnabled && breakCompleteSound.current) {
        breakCompleteSound.current.play().catch(console.error);
      }
      
      toast.info(`☕ Break time over!`, {
        description: 'Ready for another focus session?',
        duration: 3000
      });
      
      // Switch back to focus
      setSessionType('focus');
      setTimeLeft(focusDuration * 60);
      setInitialTime(focusDuration * 60);
    }
  };
  
  const startTimer = () => {
    if (timeLeft <= 0) {
      resetTimer();
    }
    setIsRunning(true);
  };
  
  const pauseTimer = () => {
    setIsRunning(false);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    const newTime = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;
    setTimeLeft(newTime);
    setInitialTime(newTime);
  };
  
  const adjustTime = (minutes: number) => {
    if (isRunning) return; // Don't allow changes while running
    
    if (sessionType === 'focus') {
      const newDuration = Math.max(1, Math.min(120, focusDuration + minutes));
      setFocusDuration(newDuration);
      setTimeLeft(newDuration * 60);
      setInitialTime(newDuration * 60);
    } else {
      const newDuration = Math.max(1, Math.min(30, breakDuration + minutes));
      setBreakDuration(newDuration);
      setTimeLeft(newDuration * 60);
      setInitialTime(newDuration * 60);
    }
  };
  
  const handleSliderChange = (value: number) => {
    if (isRunning) return;
    
    if (sessionType === 'focus') {
      setFocusDuration(value);
      setTimeLeft(value * 60);
      setInitialTime(value * 60);
    } else {
      setBreakDuration(value);
      setTimeLeft(value * 60);
      setInitialTime(value * 60);
    }
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  
  const currentDuration = sessionType === 'focus' ? focusDuration : breakDuration;
  const maxDuration = sessionType === 'focus' ? 120 : 30;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn(
        "overflow-hidden border-2 shadow-2xl rounded-2xl transition-all duration-500",
        sessionType === 'focus' 
          ? "bg-gradient-to-br from-blue-900/80 via-indigo-900/60 to-purple-900/80 border-blue-500/50" 
          : "bg-gradient-to-br from-green-900/80 via-emerald-900/60 to-teal-900/80 border-green-500/50"
      )}>
        {/* Enhanced Header */}
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={cn(
                  "p-3 rounded-2xl shadow-lg",
                  sessionType === 'focus' 
                    ? "bg-gradient-to-br from-blue-500 to-purple-600" 
                    : "bg-gradient-to-br from-green-500 to-emerald-600"
                )}>
                  {sessionType === 'focus' ? (
                    <Brain size={28} className="text-white" />
                  ) : (
                    <Coffee size={28} className="text-white" />
                  )}
                </div>
                {isRunning && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div>
                <CardTitle className={cn(
                  "text-2xl font-bold flex items-center gap-3",
                  sessionType === 'focus' 
                    ? "text-blue-100" 
                    : "text-green-100"
                )}>
                  {sessionType === 'focus' ? '🧠 Focus Time' : '☕ Break Time'}
                  <Badge className={cn(
                    "font-semibold",
                    sessionType === 'focus' 
                      ? "bg-blue-500/80 text-blue-100 border-blue-400" 
                      : "bg-green-500/80 text-green-100 border-green-400"
                  )}>
                    Session #{completedSessions + 1}
                  </Badge>
                </CardTitle>
                <p className={cn(
                  "text-sm mt-1",
                  sessionType === 'focus' ? "text-blue-200" : "text-green-200"
                )}>
                  {sessionType === 'focus' 
                    ? "Deep work session for maximum productivity" 
                    : "Relax and recharge your mind"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                size="sm"
                className={cn(
                  "rounded-xl text-white",
                  sessionType === 'focus' 
                    ? "hover:bg-blue-800/50" 
                    : "hover:bg-green-800/50"
                )}
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </Button>
              
              <Button
                onClick={() => setShowTimeEditor(!showTimeEditor)}
                variant="ghost"
                size="sm"
                disabled={isRunning}
                className={cn(
                  "rounded-xl text-white",
                  sessionType === 'focus' 
                    ? "hover:bg-blue-800/50" 
                    : "hover:bg-green-800/50"
                )}
              >
                <Clock size={18} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Time Display */}
          <div className="text-center">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "text-8xl font-mono font-bold mb-4",
                sessionType === 'focus' ? "text-blue-100" : "text-green-100"
              )}
            >
              {formatTime(timeLeft)}
            </motion.div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-4 bg-gray-800/50 rounded-full overflow-hidden mb-6">
              <motion.div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  sessionType === 'focus' 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600" 
                    : "bg-gradient-to-r from-green-500 to-emerald-600"
                )}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Time Editor */}
          <AnimatePresence>
            {showTimeEditor && !isRunning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "p-4 rounded-xl border-2",
                  sessionType === 'focus' 
                    ? "bg-blue-900/30 border-blue-500/30" 
                    : "bg-green-900/30 border-green-500/30"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {sessionType === 'focus' ? 'Focus Duration' : 'Break Duration'}
                    </span>
                    <span className="text-white text-sm">
                      {currentDuration} minute{currentDuration !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Time Adjustment Buttons */}
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => adjustTime(-5)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-white border-white/30 hover:bg-white/10"
                    >
                      <Minus size={16} className="mr-1" />
                      5m
                    </Button>
                    
                    <Button
                      onClick={() => adjustTime(-1)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-white border-white/30 hover:bg-white/10"
                    >
                      <Minus size={16} className="mr-1" />
                      1m
                    </Button>
                    
                    {/* Custom Slider */}
                    <div className="flex-1 px-4">
                      <input
                        type="range"
                        min="1"
                        max={maxDuration}
                        value={currentDuration}
                        onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                        className={cn(
                          "w-full h-2 rounded-lg appearance-none cursor-pointer",
                          sessionType === 'focus' 
                            ? "focus-slider-blue" 
                            : "focus-slider-green"
                        )}
                      />
                    </div>
                    
                    <Button
                      onClick={() => adjustTime(1)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-white border-white/30 hover:bg-white/10"
                    >
                      <Plus size={16} className="mr-1" />
                      1m
                    </Button>
                    
                    <Button
                      onClick={() => adjustTime(5)}
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-white border-white/30 hover:bg-white/10"
                    >
                      <Plus size={16} className="mr-1" />
                      5m
                    </Button>
                  </div>
                  
                  {/* Quick Presets */}
                  <div className="flex gap-2 flex-wrap">
                    {sessionType === 'focus' ? (
                      [15, 25, 45, 60, 90].map(minutes => (
                        <Button
                          key={minutes}
                          onClick={() => handleSliderChange(minutes)}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-xl text-xs text-white border-white/30 hover:bg-white/10",
                            currentDuration === minutes && "bg-white/20"
                          )}
                        >
                          {minutes}m
                        </Button>
                      ))
                    ) : (
                      [5, 10, 15, 20].map(minutes => (
                        <Button
                          key={minutes}
                          onClick={() => handleSliderChange(minutes)}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "rounded-xl text-xs text-white border-white/30 hover:bg-white/10",
                            currentDuration === minutes && "bg-white/20"
                          )}
                        >
                          {minutes}m
                        </Button>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button
                onClick={startTimer}
                className={cn(
                  "rounded-xl px-8 py-4 text-lg font-semibold shadow-lg flex items-center gap-3",
                  sessionType === 'focus' 
                    ? "bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white" 
                    : "bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
                )}
              >
                <Play size={24} />
                Start {sessionType === 'focus' ? 'Focus' : 'Break'}
              </Button>
            ) : (
              <Button
                onClick={pauseTimer}
                className={cn(
                  "rounded-xl px-8 py-4 text-lg font-semibold shadow-lg flex items-center gap-3",
                  sessionType === 'focus' 
                    ? "bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white" 
                    : "bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white"
                )}
              >
                <Pause size={24} />
                Pause
              </Button>
            )}
            
            <Button
              onClick={resetTimer}
              variant="outline"
              className={cn(
                "rounded-xl px-6 py-4 flex items-center gap-2 text-white border-white/30 hover:bg-white/10"
              )}
            >
              <RotateCcw size={20} />
              Reset
            </Button>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-xl border",
              sessionType === 'focus' 
                ? "bg-blue-900/30 border-blue-500/30" 
                : "bg-green-900/30 border-green-500/30"
            )}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{completedSessions}</div>
                <div className="text-sm text-gray-300">Sessions Today</div>
              </div>
            </div>
            
            <div className={cn(
              "p-4 rounded-xl border",
              sessionType === 'focus' 
                ? "bg-blue-900/30 border-blue-500/30" 
                : "bg-green-900/30 border-green-500/30"
            )}>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{completedSessions * 2}</div>
                <div className="text-sm text-gray-300">XP Earned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FocusTimer;
