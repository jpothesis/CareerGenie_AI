import { useState } from "react";
import {
  FileText,
  Brain,
  LineChart,
  GraduationCap,
  FlaskConical,
  Folder,
  LucideIcon,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "AI Resume Editor, templates, suggestions",
  },
  {
    icon: Brain,
    title: "Career Advisor",
    description: "Career advice, role matching, learning paths",
  },
  {
    icon: LineChart,
    title: "Insights",
    description: "Skill gaps, salary projections, market trends",
  },
  {
    icon: GraduationCap,
    title: "Learn",
    description: "Personalized course recommendations",
  },
  {
    icon: FlaskConical,
    title: "AI Interviews",
    description: "Mock interviews, feedback, tips",
  },
  {
    icon: Folder,
    title: "Job Tracker",
    description: "Saved jobs, applications, status",
  },
];

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`w-80 h-52 perspective cursor-pointer`}
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center transform transition-transform">
          <Icon size={40} className="text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold text-center">{title}</h3>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full bg-black/60 backdrop-blur-lg border border-white/20 text-white rounded-2xl p-6 shadow-lg transform rotate-y-180 flex items-center justify-center">
          <p className="text-md text-center">{description}</p>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="min-h-screen px-4 py-20 bg-gradient-to-br from-black via-gray-900 to-neutral-900 text-white">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
        Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Features</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
        {features.map((feature, i) => (
          <FeatureCard
            key={i}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
