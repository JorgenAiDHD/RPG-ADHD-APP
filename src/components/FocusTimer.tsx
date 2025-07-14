import { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX, Clock, Gift } from 'lucide-react';
import { toast } from 'sonner';
import * as ProgressPrimitive from "@radix-ui/react-progress";
import './FocusTimer.css';

const FocusTimer = () => {
  const { actions } = useGame();
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus');
  const [focusDuration, setFocusDuration] = useState(25); // In minutes
  const [breakDuration, setBreakDuration] = useState(5); // In minutes
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Reference to store the interval ID
  const intervalRef = useRef<number | null>(null);
  
  // Audio elements for notifications
  const focusCompleteSound = useRef<HTMLAudioElement | null>(null);
  const breakCompleteSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio elements
  useEffect(() => {
    try {
      focusCompleteSound.current = new Audio('/sounds/complete.mp3');
      breakCompleteSound.current = new Audio('/sounds/break.mp3');
      tickSound.current = new Audio('/sounds/tick.mp3');
      
      
      // Preload audio files
      focusCompleteSound.current.load();
      breakCompleteSound.current.load();
      tickSound.current.load();
      
      // Set volumes
      if (focusCompleteSound.current) focusCompleteSound.current.volume = 0.5;
      if (breakCompleteSound.current) breakCompleteSound.current.volume = 0.5;
      if (tickSound.current) tickSound.current.volume = 0.2;
    } catch (error) {
      console.error('Error initializing audio elements:', error);
    }
    
    return () => {
      // Clean up audio elements
      focusCompleteSound.current = null;
      breakCompleteSound.current = null;
      tickSound.current = null;
      
      // Clean up interval if component unmounts while timer is running
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Timer management effect
  useEffect(() => {
    
    // Clean up any existing interval first to prevent duplicates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only set up new interval if timer is running
    if (isRunning) {
      
      // Use a regular interval instead of window.setInterval to avoid potential issues
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Play tick sound at certain intervals with improved error handling
          if (prevTime % 60 === 0 && prevTime > 0 && soundEnabled && tickSound.current) {
            try {
              // Reset sound to beginning
              tickSound.current.currentTime = 0;
              
              // Play with proper error handling
              const tickPromise = tickSound.current.play();
              if (tickPromise !== undefined) {
                tickPromise.catch(err => {
                  console.warn("Could not play tick sound:", err);
                  // Don't show toast here to avoid spamming the user
                });
              }
            } catch (err) {
              console.error("Error attempting to play tick sound:", err);
            }
          }
          
          
          if (prevTime <= 1) {
            clearInterval(timerId);
            
            // Use setTimeout to ensure state updates complete before handleTimerComplete
            setTimeout(() => {
              handleTimerComplete();
            }, 10);
            
            return 0;
          }
          
          return prevTime - 1;
        });
      }, 1000);
      
      // Store the interval ID in the ref
      intervalRef.current = timerId as unknown as number;
    }
    
    // Clean up function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, sessionType]); // Only re-run when isRunning or sessionType changes
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalSeconds = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  // Start timer function
  const startTimer = () => {
    
    // Only reset timeLeft if it's 0 or not properly set
    if (timeLeft <= 0) {
      const newTime = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;
      setTimeLeft(newTime);
    }
    
    // Ensure this always triggers the useEffect
    setTimeout(() => {
      setIsRunning(true);
    }, 0);
  };
  
  // Pause timer function with direct interval handling for more reliability
  const pauseTimer = () => {
    
    // Directly clear the interval for immediate response
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsRunning(false);
  };
  
  // Resume timer function
  const resumeTimer = () => {
    
    // Make sure we have a valid time left
    if (timeLeft <= 0) {
      const newTime = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;
      setTimeLeft(newTime);
    }
    
    // Ensure this always triggers the useEffect
    setTimeout(() => {
      setIsRunning(true);
      console.log('Set isRunning to true for resume');
    }, 0);
  };
  
  // Reset timer function with direct interval handling
  const resetTimer = () => {
    console.log('Reset button clicked');
    
    // Directly clear any running interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Cleared interval in resetTimer');
    }
    
    // Update state in correct order
    setIsRunning(false);
    
    // Use setTimeout to ensure state updates properly
    setTimeout(() => {
      const newTime = sessionType === 'focus' ? focusDuration * 60 : breakDuration * 60;
      console.log(`Setting timeLeft to ${newTime} seconds (${formatTime(newTime)})`);
      setTimeLeft(newTime);
      toast.info('Timer reset.');
    }, 0);
  };
  
  // Skip session function with direct handling
  const skipSession = () => {
    console.log('Skip button clicked');
    
    // Directly clear any running interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Cleared interval in skipSession');
    }
    
    setIsRunning(false);
    
    // Use setTimeout to ensure state is updated before handling timer complete
    setTimeout(() => {
      console.log('Executing handleTimerComplete after skip');
      handleTimerComplete(); // This will handle transitioning to the next session
      console.log('Session skipped');
    }, 50);
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    console.log('handleTimerComplete called. Current session:', sessionType);
    
    // Make sure any existing interval is cleared
    if (intervalRef.current) {
      console.log('Clearing interval in handleTimerComplete');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Play appropriate sound with improved error handling and user interaction handling
    if (soundEnabled) {
      try {
        const playSound = async (sound: HTMLAudioElement | null) => {
          if (!sound) return;
          
          try {
            // Reset the audio to beginning in case it was played before
            sound.currentTime = 0;
            
            // Add event listeners for debugging
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
              playPromise
                .then(() => console.log('Sound played successfully'))
                .catch(err => {
                  console.error("Error playing sound:", err);
                  // Fallback attempt - sometimes a user interaction is required first
                  const resumeAudio = () => {
                    sound.play()
                      .then(() => {
                        console.log('Sound played after user interaction');
                        document.removeEventListener('click', resumeAudio);
                      })
                      .catch(innerErr => console.error("Still couldn't play sound after interaction:", innerErr));
                  };
                  
                  document.addEventListener('click', resumeAudio, { once: true });
                  toast.error("Dźwięki wymagają interakcji użytkownika. Kliknij gdziekolwiek na stronie.", {
                    duration: 3000
                  });
                });
            }
          } catch (innerError) {
            console.error('Inner error playing sound:', innerError);
          }
        };
        
        if (sessionType === 'focus' && focusCompleteSound.current) {
          playSound(focusCompleteSound.current);
        } else if (sessionType === 'break' && breakCompleteSound.current) {
          playSound(breakCompleteSound.current);
        }
      } catch (error) {
        console.error('Error in sound playing logic:', error);
      }
    }
      
    // If focus session completed, reward XP and Gold
    if (sessionType === 'focus') {
      // Calculate XP based on focus duration (10 XP per 5 minutes)
      const xpEarned = Math.round(10 * (focusDuration / 5));
      // Calculate Gold based on focus duration (5 gold per 5 minutes)
      const goldEarned = Math.round(5 * (focusDuration / 5));
      
      
      try {
        // Add XP and Gold
        actions.addXP({
          amount: xpEarned,
          reason: `Completed ${focusDuration} min focus session`
        });
        
        // Add Gold for completed focus session
        actions.addGold(goldEarned, `Completed ${focusDuration} min focus session`);
        
        // Update streak when focus session is completed
        actions.updateStreak();
        
        // Log activity
        actions.logActivity({
          id: crypto.randomUUID(),
          type: 'focus_session',
          description: `Completed ${focusDuration} min focus session`,
          timestamp: new Date(),
          xpGained: xpEarned,
          healthChanged: 0
        });
        
      } catch (error) {
        console.error('Error while adding rewards:', error);
      }
      
      // Show notification
      toast.success(`Sesja skupienia ukończona! +${xpEarned} XP, +${goldEarned} Złota`, {
        description: `Świetna robota! Skupiłeś się przez ${focusDuration} minut!`,
        duration: 5000,
      });
      
      // Switch to break session
      setSessionType('break');
      const newBreakTime = breakDuration * 60;
      setTimeLeft(newBreakTime);
    } else {
      // Break session completed
      toast.success(`Break time's over!`, {
        description: `Ready for another focus session?`,
        duration: 5000,
      });
      
      // Switch back to focus session
      setSessionType('focus');
      const newFocusTime = focusDuration * 60;
      console.log(`Setting new focus time: ${newFocusTime} seconds (${formatTime(newFocusTime)})`);
      setTimeLeft(newFocusTime);
    }
    
    // Wait a moment before starting the next session
    console.log('Setting timeout to start next session automatically');
    setTimeout(() => {
      console.log('Timeout complete - auto-starting next session');
      
      // Instead of creating a new interval directly, just set isRunning to true
      // and let the useEffect handle creating the interval
      setIsRunning(true);
      console.log('Set isRunning to true to start next session');
      
    }, 1500); // Slightly longer delay to ensure state updates have completed
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-purple-900/60 dark:to-indigo-900/80 border border-gray-200 dark:border-purple-800/50 text-gray-900 dark:text-white shadow-xl dark:shadow-purple-900/30 rounded-3xl">
        {/* Background pattern for visual interest */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM3QzNBRUQiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjItMS44LTQtNC00cy00IDEuOC00IDQgMS44IDQgNCA0IDQtMS44IDQtNHptMC0xOGMwLTIuMi0xLjgtNC00LTRzLTQgMS44LTQgNCAxLjggNCA0IDQgNC0xLjggNC00em0wIDM2YzAtMi4yLTEuOC00LTQtNHMtNCAxLjgtNCA0IDEuOCA0IDQgNCA0LTEuOCA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        
        <CardHeader className="pb-2 bg-purple-50 dark:bg-purple-900/30 border-b border-gray-200 dark:border-purple-800/50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-700/60 dark:to-indigo-800/60 rounded-full shadow-md border border-purple-200 dark:border-purple-600/30">
                {sessionType === 'focus' ? (
                  <Brain size={24} className="text-purple-600 dark:text-purple-300" />
                ) : (
                  <Coffee size={24} className="text-green-600 dark:text-green-300" />
                )}
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white dark:bg-gradient-to-r dark:from-purple-300 dark:to-indigo-200 dark:bg-clip-text dark:text-transparent">
                {sessionType === 'focus' ? 'Focus Timer' : 'Break Time'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline"
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  sessionType === 'focus' 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700/50'
                }`}
              >
                {!isRunning ? 'Ready' : sessionType === 'focus' ? 'Active' : 'Break'}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Zapobiega propagacji zdarzeń
                  console.log('Sound toggle clicked, current state:', soundEnabled);
                  setSoundEnabled(!soundEnabled);
                  // Dodanie wizualnego feedbacku
                  const button = e.currentTarget;
                  button.classList.add('sound-btn-active');
                  setTimeout(() => button.classList.remove('sound-btn-active'), 200);
                }}
                className="h-8 w-8 rounded-full hover:bg-gray-100 active:bg-gray-200 dark:hover:bg-purple-800/50 dark:active:bg-purple-800/70 cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
                style={{ WebkitTapHighlightColor: 'transparent' }} // Usunięcie domyślnego efektu podświetlania na urządzeniach mobilnych
              >
                {soundEnabled ? (
                  <Volume2 size={18} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <VolumeX size={18} className="text-gray-500 dark:text-gray-400" />
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 pt-5">
          {/* Timer with Progress Bar */}
          <div className="flex flex-col items-center justify-center mb-6 w-full max-w-sm mx-auto">
            {/* Time display */}
            <div className={`text-6xl font-bold mb-4 ${
              sessionType === 'focus' 
                ? 'text-purple-600 dark:text-purple-300' 
                : 'text-green-600 dark:text-green-300'
            }`}>
              {formatTime(timeLeft)}
            </div>
            
            <div className="text-sm mb-4 text-gray-600 dark:text-gray-300 font-medium">
              {sessionType === 'focus' ? 'Stay Focused' : 'Take a Break'}
            </div>

            {/* Progress bar using Radix UI - improved with more visual feedback */}
            <div className="w-full mb-2">
              <ProgressPrimitive.Root
                className="relative h-8 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/30"
                value={calculateProgress()}
                max={100}
              >
                <div className="absolute inset-0 flex items-center justify-center z-10 text-xs font-medium">
                  {Math.round(calculateProgress())}% Complete
                </div>
                <ProgressPrimitive.Indicator
                  className={`h-full transition-all duration-300 ease-in-out ${
                    sessionType === 'focus'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 dark:from-purple-400 dark:to-purple-600'
                      : 'bg-gradient-to-r from-green-500 to-green-700 dark:from-green-400 dark:to-green-600'
                  }`}
                  style={{ width: `${calculateProgress()}%` }}
                />
              </ProgressPrimitive.Root>

              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Start</span>
                <span className="font-medium">
                  {sessionType === 'focus' 
                    ? `Focus: ${focusDuration} min`
                    : `Break: ${breakDuration} min`}
                </span>
                <span>End</span>
              </div>
            </div>
          </div>
          
          {/* Control Buttons - Added Skip Button with improved mobile layout */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
            {!isRunning ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // Zapobiega propagacji zdarzeń
                  timeLeft <= 0 ? startTimer() : resumeTimer();
                }}
                className={`timer-control-button px-4 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2 shadow-md font-medium transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
                  sessionType === 'focus' 
                    ? 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white border border-purple-500 hover:shadow-purple-400/20' 
                    : 'bg-green-600 hover:bg-green-500 active:bg-green-700 text-white border border-green-500 hover:shadow-green-400/20'
                }`}
                type="button"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Play size={16} /> {timeLeft <= 0 ? 'Start' : 'Resume'}
              </Button>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  pauseTimer();
                }}
                className="timer-control-button bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2 shadow-md font-medium border border-amber-500 hover:shadow-amber-400/20 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                type="button"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Pause size={16} /> Pause
              </Button>
            )}
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                resetTimer();
                // Dodanie wizualnego feedbacku
                const button = e.currentTarget;
                button.classList.add('btn-pulse');
                setTimeout(() => button.classList.remove('btn-pulse'), 300);
              }}
              variant="outline"
              type="button"
              className="timer-control-button border-gray-300 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 dark:active:bg-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2 transition-all font-medium cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <RotateCcw size={16} /> Reset
            </Button>
            
            {/* Skip Button - For users who need to end early but still want to transition to next phase */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                skipSession();
                // Dodanie wizualnego feedbacku
                const button = e.currentTarget;
                button.classList.add('btn-pulse');
                setTimeout(() => button.classList.remove('btn-pulse'), 300);
              }}
              variant="outline"
              type="button"
              className={`timer-control-button px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2 transition-all font-medium cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] ${
                sessionType === 'focus'
                  ? 'border-purple-300 text-purple-600 hover:bg-purple-50 active:bg-purple-100 dark:border-purple-700 dark:text-purple-400 dark:hover:bg-purple-900/30 dark:active:bg-purple-900/50'
                  : 'border-green-300 text-green-600 hover:bg-green-50 active:bg-green-100 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/30 dark:active:bg-green-900/50'
              }`}
              title={sessionType === 'focus' ? "Skip to break" : "Skip to focus"}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Clock size={18} /> Skip {sessionType === 'focus' ? 'to Break' : 'to Focus'}
            </Button>
          </div>
          
          {/* ADHD Info Box */}
          <div className={`mb-6 p-4 rounded-xl text-sm ${
            sessionType === 'focus'
              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200 border border-purple-200 dark:border-purple-800/30'
              : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-800/30'
          }`}>
            {sessionType === 'focus' ? (
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-2 text-purple-800 dark:text-purple-300">ADHD Focus Strategies:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs">
                    <li><strong>Zewnętrzna motywacja:</strong> Krótsze sesje (15-20 min) z natychmiastową nagrodą</li>
                    <li><strong>Body doubling:</strong> Pracuj równolegle z kimś (fizycznie lub wirtualnie)</li>
                    <li><strong>Parking lot:</strong> Zapisuj pojawiające się myśli na kartce zamiast przerywać</li>
                    <li><strong>Dopamina trick:</strong> Rozpocznij od najprzyjemniejszego aspektu zadania</li>
                    <li><strong>Wizualizacja:</strong> Ustaw namacalny timer (ten timer wyświetla twój postęp!)</li>
                    <li><strong>Fidget friendly:</strong> Małe ruchy jak stukanie stopą pomagają skupić uwagę</li>
                  </ul>
                  <p className="mt-2.5 font-medium text-xs bg-purple-100/50 dark:bg-purple-800/30 p-1.5 rounded inline-block border border-purple-200 dark:border-purple-700/50 shadow-sm">
                    <span className="flex items-center gap-1">
                      <Gift size={12} className="inline-block" />
                      <span>+{Math.round(10 * (focusDuration / 5))} XP i +{Math.round(5 * (focusDuration / 5))} Złota po ukończeniu!</span>
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Coffee className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium mb-2 text-green-800 dark:text-green-300">ADHD-Friendly Breaks:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs">
                    <li><strong>Poruszaj się:</strong> Krótki spacer lub kilka ćwiczeń rozciągających</li>
                    <li><strong>Nawodnienie:</strong> Wypij szklankę wody - nawodnienie pomaga w koncentracji</li>
                    <li><strong>No-screen time:</strong> Daj oczom i mózgowi odpocząć od bodźców cyfrowych</li>
                    <li><strong>Reset mózgu:</strong> 5 głębokich oddechów z zamkniętymi oczami</li>
                    <li><strong>Zmiana bodźców:</strong> Wyjrzyj przez okno lub posłuchaj minuty muzyki</li>
                    <li><strong>Micro-nagroda:</strong> Zrób coś przyjemnego ale krótkiego (nie wpadnij w hyperfokus!)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Toggle */}
          <Button
            variant="ghost"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Settings toggle clicked, current state:', showSettings);
              setShowSettings(!showSettings);
              // Dodanie wizualnego feedbacku
              const button = e.currentTarget;
              button.classList.add('settings-btn-pulse');
              setTimeout(() => button.classList.remove('settings-btn-pulse'), 300);
            }}
            className={`w-full justify-center mb-1 text-xs cursor-pointer transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] ${
              sessionType === 'focus'
                ? 'hover:bg-purple-100 active:bg-purple-200 dark:hover:bg-purple-900/30 dark:active:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                : 'hover:bg-green-100 active:bg-green-200 dark:hover:bg-green-900/30 dark:active:bg-green-900/50 text-green-700 dark:text-green-300'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Clock size={14} className="mr-2" />
            {showSettings ? "Hide Settings" : "Show Timer Settings"}
          </Button>
          
          {/* Timer Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Focus Duration
                    </label>
                    <Select
                      value={focusDuration.toString()}
                      onValueChange={(value) => {
                        const numValue = Number(value);
                        setFocusDuration(numValue);
                        if (sessionType === 'focus' && !isRunning) {
                          setTimeLeft(numValue * 60);
                        }
                      }}
                      disabled={isRunning && sessionType === 'focus'}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="25 minutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 min (quick)</SelectItem>
                        <SelectItem value="15">15 min (przyjazne dla ADHD)</SelectItem>
                        <SelectItem value="20">20 min (rekomendowane)</SelectItem>
                        <SelectItem value="25">25 min (pomodoro)</SelectItem>
                        <SelectItem value="30">30 min</SelectItem>
                        <SelectItem value="45">45 min</SelectItem>
                        <SelectItem value="60">60 min (deep work)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Break Duration
                    </label>
                    <Select
                      value={breakDuration.toString()}
                      onValueChange={(value) => {
                        const numValue = Number(value);
                        setBreakDuration(numValue);
                        if (sessionType === 'break' && !isRunning) {
                          setTimeLeft(numValue * 60);
                        }
                      }}
                      disabled={isRunning && sessionType === 'break'}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="5 minutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 min (quick break)</SelectItem>
                        <SelectItem value="5">5 min (standard)</SelectItem>
                        <SelectItem value="10">10 min (longer rest)</SelectItem>
                        <SelectItem value="15">15 min (recharge)</SelectItem>
                        <SelectItem value="20">20 min (proper break)</SelectItem>
                        <SelectItem value="30">30 min (extended break)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FocusTimer;
