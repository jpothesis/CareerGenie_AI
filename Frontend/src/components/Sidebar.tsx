import RouteSelect from "./RouteSelect";
import { AccountToggle } from "./AccountToggle";
import SearchInput from "./SearchInput";
import { Plan } from "./Plan";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full w-64 bg-[#121212] border-r border-orange-500/10 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg shadow-orange-300/10`}
    >
      {/* Close button on mobile */}
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={() => setIsOpen(false)}
          className="text-xl text-orange-400 hover:text-orange-300 transition"
        >
          ✕
        </button>
      </div>

      {/* Sidebar content */}
      <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)] p-4 space-y-4">
        <AccountToggle />
        <SearchInput />
        <RouteSelect />
      </div>

      {/* Plan toggle */}
      <div className="p-4 border-t border-orange-500/10">
        <Plan />
      </div>
    </aside>
  );
};

export default Sidebar;
