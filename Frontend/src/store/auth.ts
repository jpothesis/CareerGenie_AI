import { create } from 'zustand';
import { signup, login } from '../services/authService';

// User type
interface User {
  id: string;
  name: string;
  email: string;
}

// Auth state type
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  loginUser: (formData: { email: string; password: string }) => Promise<void>;
  signupUser: (formData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  loadFromStorage: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setUser: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  
  loginUser: async (formData) => {
    const res = await login(formData);
    const { user, token } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  
  signupUser: async (formData) => {
    const res = await signup(formData);
    const { user, token } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },  

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token || !userString) return;

    const user = JSON.parse(userString);
    set({ token, user });
  },
}));

export default useAuthStore;
