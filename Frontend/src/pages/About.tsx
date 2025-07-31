import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; 
import backgroundImage from "../assets/backgroundd.png";

// Fix: Correct ease type using cubic-bezier array instead of string
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.25, 0.8, 0.25, 1], // Equivalent to easeOut
    },
  }),
};

const About = () => {
  const sections = [
    {
      title: "What is ",
      highlight: "CareerGenie.AI",
      content:
        "CareerGenie.AI is your all-in-one AI-powered career assistant that helps you build stunning resumes, receive personalized job guidance, and manage your career with ease.",
    },
    {
      title: "Our Vision",
      content:
        "We created CareerGenie.AI to revolutionize job search with smart automation and AI-powered career insights. Our mission is to empower every job seeker to confidently land their dream role.",
    },
    {
      title: "Built With",
      techStack: [
        "React",
        "Tailwind CSS",
        "TypeScript",
        "Zustand",
        "Node.js",
        "Express",
        "MongoDB",
        "OpenAI API",
      ],
    },
    {
      title: "Meet the Creator",
      content:
        "CareerGenie.AI was crafted with care by a passionate developer merging AI and career development into a seamless experience.",
    },
  ];

  return (
    <main
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Animated Overlay */}
      <div className="absolute inset-0 z-0 bg-black/80 backdrop-blur-md before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-500/10 before:to-yellow-400/10 before:animate-pulse" />

      {/* Content */}
      <div className="relative z-10 px-4 py-24 md:px-20 space-y-20">
        {sections.map((section, index) => (
          <motion.section
            key={index}
            className="max-w-5xl mx-auto p-12 md:p-16 rounded-[42px] bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl shadow-orange-400/30"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            custom={index}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              {section.title}
              {section.highlight && (
                <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent ml-1">
                  {section.highlight}
                </span>
              )}
            </h2>

            {section.techStack ? (
              <div className="flex flex-wrap justify-center gap-4 text-lg font-medium text-gray-200">
                {section.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-white/10 px-4 py-2 rounded-full border border-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-300 text-lg leading-relaxed">
                {section.content}
              </p>
            )}

            {section.title === "Meet the Creator" && (
              <div className="mt-8 text-center">
                <a
                  href="mailto:your.email@example.com"
                  className="inline-block bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold py-3 px-8 rounded-full hover:from-orange-400 hover:to-yellow-300 transition"
                >
                  Contact Me
                </a>
              </div>
            )}
          </motion.section>
        ))}
      </div>
    </main>
  );
};

export default About;