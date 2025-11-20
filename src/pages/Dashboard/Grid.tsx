// Description: This file defines the Grid component for the Dashboard page, which includes various statistical cards, activity graphs, usage radar, and recent activities. It uses a context provider to manage state across the dashboard components.
import  StatCards  from "./StatCards";
import ActivityGraph from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import RecentActivities from "./RecentActivities";
import { DashboardProvider, useDashboard } from './DashboardContext';
import React from "react";

export const Grid = () => {

  const { loading, error } = useDashboard();

  if (loading) return <div className="min-h-full flex items-center justify-center text-amber-500 text-2xl py-20">Loading Dashboard...</div>;
  if (error) return <div className="min-h-full flex items-center justify-center text-red-500 text-xl py-20">Error: {error}</div>;

  return (
      <div className="px-4 py-6 bg-[#0c0c0c] rounded-lg shadow-inner shadow-orange-500/10 grid gap-6 grid-cols-1 md:grid-cols-12">
          <h1 className="col-span-12 text-3xl font-extrabold text-white mb-2">Career Dashboard</h1>

          {/* Stat Cards (Top Row) */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCards />
          </div>

          {/* Activity Graph & Usage Radar (Middle Row) */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4">
              <ActivityGraph />
              <UsageRadar />
          </div>

          {/* Recent Activities (Bottom Row) */}
          <div className="col-span-12">
              <RecentActivities />
          </div>
      </div>
  );
};
