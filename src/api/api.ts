// src/api/api.ts
import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "https://careergenie-ai.onrender.com/api", // Change if backend URL differs
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
