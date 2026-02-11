import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(true);   // Default = Sign Up
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      let res;
      if (isSignup) {
        res = await axios.post('/api/users/signup', { username, password });
      } else {
        const formData = new URLSearchParams({ username, password });
        res = await axios.post('/api/users/login', formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
      }

      // Save token & tier
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('tier', res.data.tier || 1);

      setMessage(isSignup ? '✅ Account created! Redirecting...' : '✅ Login successful!');
      
      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong';
      setMessage('❌ ' + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center romantic-bg">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-pink-200">

        <h1 className="text-5xl font-bold text-center text-pink-600 mb-2">💌 Love Letter</h1>
        <p className="text-center text-gray-500 mb-8">Write from the heart</p>

        <div className="flex mb-8 border-b border-pink-100">
          <button
            onClick={() => { setIsSignup(true); setMessage(''); }}
            className={`flex-1 pb-4 text-lg font-medium ${isSignup ? 'border-b-4 border-pink-600 text-pink-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setIsSignup(false); setMessage(''); }}
            className={`flex-1 pb-4 text-lg font-medium ${!isSignup ? 'border-b-4 border-pink-600 text-pink-600' : 'text-gray-500'}`}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-4 border border-pink-200 rounded-2xl focus:outline-none focus:border-pink-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 border border-pink-200 rounded-2xl focus:outline-none focus:border-pink-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white py-4 rounded-2xl text-xl font-medium transition"
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        {message && <p className="text-center mt-6 font-medium">{message}</p>}
      </div>
    </div>
  );
}