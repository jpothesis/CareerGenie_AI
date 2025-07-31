import {
  BookOpen,
  FileText,
  Globe,
  Youtube,
  Download,
} from "lucide-react";
import backgroundImage from "../assets/backgrounddd.png";

const resources = [
  {
    icon: FileText,
    title: "Resume Templates",
    description: "Free and modern templates to get started quickly.",
    link: "#",
  },
  {
    icon: BookOpen,
    title: "Career Guides",
    description: "Comprehensive resources to plan your career path.",
    link: "#",
  },
  {
    icon: Youtube,
    title: "Mock Interview Videos",
    description: "Watch sample interviews with expert commentary.",
    link: "#",
  },
  {
    icon: Globe,
    title: "Top Job Boards",
    description: "Explore job opportunities from the best platforms.",
    link: "#",
  },
];

const ResourceTile = ({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}) => {
  return (
    <div className="w-full max-w-5xl bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-6 mb-6 text-white flex flex-col sm:flex-row items-start gap-6 shadow-lg hover:shadow-orange-500/30 transition duration-300">
      <Icon size={40} className="text-orange-400" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-3 text-orange-300 hover:text-orange-400 transition-colors"
        >
          <Download size={16} className="mr-1" />
          View Resource
        </a>
      </div>
    </div>
  );
};

const Resources = () => {
  return (
    <div
      className="min-h-screen px-4 py-20 bg-cover bg-center text-white flex flex-col items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        backgroundBlendMode: "overlay",
      }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
        Helpful{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
          Resources
        </span>
      </h1>

      <div className="w-full flex flex-col items-center px-4">
        {resources.map((res, i) => (
          <ResourceTile
            key={i}
            icon={res.icon}
            title={res.title}
            description={res.description}
            link={res.link}
          />
        ))}
      </div>
    </div>
  );
};

export default Resources;
