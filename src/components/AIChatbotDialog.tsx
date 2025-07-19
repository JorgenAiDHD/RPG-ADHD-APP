import { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

const AIChatbotDialog = () => {
  const { state, actions } = useGame();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.aiChatHistory]);

  const getApiUrl = (endpoint: string) => {
    const serverUrl = import.meta.env.VITE_AI_SERVER_URL || "http://localhost:3001";
    return `${serverUrl}${endpoint}`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    actions.addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      text: input,
    });
    setInput('');
    // Wywołanie backendu AI
    try {
      const res = await fetch(getApiUrl('/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, gameState: state, history: state.aiChatHistory }),
      });
      const data = await res.json();
      if (data.text) {
        actions.addChatMessage({
          id: Date.now().toString() + '-ai',
          role: 'ai',
          text: data.text,
        });
      }
    } catch (e) {
      actions.addChatMessage({
        id: Date.now().toString() + '-err',
        role: 'ai',
        text: 'Błąd połączenia z AI. Spróbuj ponownie.',
      });
    }
    setSending(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md shadow-2xl rounded-3xl border-2 border-blue-400 bg-white dark:bg-gray-900 flex flex-col h-[70vh] ADHD-chatbot">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl">
        <span className="text-xl font-bold text-white flex items-center gap-2">
          🤖 AI Companion
        </span>
        <button
          className="text-white text-2xl font-bold hover:scale-125 transition-transform"
          onClick={actions.closeAIChat}
          aria-label="Zamknij okno AI"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-blue-50 dark:bg-gray-800 ADHD-chat-scroll" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
        {state.aiChatHistory && state.aiChatHistory.length > 0 ? (
          state.aiChatHistory.map((msg: any) => (
            <div key={msg.id} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-md ${msg.role === 'user' ? 'bg-blue-400 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-blue-200 dark:border-gray-600'}`}
                style={{ fontWeight: msg.role === 'user' ? 600 : 400 }}>
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">Brak historii rozmowy. Zacznij pisać!</div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        className="flex gap-2 p-4 bg-white dark:bg-gray-900 rounded-b-3xl border-t border-blue-200 dark:border-gray-700"
        onSubmit={e => { e.preventDefault(); handleSend(); }}
      >
        <input
          className="flex-1 rounded-2xl border-2 border-blue-300 focus:border-blue-500 px-4 py-2 outline-none bg-blue-50 dark:bg-gray-800 text-lg transition-all ADHD-input"
          type="text"
          placeholder="Napisz do AI..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={sending}
          autoFocus
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-6 py-2 rounded-2xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          disabled={sending || !input.trim()}
        >
          Wyślij
        </button>
      </form>
    </div>
  );
};

export default AIChatbotDialog;
