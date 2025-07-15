
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageSquare, Send, Loader } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { processAIMessage, AICommand } from '../utils/aiCompanion';
import { toast } from 'sonner';

const AIChatbotDialog = () => {
  const { state, actions } = useGame();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.aiChatHistory, open]);

  // Wykonaj komendę AI
  const executeCommand = (command: AICommand) => {
    switch (command.type) {
      case 'ADD_QUEST':
        // Dodajemy quest z pełnymi wymaganymi polami
        actions.addQuest({
          id: crypto.randomUUID(),
          title: command.params.title,
          description: command.params.description,
          type: command.params.type || 'side',
          xpReward: command.params.xpReward || 10,
          priority: command.params.priority || 'medium',
          status: 'active',
          createdDate: new Date(),
          estimatedTime: command.params.estimatedTime || 30,
          difficultyLevel: command.params.difficultyLevel || 3,
          energyRequired: command.params.energyRequired || 'medium',
          anxietyLevel: command.params.anxietyLevel || 'comfortable',
          tags: command.params.tags || ['general']
        });
        toast.success(`Added new quest: ${command.params.title}`);
        break;
        
      case 'COMPLETE_QUEST':
        actions.completeQuest(command.params.questId);
        toast.success(`Completed quest: ${command.params.questTitle}`);
        break;
        
      case 'HEALTH_ACTION':
        // Jeśli to istniejąca aktywność
        if (command.params.activityId.startsWith('custom_')) {
          // Dodaj nową aktywność
          const newActivity = {
            id: command.params.activityId,
            name: command.params.activityName,
            healthChange: command.params.healthChange,
            category: command.params.category,
            duration: command.params.duration,
            description: command.params.description,
            icon: command.params.icon,
          };
          actions.addHealthActivity(newActivity);
          actions.updateHealth(command.params.healthChange, newActivity);
        } else {
          // Użyj istniejącej aktywności
          actions.updateHealth(command.params.healthChange);
        }
        toast.success(`Logged health activity: ${command.params.activityName}`);
        break;
        
      case 'SET_MAIN_QUEST':
        actions.setMainQuest(command.params.title, command.params.description);
        toast.success(`Updated main quest to: ${command.params.title}`);
        break;
        
      case 'ACTIVATE_BONUS_XP':
        actions.activateBonusXP(
          command.params.multiplier, 
          command.params.duration, 
          command.params.reason
        );
        toast.success(`Activated ${command.params.multiplier}x XP bonus for ${command.params.duration} minutes`);
        break;
        
      default:
        // Nieznana komenda, nie robimy nic
        break;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Dodaj wiadomość użytkownika do historii
    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, text: input };
    actions.addChatMessage(userMsg);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Przetwórz wiadomość lokalnie zamiast wysyłać do zewnętrznego API
      const aiResponse = await processAIMessage(
        input, 
        state.aiChatHistory, 
        { state, actions }
      );
      
      // Dodaj odpowiedź AI do historii
      actions.addChatMessage({ 
        id: crypto.randomUUID(), 
        role: 'ai', 
        text: aiResponse.reply 
      });
      
      // Wykonaj wszystkie komendy zwrócone przez AI
      aiResponse.commandsToExecute.forEach(command => {
        executeCommand(command);
      });
      
    } catch (err) {
      console.error("AI processing error:", err);
      actions.addChatMessage({ 
        id: crypto.randomUUID(), 
        role: 'ai', 
        text: 'I encountered an error while processing your request. Please try again.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* AI Companion button removed for ADHD-friendly UI simplification */}
      <DialogContent className="max-w-lg w-full rounded-2xl p-6 bg-white dark:bg-zinc-900 shadow-2xl border border-cyan-200 dark:border-zinc-800 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold mb-2 text-cyan-700 dark:text-cyan-300 tracking-tight">AI Companion</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto max-h-80 mb-4 px-1">
          {state.aiChatHistory.length === 0 && (
            <div className="text-zinc-400 text-center mt-8">No conversation yet. Ask me anything about your quests, productivity, or well-being!</div>
          )}
          {state.aiChatHistory.map(msg => (
            <div key={msg.id} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-4 py-2 max-w-xs ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="flex gap-2 mt-2" onSubmit={e => { e.preventDefault(); handleSend(); }}>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 h-10 text-base"
            maxLength={200}
            autoFocus={open}
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-1" 
            disabled={!input.trim() || isProcessing}
          >
            {isProcessing ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AIChatbotDialog;
