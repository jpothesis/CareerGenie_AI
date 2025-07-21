import { useState } from 'react';
import { z } from 'zod';
import api from '../lib/axios';
import useAuth from '../store/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Register() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      schema.parse(form);
      const res = await api.post('/register', form);
      setUser(res.data);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Register</h2>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border" />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}
