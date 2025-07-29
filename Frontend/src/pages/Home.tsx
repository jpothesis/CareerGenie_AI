import { Gem, ExternalLink, ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)] px-4 lg:px-20">
      <div className="max-w-xl ml-[5%] z-10 mt-[90%] md:mt-[60%] lg:mt-0">
        {/* Tag box with gradient */}
        <div className='relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-[#656565] to-[#e99b63] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full'>
          <div className='absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1 text-white text-sm font-medium'>
            <Gem size={16} />
            INTRODUCING
          </div>
        </div>

        {/* Main title */}
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8'>
          Welcome To
          <br />
          CareerGenie.AI
        </h1>

        {/* Description */}
        <p className='text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem]'>
          Your AI-powered 3D career assistant for smarter decisions.
          <br />
          🚀 Tech Stack: React JS • Tailwind CSS • Spline • Lucide
        </p>

        {/* Buttons */}
        <div className='flex gap-4 mt-12'>
          <a
            className='border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-5 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]'
            href='#'
          >
            DOCUMENTATION <ExternalLink size={16} className="inline ml-1" />
          </a>

          <button
            onClick={() => navigate('/signup')}
            className='border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-5 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a] bg-gray-300 text-black hover:text-white'
          >
            GET STARTED <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
      </div>

      {/* 3D Spline */}
      <Spline scene="https://prod.spline.design/nGHLyynb1ukRcpu7/scene.splinecode" />
    </main>
  );
};

export default Hero;
