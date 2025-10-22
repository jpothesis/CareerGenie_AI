import { Search, Command } from "lucide-react";
import { useState } from "react";
import { CommandMenu } from "./CommandMenu"; // adjust path if needed

const SearchInput = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-[#141414] mb-4 relative rounded-md flex items-center px-3 py-1.5 text-sm border border-orange-500/20 shadow-inner shadow-orange-500/5">
        {/* Left Icon */}
        <Search className="w-4 h-4 text-orange-300 mr-2" />

        {/* Input triggers Command Menu */}
        <input
          onFocus={(e) => {
            e.target.blur();
            setOpen(true);
          }}
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent placeholder:text-orange-100 text-white focus:outline-none"
        />

        {/* Right shortcut hint */}
        <span className="px-1.5 py-0.5 text-xs flex items-center gap-0.5 shadow bg-[#1a1a1a] rounded absolute right-1.5 top-1/2 -translate-y-1/2 text-orange-300 border border-orange-500/20">
          <Command className="w-3 h-3" />
          K
        </span>
      </div>

      {/* Command Menu */}
      <CommandMenu open={open} setOpen={setOpen} />
    </>
  );
};

export default SearchInput;
