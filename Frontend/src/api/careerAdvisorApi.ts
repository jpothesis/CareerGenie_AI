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
    return res.data; // should be { advice: "...AI generated text..." }
  } catch (error) {
    console.error("Error fetching career advice:", error);
    throw error;
  }
};
