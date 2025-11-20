import api from '../lib/axios';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const signup = (data: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>('/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data);

export const checkAuth = () =>
 
  api.get<AuthResponse>('/auth/profile');
