// src/api/resumeService.ts
import api from "./api"; // ✅ Correct import of the interceptor

const API_URL = "/resume";

// ✅ Rename this to match what ResumeBuilder expects
export const fetchAIGeneratedData = async (data: any) => {
  try {
    const res = await api.post(`${API_URL}/generate`, data);
    
    // ✅ CRITICAL FIX: The backend returns { resume: {...}, saved: boolean }
    // We must return ONLY the resume object to the frontend state
    return res.data.resume; 
  } catch (error) {
    throw error;
  }
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