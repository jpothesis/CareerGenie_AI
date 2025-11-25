// src/api/resumeApi.ts
import axios from "axios";

// 🔥 Create Axios instance
const api = axios.create({
  baseURL: "https://careergenie-ai.onrender.com/api",
});

// 🔥 Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwttoken"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const API_URL = "/resume";

// --- RESUME API ENDPOINTS ---
export const generateResume = async (data: any) => {
  const res = await api.post(`${API_URL}/generate`, data);
  return res.data;
};

export const saveResume = async (data: any) => {
  const res = await api.post(`${API_URL}/save`, data);
  return res.data;
};

export const getResumeHistory = async () => {
  const res = await api.get(`${API_URL}/history`);
  return res.data;
};

export const downloadResume = async (data: any) => {
  const res = await api.post(`${API_URL}/download`, data, {
    responseType: "blob",
  });
  return res.data;
};

export default api;
