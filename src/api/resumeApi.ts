import api from "./api"; // Import the central, fixed API helper


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
    responseType: "blob", // Important for PDF downloads
  });
  return res.data;
};

export default api;