import API from '../utils/axios';

export const getResumeData = () => API.get('/resume');
