const Topbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 
      bg-gradient-to-r from-[#2c1b0a] via-[#3a230d] to-[#1c1005] 
      text-orange-100 shadow-inner shadow-orange-500/20 rounded-b-lg">
      
      <h2 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 text-transparent bg-clip-text">
        Dashboard
      </h2>

      <input
        className="px-4 py-2 rounded-md text-sm text-orange-100 placeholder:text-orange-300 
        bg-[#2b1a09] border border-orange-300/20 outline-none focus:ring-2 focus:ring-orange-400/30 transition-all"
        placeholder="Search..."
      />
    </div>
  );
};

export default Topbar;

