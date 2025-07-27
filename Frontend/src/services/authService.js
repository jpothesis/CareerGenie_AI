import API from '../utils/axios';

// Authentication service for handling user signup and login
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
