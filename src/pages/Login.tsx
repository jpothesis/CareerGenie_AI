import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios.js';
import useAuthStore from '../store/auth';
import backgroundImage from '../assets/backgroundd.png'; // adjust if using Vite or CRA

const Login = () => {
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const res = await api.post('/auth/login', { email, password });
      console.log("SERVER RESPONSE:", res.data);

      // GET THE TOKEN
      const token = res.data.token || res.data.accessToken;

      if (!token) {
        throw new Error("Server did not send a token!");
      }
      // 3. Save Token to localStorage
      localStorage.setItem('jwttoken', token);
      localStorage.setItem('user', JSON.stringify(res.data.user))
      // 4. Update State
      setUser(res.data.user, token);
      console.log("Token saved to localStorage as 'jwttoken'");
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/10 backdrop-blur-md text-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

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

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-semibold py-3 rounded-lg transition hover:from-orange-400 hover:to-yellow-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
