import { TrendingUp } from "lucide-react";

export const StatCards = () => {
  return (
    <>
      <Card
        title="Opportunities Matched"
        value="56 Jobs"
        pillText="↑ 12% from last week"
        trend="up"
        period=""
      />
      <Card
        title="Resume Score"
        value="82 / 100"
        pillText="Improve by optimizing sections"
        trend="up"
        period=""
      />
      <Card
        title="AI Interview Performance"
        value="4.2 / 5"
        pillText="Average score last 5 attempts"
        trend="up"
        period=""
      />
      <Card
        title="Learning Progress"
        value="68%"
        pillText="Completed 4 / 6 courses"
        trend="up"
        period=""
      />
    </>
  );
};

const Card = ({
  title,
  value,
  pillText,
  trend,
  period,
}: {
  title: string;
  value: string;
  pillText: string;
  trend: "up" | "down";
  period?: string;
}) => {
  return (
    <div className="col-span-3 p-4 rounded-xl border border-stone-300 shadow-sm bg-white hover:shadow-md transition ">
      <div className="flex mb-6 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>

        <span
          className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {pillText}
        </span>
      </div>

      {period && <p className="text-xs text-stone-500">{period}</p>}
    </div>
  );
};
