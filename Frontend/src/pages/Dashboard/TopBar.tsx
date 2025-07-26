import { Calendar } from "lucide-react";

export const TopBar = () => {
  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        {/* Left Side */}
        <div>
          <span className="text-sm font-bold block">🚀 Good morning, Jaanvi!</span>
          <span className="text-xs block text-stone-500">
            Saturday, July 26th 2025
          </span>
        </div>

        {/* Right Button */}
        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          <Calendar className="w-4 h-4" />
          <span>Prev 6 Months</span>
        </button>
      </div>
    </div>
  );
};
