import API from '../utils/axios';

// Service for managing AI assistant-related functionalities
export const sendToAssistant = (query) => API.post('/assistant', { query });