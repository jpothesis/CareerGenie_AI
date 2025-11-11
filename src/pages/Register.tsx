import { useState } from 'react';
import api from '../lib/axios.js';
import useAuthStore from '../store/auth';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/backgroundd.png';

const Register = () => {
  const { setUser } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const res = await api.post('/auth/signup', { name, email, password });
      setUser(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-gray-900"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Register Card */}
      <form
        onSubmit={handleSignup}
        className="relative z-10 bg-white/10 backdrop-blur-md text-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 bg-black/40 border border-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 bg-black/40 border border-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 mb-4 bg-black/40 border border-white/20 rounded-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold py-3 rounded-lg transition hover:from-orange-400 hover:to-yellow-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
