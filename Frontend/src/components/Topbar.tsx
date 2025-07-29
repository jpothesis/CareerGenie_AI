const Topbar = () => {
  return (
    <div className="flex justify-between items-center bg-[#1a2238] text-white px-6 py-4 shadow">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <input
        className="px-4 py-1 rounded bg-[#2d3656] text-sm text-white outline-none"
        placeholder="Search..."
      />
    </div>
  );
};

export default Topbar;
