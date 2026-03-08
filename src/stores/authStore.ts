import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';
import * as authApi from '../api/auth';

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
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);

// Sync auth-token in localStorage when store rehydrates from persisted state
useAuthStore.subscribe((state) => {
  if (state.token) {
    localStorage.setItem('auth-token', state.token);
  }
});
