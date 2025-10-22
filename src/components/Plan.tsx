export const Plan = () => {
  return (
    <div className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 border-t border-orange-500/10 px-2 justify-end text-xs bg-[#0a0a0a]">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-white">Enterprise</p>
          <p className="text-orange-300">Pay as you go</p>
        </div>

        <button className="px-3 py-1.5 text-sm font-medium text-black rounded bg-gradient-to-r from-orange-400 to-yellow-300 hover:opacity-90 transition-all shadow-sm shadow-orange-500/20">
          Support
        </button>
      </div>
    </div>
  );
};
