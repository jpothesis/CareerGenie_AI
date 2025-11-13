// src/api/resumeService.ts

import api from "./api"; // Import your configured axios instance
import type { ResumeData } from "../components/resume"; // Adjust path as needed
import axios, { type AxiosResponse } from "axios"; // <<< ADDED THIS IMPORT FOR AXIOS AND AXIOSResponse TYPE

const RESUME_AI_ENDPOINT = "/ai/generate-resume"; // Example AI endpoint

/**
 * @function fetchAIGeneratedData
 * @description Fetches a complete ResumeData object from the AI backend using the configured axios client.
 * @param currentData - The current resume state for AI context/refinement.
 * @returns A promise that resolves to the generated ResumeData.
 */
export const fetchAIGeneratedData = async (
  currentData: ResumeData
): Promise<ResumeData> => {
  try {
    const response: AxiosResponse<{ resume: ResumeData }> = await api.post(
      RESUME_AI_ENDPOINT,
      {
        context: "Generate or enhance a professional resume.",
        data: currentData, // Sending current data for context
      }
    );

    // Assuming your backend response looks like: { success: true, resume: {...} }
    return response.data.resume;
    
  } catch (error) {
    // 1. FIX: Now 'axios' is defined here.
    // 2. FIX: The check `axios.isAxiosError(error)` correctly narrows the 'unknown' error type.
    let errorMessage = "Failed to connect to the AI service.";
    if (axios.isAxiosError(error) && error.response) {
      // Access message/statusText from the response if available
      errorMessage = error.response.data.message || error.response.statusText || errorMessage;
    }
    
    console.error("Error fetching AI resume data:", error);
    // Throw a new error to be caught by the component
    throw new Error(errorMessage);
  }
};