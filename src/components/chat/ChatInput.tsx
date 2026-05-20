import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-border bg-surface">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask the AI assistant…"
        disabled={disabled}
        className="flex-1 bg-bg border border-border rounded-full px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft disabled:opacity-50 transition"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        aria-label="Send message"
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
