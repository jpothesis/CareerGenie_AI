import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type DashboardContextType = {
  data: string;
  setData: (val: string) => void;
};

// Create context
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Provider
export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState("default value");

  return (
    <DashboardContext.Provider value={{ data, setData }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default DashboardContext;
