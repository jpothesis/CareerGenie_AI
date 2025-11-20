"use client";

import { User } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { useDashboard } from "../../context/DashboardContext";

const ActivityGraph = () => {
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="col-span-8 p-4 rounded border border-orange-300/30 bg-gradient-to-br from-[#2c1b0a] via-[#3a230d] to-[#1c1005]">
        <p className="text-orange-100">Loading activity graph...</p>
      </div>
    );
  }

  if (error || !data || !data.activityGraph) {
    return (
      <div className="col-span-8 p-4 rounded border border-orange-300/30 bg-gradient-to-br from-[#2c1b0a] via-[#3a230d] to-[#1c1005]">
        <p className="text-red-400">Failed to load activity graph.</p>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-8 overflow-hidden rounded border border-orange-300/30 bg-gradient-to-br from-[#2c1b0a] via-[#3a230d] to-[#1c1005] shadow-md hover:shadow-orange-400/20 transition-all">

      {/* Header */}
      <div className="p-4 border-b border-orange-300/20">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-100">
          <User className="w-5 h-5 text-orange-400" />
          Activity
        </h3>
      </div>

      {/* FIXED HEIGHT CHART → prevents Recharts -1 errors */}
      <div className="w-full h-64 px-4 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data.activityGraph}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              stroke="#facc15"
              tick={{ fontSize: 10, fill: "#facc15" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              stroke="#facc15"
              tick={{ fontSize: 10, fill: "#facc15" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1005",
                border: "1px solid #facc15",
                borderRadius: "8px",
                color: "#facc15",
              }}
              labelStyle={{
                fontSize: "10px",
                color: "#facc15",
              }}
            />

            <Line
              type="monotone"
              dataKey="New"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="Returning"
              stroke="#facc15"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityGraph;
