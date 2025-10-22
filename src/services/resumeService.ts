import api from '../lib/axios';

export interface ResumeScore {
  score: number;
  feedback?: string;
  updatedAt: string;
}

export const getResumeData = () => api.get<ResumeScore>('/resume');
