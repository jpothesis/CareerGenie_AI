import { useState } from 'react';
import api from '../lib/axios';       // Axios instance
import useAuth from '../store/auth';  // Zustand store

const Register = () => {
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      const res = await api.post('/register', { name, email, password });
      console.log('✅ Registered:', res.data);
      setUser(res.data); // Save user to Zustand global store
      // Optional: redirect using react-router-dom → navigate('/')
    } catch (err: any) {
      console.error('❌ Registration failed:', err);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
 