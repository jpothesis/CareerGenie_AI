import { Menu, X } from "lucide-react"
import { useState } from "react";
import { Link } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import logo from '../assets/logo.png';
import '../index.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 bg-white/30 text-black">
      <div className="container px-4 mx-auto flex justify-between   items-center text-sm relative">

        {/* Logo */}
        <div className="flex items-center">
          <img className="h-10 w-10 mr-2" src={logo} alt="logo" />
          <span className="text-xl tracking-tighter font-bold">CareerGenie.AI</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex ml-14 space-x-10 uppercase font-medium tracking-wide">
          <li><Link to="/" className="hover:text-yellow-500 transition">Home</Link></li>
          <li><Link to="/about" className="hover:text-yellow-500 transition">About</Link></li>
          <li><Link to="/resources" className="hover:text-yellow-500 transition">Resources</Link></li>
          <li><Link to="/docs" className="hover:text-yellow-500 transition">Docs</Link></li>
        </ul>

        {/* Sign In (Desktop Only) */}
        <div className="hidden lg:block">
          <Link
            to="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
          >
            Sign In
          </Link>
          &nbsp; / &nbsp;
          <Link
            to="/register" className="bg-gradient-to-r font-semibold bg-orange-500 py-2 px-3 rounded-full hover:bg-orange-400 transistion"
          >
            Create an Account
          </Link>
        </div>
        <div className="lg:hidden md:flex flex-col justify-end">
          <button
            onClick={toggleMobileMenu}
            className="text-black focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black bg-opacity-90 px-6 py-6 absolute w-full text-center text-white">
          <nav className="flex flex-col gap-4 text-lg font-medium">
            <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
            <Link to="/about" className="hover:text-yellow-400 transition">About</Link>
            <Link to="/resources" className="hover:text-yellow-400 transition">Resources</Link>
            <Link to="/docs" className="hover:text-yellow-400 transition">Docs</Link>
            <Link
              to="/login"
              className="bg-yellow-400 text-black mt-4 py-2 rounded-full hover:bg-yellow-300 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register" className="bg-gradient-to-r font-semibold bg-orange-500 py-2 px-3 rounded-full hover:bg-orange-400 transistion"
            >
              Create an Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

