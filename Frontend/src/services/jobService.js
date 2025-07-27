import API from '../utils/axios';

export const getJobs = () => API.get('/jobs');
