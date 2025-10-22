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
import { useDashboard } from "../../context/DashboardContext";

export const UsageRadar = () => {
  const { data } = useDashboard();
  const usageData = data?.usageStats || [];

  return (
    <div className="col-span-12 md:col-span-4 overflow-hidden rounded border border-orange-300/30 bg-gradient-to-br from-[#2c1b0a] via-[#3a230d] to-[#1c1005] shadow-md hover:shadow-orange-400/20 transition-all">
      <div className="p-4 border-b border-orange-300/20 flex items-center gap-2">
        <Eye size={18} className="text-orange-400" />
        <h3 className="font-medium text-base text-orange-100">Usage</h3>
      </div>

      <div className="h-64 px-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={usageData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="feature"
              tick={{ fontSize: 10, fill: "#facc15" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 150]}
              stroke="rgba(255, 255, 255, 0.2)"
              tick={{ fill: "#facc15", fontSize: 9 }}
            />
            <Radar
              name="Mobile"
              dataKey="mobile"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
            />
            <Radar
              name="Desktop"
              dataKey="desktop"
              stroke="#facc15"
              fill="#facc15"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1005",
                border: "1px solid #facc15",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#facc15",
              }}
              labelStyle={{
                fontSize: "10px",
                color: "#facc15",
              }}
            />
            <Legend
              wrapperStyle={{ color: "#facc15", fontSize: 12 }}
              iconSize={10}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsageRadar;
