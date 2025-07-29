import api from '../lib/axios';

export interface AppliedJob {
  _id: string;
  jobTitle: string;
  company: string;
  status: string;
  notes?: string;
  appliedAt?: string;
}

export const createAppliedJob = (job: Partial<AppliedJob>) => api.post<AppliedJob>('/applied-jobs', job);
export const getAppliedJobs = () => api.get<AppliedJob[]>('/applied-jobs');
export const updateAppliedJob = (id: string, updates: Partial<AppliedJob>) => api.put<AppliedJob>(`/applied-jobs/${id}`, updates);
export const deleteAppliedJob = (id: string) => api.delete(`/applied-jobs/${id}`);

