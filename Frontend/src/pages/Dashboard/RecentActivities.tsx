"use client";

import React from "react";
import { BadgeDollarSign } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

const RecentActivities: React.FC = () => {
  const { data, loading, error } = useDashboard();

  if (loading) return <p className="col-span-12 p-4">Loading activities...</p>;
  if (error || !data) return <p className="col-span-12 p-4 text-red-500">Failed to load activities.</p>;

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300 bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <BadgeDollarSign className="w-5 h-5 text-violet-600" />
          Career Genie Activities
        </h3>
        <button className="text-sm text-violet-600 hover:underline">
          See all
        </button>
      </div>

      <table className="w-full table-auto text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left py-2">Activity</th>
            <th className="text-left py-2">Date</th>
            <th className="text-left py-2 w-8">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.recentActivities.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-stone-50" : ""}>
              <td className="py-2 px-1">{item.description}</td>
              <td className="py-2 px-1">
                {new Date(item.timestamp).toLocaleDateString()}
              </td>
              <td className="py-2 px-1">Completed</td> {/* <-- Fixed line */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivities;
