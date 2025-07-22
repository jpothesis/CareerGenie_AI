import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Change this to your backend URL
  withCredentials: true,
});

export default api;

