import { TrendingUp } from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";

const StatCards = () => {
  const { data, loading, error } = useDashboard();

  if (loading)
    return <p className="col-span-12 p-4 text-white">Loading stats...</p>;

  if (error || !data)
    return (
      <p className="col-span-12 p-4 text-red-400">Failed to load stats</p>
    );

  return (
    <>
      <Card
        title="Opportunities Matched"
        value={`${data.matchedJobs} Jobs`}
        pillText="↑ 12% from last week"
        trend="up"
        period=""
      />
      <Card
        title="Resume Score"
        value={`${data.resumeScore} / 100`}
        pillText="Improve by optimizing sections"
        trend="up"
        period=""
      />
      <Card
        title="AI Interview Performance"
        value={`${data.interviewScore} / 5`}
        pillText="Average score last 5 attempts"
        trend="up"
        period=""
      />
      <Card
        title="Learning Progress"
        value={`${data.learningProgress}%`}
        pillText="Completed 4 / 6 courses"
        trend="up"
        period=""
      />
    </>
  );
};

export default StatCards;

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
    <div className="col-span-12 sm:col-span-6 lg:col-span-3 p-5 rounded-xl border border-orange-300/30 shadow-md hover:shadow-orange-400/30 transition-all 
      bg-gradient-to-br from-[#2c1b0a] via-[#3a230d] to-[#1c1005]">
      <div className="flex mb-6 items-start justify-between">
        <div>
          <h3 className="text-sm text-orange-100 mb-1">{title}</h3>
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
            {value}
          </p>
        </div>

        <span
          className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
            trend === "up"
              ? "bg-green-900 text-green-300"
              : "bg-red-900 text-red-300"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {pillText}
        </span>
      </div>

      {period && <p className="text-xs text-orange-300">{period}</p>}
    </div>
  );
};
