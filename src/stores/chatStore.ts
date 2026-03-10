import { create } from 'zustand';
import type { ChatMessage } from '../types/chat';
import * as chatApi from '../api/chat';
import { useCartStore } from './cartStore';
import { useAuthStore } from './authStore';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggleOpen: () => void;
  sendMessage: (userId: string, message: string) => Promise<void>;
  loadHistory: (userId: string) => Promise<void>;
}

let msgCounter = 0;

export const useChatStore = create<ChatState>()((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  toggleOpen: () => set({ isOpen: !get().isOpen }),
  sendMessage: async (userId, message) => {
    const userMsg: ChatMessage = {
      id: `msg-${++msgCounter}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    set({ messages: [...get().messages, userMsg], isLoading: true });

    try {
      const res = await chatApi.sendMessage({ user_id: userId, message });

      // Handle add_to_cart action from AI agent
      if (res.data?.action === 'add_to_cart' && res.data?.cart_item) {
        const item = res.data.cart_item as { product_id: number; product_name: string; price: number };
        const authUser = useAuthStore.getState().user;
        if (authUser) {
          await useCartStore.getState().addItem({
            user_id: authUser.id,
            product_id: item.product_id,
            quantity: 1,
          });
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: 'assistant',
        content: res.response,
        agent_used: res.agent_used,
        data: res.data,
        timestamp: Date.now(),
      };
      set({ messages: [...get().messages, assistantMsg], isLoading: false });
    } catch {
      const errorMsg: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: Date.now(),
      };
      set({ messages: [...get().messages, errorMsg], isLoading: false });
    }
  },
  loadHistory: async (userId) => {
    try {
      const { history } = await chatApi.getConversationHistory(userId);
      const messages: ChatMessage[] = history.map((h, i) => ({
        id: `history-${i}`,
        role: h.role as 'user' | 'assistant',
        content: h.content,
        timestamp: Date.now() - (history.length - i) * 1000,
      }));
      set({ messages });
    } catch {
      // Silently fail — start with empty history
    }
  },
}));
