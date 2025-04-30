import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  roleId?: string;
  organizationId?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  redirectUrl: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setRedirectUrl: (url: string) => void;
  clearRedirectUrl: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      redirectUrl: null,
      
      setToken: (token: string) => set({ token }),
      setUser: (user: User) => set({ user }),
      setRedirectUrl: (url: string) => set({ redirectUrl: url }),
      clearRedirectUrl: () => set({ redirectUrl: null }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        redirectUrl: state.redirectUrl 
      }),
    }
  )
); 