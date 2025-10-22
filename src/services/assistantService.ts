import api from '../lib/axios';

export const logAssistantUsage = () => api.get('/assistant');
export const sendToAssistant = (query: string) => api.post('/assistant', { query });
