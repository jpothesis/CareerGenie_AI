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
      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        selected
          ? "bg-white text-black shadow"
          : "bg-transparent text-stone-500 hover:bg-stone-200"
      }`}
    >
      <Icon className={`h-5 w-5 ${selected ? "text-violet-500" : ""}`} />
      <span>{title}</span>
    </button>
  );
};

export default RouteSelect;
