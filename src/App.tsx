// Główny plik aplikacji React, zawierający wszystkie komponenty i logikę. 
import { ThemeProvider } from './context/ThemeContext';
import { GameProvider } from './context/GameContext';
import { Toaster } from 'sonner';
import Index from './pages/Index';

export const App = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <div className="app min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:via-zinc-950 dark:to-black text-foreground">
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                fontSize: '16px',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              },
              duration: 5000,
            }}
          />
          <Index />
        </div>
      </GameProvider>
    </ThemeProvider>
  );
};