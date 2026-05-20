import { useEffect, useRef } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useAuthStore } from '../../stores/authStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatWidget() {
  const { messages, isOpen, isLoading, toggleOpen, sendMessage, loadHistory } = useChatStore();
  const user = useAuthStore((s) => s.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const userId = user ? String(user.id) : 'guest';

  useEffect(() => {
    if (isOpen && user && !loadedRef.current) {
      loadedRef.current = true;
      loadHistory(String(user.id));
    }
  }, [isOpen, user, loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (message: string) => {
    sendMessage(userId, message);
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          aria-label="Open AI assistant"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 hover:bg-primary-dark hover:scale-105 transition-all"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-120 max-w-[calc(100vw-3rem)] h-[650px] max-h-[calc(100vh-3rem)] bg-bg border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-primary text-white">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center w-9 h-9 rounded-full bg-white/15">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">AI Assistant</h3>
                <p className="text-white/75 text-xs">Search, style advice &amp; orders</p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              aria-label="Close"
              className="grid place-items-center w-8 h-8 rounded-full hover:bg-white/15 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-text-secondary text-sm py-8">
                <div className="grid place-items-center w-12 h-12 rounded-2xl bg-primary-soft text-primary mx-auto mb-3">
                  <Sparkles size={22} />
                </div>
                <p className="font-heading text-text-primary text-base mb-1">Welcome to ToRoMe</p>
                <p className="mb-4">Your personal shopping assistant. Try one of these:</p>
                <div className="flex flex-col items-center gap-2">
                  <span className="bg-surface border border-border rounded-full px-3.5 py-1.5">
                    “Show me black jackets”
                  </span>
                  <span className="bg-surface border border-border rounded-full px-3.5 py-1.5">
                    “Recommend an outfit for a date”
                  </span>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles size={13} />
                </div>
                <div className="bg-surface border border-border rounded-2xl px-4 py-3 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-text-secondary/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      )}
    </>
  );
}
