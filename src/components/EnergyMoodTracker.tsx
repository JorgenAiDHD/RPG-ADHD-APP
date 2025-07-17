import { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'framer-motion';
import { 
  Star, 
  StarOff,
  Zap, 
  Heart,
  Bed,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

const EnergyMoodTracker = () => {
  const { state, actions } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [tempSleepHours, setTempSleepHours] = useState(state.energySystem.sleepHours);
  const [tempMoodLevel, setTempMoodLevel] = useState(state.energySystem.moodLevel);
  
  const energySystem = state.energySystem;
  
  // Star rating component
  const StarRating = ({ 
    rating, 
    onRatingChange, 
    maxStars = 5, 
    label 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void; 
    maxStars?: number; 
    label: string; 
  }) => (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRatingChange(starValue)}
              className="transition-colors"
            >
              {starValue <= rating ? (
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="w-6 h-6 text-gray-300 dark:text-gray-600" />
              )}
            </motion.button>
          );
        })}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {getRatingLabel(rating, maxStars)}
        </span>
      </div>
    </div>
  );
  
  const getRatingLabel = (rating: number, maxStars: number) => {
    if (maxStars === 5) {
      switch (rating) {
        case 1: return "Wyczerpany 😴";
        case 2: return "Niski 😐";
        case 3: return "Średni 🙂";
        case 4: return "Dobry 😊";
        case 5: return "Super Power! 🚀";
        default: return "";
      }
    } else {
      const percentage = (rating / maxStars) * 100;
      if (percentage <= 20) return "Bardzo niski";
      if (percentage <= 40) return "Niski";
      if (percentage <= 60) return "Średni";
      if (percentage <= 80) return "Dobry";
      return "Bardzo dobry";
    }
  };
  
  const updateDailyRating = (rating: number) => {
    actions.updateEnergySystem({
      ...energySystem,
      dailyRating: rating,
      lastUpdated: new Date()
    });
    
    toast.success(`Dzienna energia: ${getRatingLabel(rating, 5)}`);
  };
  
  const updateMoodLevel = (mood: number) => {
    actions.updateEnergySystem({
      ...energySystem,
      moodLevel: mood,
      lastUpdated: new Date()
    });
  };
  
  const updateSleepHours = (hours: number) => {
    actions.updateEnergySystem({
      ...energySystem,
      sleepHours: hours,
      lastUpdated: new Date()
    });
    
    toast.success(`Sen: ${hours} godzin`);
  };
  
  const getEnergyColor = (energy: number) => {
    if (energy >= 80) return "text-green-500";
    if (energy >= 60) return "text-yellow-500";
    if (energy >= 40) return "text-orange-500";
    return "text-red-500";
  };
  
  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😄";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    if (mood >= 2) return "😔";
    return "😢";
  };
  
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
          <Zap className="w-5 h-5" />
          Energy & Mood Tracker
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Daily Check-in</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <StarRating
                  rating={tempMoodLevel}
                  onRatingChange={setTempMoodLevel}
                  maxStars={10}
                  label="Jak się dzisiaj czujesz? (nastrój)"
                />
                
                <div className="space-y-2">
                  <Label>Ile godzin spałeś ostatniej nocy?</Label>
                  <Input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={tempSleepHours}
                    onChange={(e) => setTempSleepHours(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      updateMoodLevel(tempMoodLevel);
                      updateSleepHours(tempSleepHours);
                      setShowSettings(false);
                      toast.success("Dane zaktualizowane!");
                    }}
                    className="flex-1"
                  >
                    Zapisz
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Daily Energy Rating */}
        <div className="space-y-3">
          <StarRating
            rating={energySystem.dailyRating}
            onRatingChange={updateDailyRating}
            label="Twoja energia dzisiaj:"
          />
        </div>
        
        {/* Current Status Display */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${getEnergyColor(energySystem.current)}`} />
            <span>Energia: {energySystem.current}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Zdrowie: {state.healthBar.current}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-indigo-500" />
            <span>Sen: {energySystem.sleepHours}h</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg">{getMoodEmoji(energySystem.moodLevel)}</span>
            <span>Nastrój: {energySystem.moodLevel}/10</span>
          </div>
        </div>
        
        {/* Quick Motivation */}
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
          <p className="text-sm text-blue-800 dark:text-blue-300 italic">
            "Practice makes progress" - Jim Kwik
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergyMoodTracker;
