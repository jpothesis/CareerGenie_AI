import { create } from 'zustand';
import { signup, login, checkAuth as verifyTokenAPI} from '../services/authService';

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
  isLoading: boolean; 
  isAuthenticated: boolean;
  setUser: (user: User, token: string) => void;
  loginUser: (formData: { email: string; password: string }) => Promise<void>;
  signupUser: (formData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// ------------------------
// ✅ Zustand Store
// ------------------------
const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true, 
  isAuthenticated: false,

  setUser: (user, token) => {
    localStorage.setItem('jwttoken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },

  loginUser: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await login(formData);
      
      // FIX: Only access properties that exist on AuthResponse
      const token = res.data.token;
      const user = res.data.user;

      useAuthStore.getState().setUser(user, token);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  signupUser: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await signup(formData);
      
      // FIX: Only access properties that exist on AuthResponse
      const token = res.data.token;
      const user = res.data.user;

      useAuthStore.getState().setUser(user, token);
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    set({ isLoading: true }); // Ensure spinner is ON
    try {
      const token = localStorage.getItem('jwttoken');
      const userString = localStorage.getItem('user');

      if (!token) {
        // No token? Stop loading and stay logged out.
        set({ user: null, token: null, isAuthenticated: false });
        return; 
      }

      // 1. Optimistic Load: Set data from storage immediately
      if (userString) {
        set({ token, user: JSON.parse(userString), isAuthenticated: true });
      }

      // 2. Verify with Backend
      await verifyTokenAPI(); 

    } catch (error) {
      console.warn('Token validation failed. Logging out.');
      get().logout(); 
    } finally {
      // 3. Stop Loading Spinner
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
