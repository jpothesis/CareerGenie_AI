import api from '../lib/axios';

export interface AnalyticsResponse {
  userId: string;
  matchedJobs: number;
  resumeScore: number;
  interviewScore: number;
  learningProgress: number;
  activityGraph: { _id: number; count: number }[];
  usageStats: { _id: string; count: number }[];
  recentActivities: { description: string; timestamp: string }[];
}

export const getDashboardAnalytics = () => api.get<AnalyticsResponse>('/analytics');
