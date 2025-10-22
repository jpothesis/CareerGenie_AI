// Dashboard.tsx
import { Grid } from "./Grid";
import { DashboardProvider } from "./DashboardContext";

export const Dashboard = () => {
  return (
    <DashboardProvider>
      <div className="bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#121212] text-white min-h-screen rounded-lg pb-4 shadow-inner">
        <Grid />
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
