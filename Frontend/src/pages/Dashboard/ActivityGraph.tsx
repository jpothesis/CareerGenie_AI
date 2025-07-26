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

const data = [
  {
    name: "Jan",
    Returning: 275,
    New: 41,
  },
  {
    name: "Feb",
    Returning: 620,
    New: 96,
  },
  {
    name: "Mar",
    Returning: 202,
    New: 192,
  },
  {
    name: "Apr",
    Returning: 500,
    New: 50,
  },
  {
    name: "May",
    Returning: 355,
    New: 400,
  },
  {
    name: "Jun",
    Returning: 875,
    New: 200,
  },
  {
    name: "Jul",
    Returning: 700,
    New: 205,
  },
];

const ActivityGraph = () => {
  return (
    <div className="col-span-8 overflow-hidden rounded border border-stone-300 bg-white shadow-sm">
      <div className="p-4 border-b border-stone-200">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <User className="w-5 h-5 text-purple-700" />
          Activity
        </h3>
      </div>

      <div className="h-64 px-4 py-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="#e4e4e7" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="text-xs font-medium"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs font-medium"
            />
            <Tooltip
              wrapperClassName="text-sm"
              labelClassName="text-xs text-stone-500"
              contentStyle={{ borderRadius: "8px" }}
            />
            <Line
              type="monotone"
              dataKey="New"
              stroke="#18181b"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="Returning"
              stroke="#5b21b6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActivityGraph;
