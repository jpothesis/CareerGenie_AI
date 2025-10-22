import { Gem, ArrowRight } from "lucide-react";
import Spline from "@splinetool/react-spline";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import backgroundImage from "../assets/background.png";

const Hero = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <main
      className="relative bg-cover bg-center bg-no-repeat min-h-screen flex flex-col lg:flex-row items-center lg:justify-between px-4 lg:px-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

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
        </p>

        {/* Get Started Button */}
        <div className="mt-12">
          <button
            onClick={() => navigate("/register")}
            className="border border-gray-500 py-2 sm:py-3 px-6 sm:px-8 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-orange-500 hover:text-white bg-white text-black"
          >
            GET STARTED <ArrowRight size={16} className="inline ml-1" />
          </button>
        </div>
      </div>

      {/* Right - 3D Bot Section */}
      <div className="relative z-10 w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-center items-center">
        <div className="scale-[1.3] w-full h-full max-w-[600px]">
          <Spline scene="https://prod.spline.design/nGHLyynb1ukRcpu7/scene.splinecode" />
        </div>
      </div>
    </main>
  );
};

export default Hero;
