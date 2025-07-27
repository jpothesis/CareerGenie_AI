// Zustand auth store for managing user authentication
import { create } from 'zustand';
import { signup, login } from '../services/authService';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token'),

  // Manual setter for when you use api.post directly (like in Register.tsx)
  setUser: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },

  // Login using service
  loginUser: async (formData) => {
    const res = await login(formData); // calls /auth/login
    localStorage.setItem('token', res.token);
    set({ user: res.user, token: res.token });
  },

  // Signup using service
  signupUser: async (formData) => {
    const res = await signup(formData); // calls /auth/signup
    localStorage.setItem('token', res.token);
    set({ user: res.user, token: res.token });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
