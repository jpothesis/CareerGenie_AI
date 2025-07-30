import { useState } from "react";
import { Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 py-4 px-4 lg:px-20 backdrop-blur-lg border-b border-neutral-700/80 bg-white/10 text-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img className="h-10 w-10" src={logo} alt="logo" />
          <span className="text-2xl font-semibold tracking-tighter text-white">CareerGenie.AI</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-12 items-center text-lg font-semibold tracking-wide uppercase text-white">
          <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
          <Link to="/about" className="hover:text-yellow-500 transition">About</Link>
          <Link to="/features" className="hover:text-yellow-500 transition">Features</Link>
          <Link to="/docs" className="hover:text-yellow-500 transition">Resources</Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex gap-3">
          <Link
            to="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-gradient-to-r font-semibold from-orange-500 to-yellow-400 py-2 px-4 rounded-full hover:from-orange-400 hover:to-yellow-300 transition"
          >
            Create an Account
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button onClick={toggleMobileMenu} className="md:hidden text-3xl p-1 z-50">
          <i className={`bx ${menuOpen ? "bx-x" : "bx-menu"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-90 text-white px-6 py-6 z-40">
          <nav className="flex flex-col gap-6 text-xl font-semibold items-center justify-center h-full tracking-wide uppercase">
            <Link to="/" onClick={toggleMobileMenu} className="hover:text-yellow-400">Home</Link>
            <Link to="/about" onClick={toggleMobileMenu} className="hover:text-yellow-400">About</Link>
            <Link to="/features" onClick={toggleMobileMenu} className="hover:text-yellow-400">Features</Link>
            <Link to="/docs" onClick={toggleMobileMenu} className="hover:text-yellow-400">Resources</Link>
            <Link
              to="/login"
              onClick={toggleMobileMenu}
              className="bg-yellow-400 text-black mt-4 py-2 px-6 rounded-full hover:bg-yellow-300 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={toggleMobileMenu}
              className="bg-gradient-to-r from-orange-500 to-yellow-400 font-semibold py-2 px-6 rounded-full hover:from-orange-400 hover:to-yellow-300 transition"
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
