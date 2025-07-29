import api from '../lib/axios';

export interface Job {
  _id: string;
  title: string;
  company: string;
  matchedScore?: number;
  status?: string;
  dateMatched?: string;
}

export const getJobs = () => api.get<Job[]>('/jobs');