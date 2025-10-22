// src/api/resumeApi.ts
import axios from "axios";

// ✅ Create Axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
});

// ✅ Automatically attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Resume API endpoints
const API_URL = "/resume";

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
    responseType: "blob", // ✅ for PDF file
  });
  return res.data;
};

export default api;
