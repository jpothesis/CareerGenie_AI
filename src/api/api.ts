import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const LIVE_BACKEND_URL = "https://careergenie-ai.onrender.com";

const getBaseUrl = () => {
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:5000/api"; // Local backend
  }
  return `${LIVE_BACKEND_URL}/api`; // Production backend
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("jwttoken");
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
