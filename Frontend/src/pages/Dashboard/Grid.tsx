
import { StatCards } from "./StatCards";
import  ActivityGraph  from "./ActivityGraph";
import { UsageRadar } from "./UsageRadar";
import  RecentActivities  from "./RecentActivities.tsx";

export const Grid = () => {
  return (
    <div className="px-4 grid gap-3 grid-cols-1 md:grid-cols-12">

      <StatCards />
      <ActivityGraph />
      <UsageRadar />
      <RecentActivities />
    </div>
  );
};