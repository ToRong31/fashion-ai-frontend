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

      // Extract action and cart items from response
      // Data can be at top level or nested under step ID (e.g., "1")
      const responseData = res.data;
      let action: string | undefined;
      let cartItems: unknown;

      // Check top level first
      if (responseData?.action) {
        action = responseData.action;
        // Check both cart_items (plural) and cart_item (singular)
        cartItems = responseData.cart_items || responseData.cart_item;
      }
      // If not at top level, check nested under step ID (sequential execution)
      else if (responseData?.["1"]?.action) {
        action = responseData["1"].action;
        cartItems = responseData["1"].cart_items || responseData["1"].cart_item;
      }

      console.log('[Chat] Action detected:', action, 'Items:', cartItems);

      // Handle add_to_cart action (single item)
      if (action === 'add_to_cart' && Array.isArray(cartItems) && cartItems.length > 0) {
        const item = cartItems[0] as { product_id: number; product_name: string; price: number };
        const authUser = useAuthStore.getState().user;
        console.log('[Chat] Adding single item to cart:', item);
        if (authUser) {
          await useCartStore.getState().addItem({
            user_id: authUser.id,
            product_id: item.product_id,
            quantity: 1,
          });
        }
      }

      // Handle add_multiple_to_cart action (multiple items)
      if (action === 'add_multiple_to_cart' && Array.isArray(cartItems) && cartItems.length > 0) {
        const items = cartItems as Array<{ product_id: number; product_name: string; price: number }>;
        const authUser = useAuthStore.getState().user;
        console.log('[Chat] Adding multiple items to cart:', items.length, 'items');
        console.log('[Chat] Auth user:', authUser);
        if (authUser) {
          for (const item of items) {
            console.log('[Chat] Adding item:', item);
            try {
              await useCartStore.getState().addItem({
                user_id: authUser.id,
                product_id: item.product_id,
                quantity: 1,
              });
              console.log('[Chat] Added item successfully:', item.product_id);
            } catch (e) {
              console.error('[Chat] Failed to add item:', e);
            }
          }
        } else {
          console.warn('[Chat] No auth user - cannot add to cart');
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
        // API returns products at top level: { role, content, products, cart_items, orders }
        // Frontend expects data.products, so wrap it
        data: h.products || h.cart_items || h.orders
          ? { products: h.products, cart_items: h.cart_items, orders: h.orders }
          : undefined,
        timestamp: Date.now() - (history.length - i) * 1000,
      }));
      set({ messages });
    } catch {
      // Silently fail — start with empty history
    }
  },
}));
