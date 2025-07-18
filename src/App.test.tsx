// Test App component
import { ThemeProvider } from './context/ThemeContext';

export const TestApp = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-blue-500 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Test - Czy działa?</h1>
      </div>
    </ThemeProvider>
  );
}
