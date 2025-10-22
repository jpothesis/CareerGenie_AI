import { create } from 'zustand';
import { signup, login } from '../services/authService';

// ------------------------
// ✅ Types
// ------------------------
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  loginUser: (formData: { email: string; password: string }) => Promise<void>;
  signupUser: (formData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

// ------------------------
// ✅ Zustand Store
// ------------------------
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setUser: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  loginUser: async (formData) => {
    try {
      const res = await login(formData);
      const { user, token } = res.data;
      useAuthStore.getState().setUser(user, token);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  signupUser: async (formData) => {
    try {
      const res = await signup(formData);
      const { user, token } = res.data;
      useAuthStore.getState().setUser(user, token);
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  loadFromStorage: () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (token && userString) {
        const user = JSON.parse(userString);
        set({ token, user });
      }
    } catch (error) {
      console.error('Failed to load auth from storage:', error);
    }
  },
}));

export default useAuthStore;
