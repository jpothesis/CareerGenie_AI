import {
  Home,
  FileText,
  Brain,
  LineChart,
  GraduationCap,
  FlaskConical,
  Folder,
  User,
  type LucideIcon,
} from "lucide-react";

const sidebarItems = [
  { title: "Dashboard", Icon: Home, selected: true },
  { title: "Resume Builder", Icon: FileText, selected: false },
  { title: "Career Advisor", Icon: Brain, selected: false },
  { title: "Insights", Icon: LineChart, selected: false },
  { title: "Learn", Icon: GraduationCap, selected: false },
  { title: "AI Interviews", Icon: FlaskConical, selected: false },
  { title: "Job Tracker", Icon: Folder, selected: false },
  { title: "Profile", Icon: User, selected: false },
];

const RouteSelect = () => {
  return (
    <div className="space-y-1">
      {sidebarItems.map(({ title, Icon, selected }, index) => (
        <RouteItem key={index} Icon={Icon} selected={selected} title={title} />
      ))}
    </div>
  );
};

const RouteItem = ({
  selected,
  Icon,
  title,
}: {
  selected: boolean;
  Icon: LucideIcon;
  title: string;
}) => {
  return (
    <button
      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
        ${
          selected
            ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-black shadow-md"
            : "text-stone-400 hover:bg-gradient-to-r hover:from-orange-500 hover:to-yellow-400 hover:text-black hover:shadow-md hover:shadow-orange-400/40"
        }`}
    >
      <Icon
        className={`h-5 w-5 ${
          selected
            ? "text-black"
            : "text-stone-400 group-hover:text-black transition-all duration-200"
        }`}
      />
      <span>{title}</span>
    </button>
  );
};

export default RouteSelect;
