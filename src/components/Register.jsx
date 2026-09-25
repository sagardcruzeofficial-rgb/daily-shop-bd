import React, { useState, useContext } from 'react';
import { useAuth } from '../context/AuthContext';
import { StoreContext } from '../context/StoreContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { setActiveTab } = useContext(StoreContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signup(email, password, name);
      setActiveTab('Home');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-2xl shadow-sm border border-gray-200 font-sans">
      <h2 className="text-2xl font-black mb-6 text-center text-gray-900 border-l-4 border-[#f57224] pl-3">Create Account</h2>
      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1.5">Name</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-[#f57224] bg-gray-50"
            placeholder="Your Full Name"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1.5">Email</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-[#f57224] bg-gray-50"
            placeholder="your_email@example.com"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1.5">Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-[#f57224] bg-gray-50"
            placeholder="••••••••"
          />
        </div>
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-[#f57224] text-white py-2.5 rounded-lg text-xs font-bold hover:bg-orange-600 transition shadow-sm"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-gray-600 font-medium">
        Already have an account?{' '}
        <button 
          onClick={() => setActiveTab('Login')} 
          className="text-[#f57224] font-bold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
