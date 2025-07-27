import API from '../utils/axios';

export const getDashboardAnalytics = () => API.get('/analytics');
