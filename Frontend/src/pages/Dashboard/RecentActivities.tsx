"use client";

import React from "react";
import { BadgeDollarSign } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

const RecentActivities: React.FC = () => {
  const { data, loading, error } = useDashboard();

  if (loading)
    return <p className="col-span-12 p-4 text-orange-200">Loading activities...</p>;
  if (error || !data)
    return <p className="col-span-12 p-4 text-red-400">Failed to load activities.</p>;

  return (
    <div className="col-span-12 p-4 rounded border border-orange-300/30 bg-gradient-to-br from-[#2c1b0a] via-[#1f1306] to-[#0f0a03] shadow-md hover:shadow-orange-400/20 transition-all">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-orange-100">
          <BadgeDollarSign className="w-5 h-5 text-orange-400" />
          Career Genie Activities
        </h3>
        <button className="text-sm text-orange-400 hover:underline">
          See all
        </button>
      </div>

      <table className="w-full table-auto text-sm text-orange-100">
        <thead className="text-orange-300/70">
          <tr>
            <th className="text-left py-2">Activity</th>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2 w-8">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.recentActivities.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? "bg-orange-400/5"
                  : "bg-transparent hover:bg-orange-400/10"
              }
            >
              <td className="py-2 px-1">{item.description}</td>
              <td className="py-2 px-1">
                {new Date(item.timestamp).toLocaleDateString()}
              </td>
              <td className="py-2 px-1 text-green-300">Completed</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivities;
