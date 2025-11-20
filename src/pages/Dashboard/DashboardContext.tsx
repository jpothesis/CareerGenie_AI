import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../../lib/axios";


// --- 1. DEFINE TS INTERFACES ---

export interface ActivityDataPoint {
  name: string;
  Returning: number;
  New: number;
}

export interface UsageDataPoint {
  feature: string;
  mobile: number;
  desktop: number;
  max: number;
}

export interface RecentActivity {
  description?: string;
  message: string;
  timestamp: string;
  status?: string;
}

export interface DashboardData {
  userId: string;
  matchedJobs: number;
  resumeScore: number;
  interviewScore: number;
  learningProgress: number;
  activityGraph: ActivityDataPoint[];
  usageStats: UsageDataPoint[];
  recentActivities: RecentActivity[];
}

// Initial/default state structure (matches backend response)
const initialData: DashboardData = {
    userId: 'guest',
    matchedJobs: 0,
    resumeScore: 0,
    interviewScore: 0,
    learningProgress: 0,
    activityGraph: [
        { name: 'Jan', Returning: 0, New: 0 }, { name: 'Feb', Returning: 0, New: 0 },
        { name: 'Mar', Returning: 0, New: 0 }, { name: 'Apr', Returning: 0, New: 0 },
        { name: 'May', Returning: 0, New: 0 }, { name: 'Jun', Returning: 0, New: 0 },
        { name: 'Jul', Returning: 0, New: 0 }, { name: 'Aug', Returning: 0, New: 0 },
        { name: 'Sep', Returning: 0, New: 0 }, { name: 'Oct', Returning: 0, New: 0 },
        { name: 'Nov', Returning: 0, New: 0 }, { name: 'Dec', Returning: 0, New: 0 },
    ],
    usageStats: [
        { feature: 'Tracking', mobile: 0, desktop: 0, max: 150 },
        { feature: 'Builder', mobile: 0, desktop: 0, max: 150 },
        { feature: 'Schedule', mobile: 0, desktop: 0, max: 150 },
        { feature: 'AI Train', mobile: 0, desktop: 0, max: 150 },
        { feature: 'Interval', mobile: 0, desktop: 0, max: 150 },
    ],
    recentActivities: [],
};

// --- 2. CONTEXT TYPES ---

type DashboardContextType = {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

// Create context
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// --- 3. PROVIDER & FETCHING LOGIC ---

const getAuthToken = (): string | null => {
  const token = localStorage.getItem('jwttoken');
  return token;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0); 

  const refetch = () => setFetchTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();

      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/analytics');

        // AXIOS DATA HANDLING
        setData(response.data);

      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);

        // Handle 404 specifically
        if (err.response && err.response.status === 404) {
          console.warn("Warning: /api/analytics route not found on server. Using default data.");
          // Leave 'data' as 'initialData' so the page still renders
        } else {
          // Extract error message safely
          const msg = err.response?.data?.message || err.message || "Failed to load dashboard.";
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchTrigger]); 

  return (
    <DashboardContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </DashboardContext.Provider>
  );
};

// --- 4. CUSTOM HOOK ---

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};