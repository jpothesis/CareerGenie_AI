import API from '../utils/axios';

// Service for managing applied jobs
export const createAppliedJob = (job) => API.post('/applied-jobs', job);
export const getAppliedJobs = () => API.get('/applied-jobs');
export const updateAppliedJob = (id, updates) => API.put(`/applied-jobs/${id}`, updates);
export const deleteAppliedJob = (id) => API.delete(`/applied-jobs/${id}`);
