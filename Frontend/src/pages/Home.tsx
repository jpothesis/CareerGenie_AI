import { Gem, ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background.png';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <main
      className="relative bg-cover bg-center bg-no-repeat min-h-screen flex flex-col lg:flex-row items-center lg:justify-between px-4 lg:px-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Left Content */}
      <div className="relative z-10 max-w-xl py-20 lg:py-0 flex flex-col justify-center items-center lg:items-start h-full lg:min-h-screen text-center lg:text-left">
        {/* Tag */}
        <div className="relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-[#656565] to-[#e99b63] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full">
          <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1 text-white text-sm font-medium">
            <Gem size={16} />
            INTRODUCING
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8 text-white">
          Welcome To
          <br />
          CareerGenie.AI
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg tracking-wider text-gray-300 max-w-[25rem] lg:max-w-[30rem]">
          Your AI-powered 3D career assistant for smarter decisions.
          <br />
          🚀 Tech Stack: React JS • Tailwind CSS • Spline • Lucide
        </p>

        {/* Get Started Button - Centered */}
        <div className="mt-12">
          <button
            onClick={() => navigate('/signup')}
            className="border border-[#2a2a2a] py-2 sm:py-3 px-6 sm:px-8 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a] bg-gray-300 text-black hover:text-white"
          >
            GET STARTED <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
      </div>

      {/* Right - Scaled Bot */}
      <div className="relative z-10 w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-center items-center">
        <div className="scale-[1.3] w-full h-full max-w-[600px]">
          <Spline scene="https://prod.spline.design/nGHLyynb1ukRcpu7/scene.splinecode" />
        </div>
      </div>
    </main>
  );
};

export default Hero;
