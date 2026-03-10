import { create } from 'zustand';
import type { CartItem, AddToCartRequest } from '../types/cart';
import * as cartApi from '../api/cart';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  /** Fetch cart from backend for the given user */
  fetchCart: (userId: number) => Promise<void>;
  /** Add item to cart (calls backend) */
  addItem: (req: AddToCartRequest) => Promise<void>;
  /** Remove a cart item by its DB id */
  removeItem: (itemId: number) => Promise<void>;
  /** Update quantity for a cart item; quantity = 0 removes it */
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  /** Clear entire cart for user */
  clear: (userId: number) => Promise<void>;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await cartApi.getCart(userId);
      set({ items: res.items });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (req) => {
    const newItem = await cartApi.addToCart(req);
    // Replace existing entry for same cart item id or append
    const items = get().items;
    const idx = items.findIndex((i) => i.id === newItem.id);
    if (idx >= 0) {
      set({ items: items.map((i) => (i.id === newItem.id ? newItem : i)) });
    } else {
      set({ items: [...items, newItem] });
    }
  },

  removeItem: async (itemId) => {
    await cartApi.removeCartItem(itemId);
    set({ items: get().items.filter((i) => i.id !== itemId) });
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity <= 0) {
      await cartApi.removeCartItem(itemId);
      set({ items: get().items.filter((i) => i.id !== itemId) });
    } else {
      const updated = await cartApi.updateCartItem(itemId, { quantity });
      if (updated) {
        set({ items: get().items.map((i) => (i.id === itemId ? updated : i)) });
      } else {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      }
    }
  },

  clear: async (userId) => {
    await cartApi.clearCart(userId);
    set({ items: [] });
  },

  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.total_price, 0),

  totalItems: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

