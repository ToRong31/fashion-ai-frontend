# State Management

Zustand stores for frontend state management.

## Overview

Uses Zustand for lightweight, hooks-based state management with persist middleware for auth state.

## Stores

### authStore

Manages authentication state with localStorage persistence.

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      register: async (username, password) => {
        const res = await authApi.register({ username, password });
        localStorage.setItem('auth-token', res.token);
        const user = await authApi.getUser(res.user_id);
        set({ user, token: res.token });
      },
      login: async (username, password) => {
        const res = await authApi.login({ username, password });
        localStorage.setItem('auth-token', res.token);
        const user = await authApi.getUser(res.user_id);
        set({ user, token: res.token });
      },
      logout: () => {
        localStorage.removeItem('auth-token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
```

**Features:**
- Persists to localStorage
- Auto-syncs token to localStorage on state changes
- Provides `user`, `token`, `login()`, `register()`, `logout()`

**Usage:**
```typescript
import { useAuthStore } from './stores/authStore';

const { user, token, login, logout } = useAuthStore();
```

---

### cartStore

Manages shopping cart state (in-memory, not persisted).

```typescript
// src/stores/cartStore.ts
interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: (userId: number) => Promise<void>;
  addItem: (req: AddToCartRequest) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clear: (userId: number) => Promise<void>;
  totalAmount: () => number;
  totalItems: () => number;
}
```

**Features:**
- Fetches cart from backend on mount
- Syncs with backend on every mutation
- Computed getters for totals

**Usage:**
```typescript
import { useCartStore } from './stores/cartStore';

const { items, fetchCart, addItem, removeItem, totalAmount } = useCartStore();
```

---

### chatStore

Manages AI chat messages and conversation state.

```typescript
// src/stores/chatStore.ts
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  toggleOpen: () => void;
  sendMessage: (userId: string, message: string) => Promise<void>;
  loadHistory: (userId: string) => Promise<void>;
}
```

**Features:**
- Open/close chat widget
- Send messages to AI orchestrator
- Load conversation history
- Auto-handle "add_to_cart" actions

**Usage:**
```typescript
import { useChatStore } from './stores/chatStore';

const { messages, isOpen, toggleOpen, sendMessage } = useChatStore();
```

## State Flow

```
User Login
    ↓
authStore.token set + localStorage
    ↓
backendApi interceptor reads token
    ↓
All API requests include JWT
```

```
Add to Cart Button
    ↓
cartStore.addItem()
    ↓
cartApi.addToCart() → Backend
    ↓
Cart updated + UI re-renders
```

```
Chat Message Sent
    ↓
chatStore.sendMessage()
    ↓
chatApi.sendMessage() → AI Orchestrator
    ↓
Response displayed + (optionally) cart updated
```

## Key Files

- `src/stores/authStore.ts` - Auth state with persistence
- `src/stores/cartStore.ts` - Cart state
- `src/stores/chatStore.ts` - Chat state
