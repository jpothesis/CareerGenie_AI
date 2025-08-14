import api from "./api";

const API_URL = "/api/career/advice";

export const getCareerAdvice = async (data: {
  name: string;
  education: string;
  skills: string[];
  interests: string[];
  goals: string;
}) => {
  try {
    const res = await api.post(API_URL, data);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching career advice:", error);
    throw error;
  }
};
