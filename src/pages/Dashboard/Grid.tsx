// Description: This file defines the Grid component for the Dashboard page, which includes various statistical cards, activity graphs, usage radar, and recent activities. It uses a context provider to manage state across the dashboard components.
import  StatCards  from "./StatCards";
import ActivityGraph from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import RecentActivities from "./RecentActivities";
import { DashboardProvider } from '../../context/DashboardContext';

export const Grid = () => {
  return (
    <DashboardProvider>
      <div className="px-4 py-6 bg-[#0c0c0c] rounded-lg shadow-inner shadow-orange-500/10 grid gap-4 grid-cols-1 md:grid-cols-12">
        <StatCards />
        <ActivityGraph />
        <UsageRadar />
        <RecentActivities />
      </div>
    </DashboardProvider>
  );
};
