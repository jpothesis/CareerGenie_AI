import { createContext, useContext, useEffect, useState} from 'react';
import { getDashboardAnalytics } from '../services/analyticsService';
import type { AnalyticsResponse } from '../services/analyticsService';
import type { ReactNode } from 'react';


interface DashboardContextType {
  data: AnalyticsResponse | null;
  loading: boolean;
  error: string | null;
}

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  loading: true,
  error: null,
});

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardAnalytics();
        setData(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);