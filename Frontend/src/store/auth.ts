// src/store/auth.ts
import { create } from 'zustand';

interface AuthState {
  user: string | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: string, token: string) => void;
  logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export default useAuth;
