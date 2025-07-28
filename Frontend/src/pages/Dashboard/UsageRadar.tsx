"use client";

import { Eye } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext"; // dashboard data from context

export const UsageRadar = () => {
  const { data } = useDashboard(); // from DashboardProvider
  const usageData = data?.usageStats || [];

  return (
    <div className="col-span-4 overflow-hidden rounded border border-stone-300 bg-white shadow-sm">
      <div className="p-4 border-b border-stone-200 flex items-center gap-2">
        <Eye size={18} className="text-violet-600" />
        <h3 className="font-medium text-base text-stone-800">Usage</h3>
      </div>

      <div className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={usageData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="feature" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} />
            <Radar
              name="Mobile"
              dataKey="mobile"
              stroke="#18181b"
              fill="#18181b"
              fillOpacity={0.25}
            />
            <Radar
              name="Desktop"
              dataKey="desktop"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.25}
            />
            <Tooltip
              contentStyle={{ fontSize: "12px", borderRadius: "4px" }}
              labelStyle={{ fontSize: "10px", color: "#52525b" }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageRadar;