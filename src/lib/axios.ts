import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';


// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ Update this in prod
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===========================
// ✅ Request Interceptor
// ===========================
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token'); // ✅ Get token from storage
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 🚫 If request config fails
  }
);

// ===========================
// ✅ Response Interceptor
// ===========================
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);

    // Optional: handle global 401/403 here
    if (error?.response?.status === 401) {
      // Example: Auto logout or redirect to login
      console.warn('Unauthorized! Redirecting to login...');
      // window.location.href = '/login'; // Uncomment if needed
    }

    return Promise.reject(error);
  }
);

export default api;
