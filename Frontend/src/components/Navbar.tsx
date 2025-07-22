import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-semibold text-purple-600">
        CareerGenie.AI
      </Link>
      <div className="space-x-4">
        <Link to="/" className="text-gray-600 hover:text-purple-600 transition">
          Home
        </Link>
        <Link to="/about" className="text-gray-600 hover:text-purple-600 transition">
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
