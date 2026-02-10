import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const url = isSignup ? '/api/users/signup' : '/api/users/login';
      const data = isSignup 
        ? { username, password } 
        : new URLSearchParams({ username, password });

      const res = await axios.post(url, data, {
        headers: isSignup ? {} : { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (isSignup) {
        setMessage('Account created! You can now login.');
        setIsSignup(false);
      } else {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('tier', res.data.tier);
        navigate('/');
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center romantic-bg">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full border border-pink-200">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">💌 Love Letter</h1>
        <p className="text-center text-gray-500 mb-8">Create something beautiful</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-medium transition"
          >
            {isSignup ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignup(!isSignup)} className="text-pink-600 underline">
            {isSignup ? 'Login' : 'Sign up'}
          </button>
        </p>

        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
}
