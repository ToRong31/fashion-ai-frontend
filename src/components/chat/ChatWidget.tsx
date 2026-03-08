import { useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold text-bg flex items-center justify-center shadow-lg hover:bg-gold-light transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-120 h-[650px] bg-bg border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
            <div>
              <h3 className="text-text-primary text-base font-semibold">AI Assistant</h3>
              <p className="text-text-secondary text-xm">Search, style advice & orders</p>
            </div>
            <button onClick={toggleOpen} className="text-text-secondary hover:text-text-primary transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-text-secondary text-sm py-8">
                <p className="font-heading text-gold text-base mb-2">Welcome to ToRoMe</p>
                <p>Try: "Show me black jackets"</p>
                <p>Or: "Recommend an outfit for a date"</p>
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-text-secondary">
                  <span className="animate-pulse text-xs">...</span>
                </div>
                <div className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-secondary">
                  Thinking...
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
