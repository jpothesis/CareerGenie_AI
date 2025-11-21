// src/api/resumeService.ts
import api from "./resumeApi";
import type { ResumeData } from "../components/resume";
import axios, { type AxiosResponse } from "axios";

const RESUME_AI_ENDPOINT = "/resume/generate";

export const fetchAIGeneratedData = async (
  currentData: ResumeData
): Promise<ResumeData> => {
  try {
    const response: AxiosResponse<{
      resume: ResumeData;
      saved: boolean;
      resumeId: string | null;
    }> = await api.post(RESUME_AI_ENDPOINT, currentData);

    if (!response.data || !response.data.resume) {
      throw new Error("Invalid AI response structure.");
    }

    return response.data.resume;
  } catch (error: any) {
    let errorMessage = "Failed to generate resume using AI.";

    if (axios.isAxiosError(error) && error.response) {
      errorMessage =
        error.response.data?.msg ||
        error.response.data?.error ||
        error.response.statusText ||
        errorMessage;
    }

    console.error("AI Resume Generation Error:", error);
    throw new Error(errorMessage);
  }
};
