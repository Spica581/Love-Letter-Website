import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Tier1Letter from '../components/Tier1Letter';
import Tier2Letter from '../components/Tier2Letter';
import Tier3Letter from '../components/Tier3Letter';

export default function PasswordGate() {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [letter, setLetter] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = async () => {
    if (!password) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:8000/api/letters/${id}`);
      if (!res.ok) throw new Error("Letter not found");

      const data = await res.json();
      
      if (data.password.toLowerCase() === password.toLowerCase()) {
        setLetter(data);
        setUnlocked(true);
      } else {
        setError("Wrong secret code 💔");
      }
    } catch (err) {
      setError("Could not open the letter. Please check the link.");
    } finally {
      setLoading(false);
    }
  };

  // If unlocked, render the actual letter
  if (unlocked && letter) {
    const Component = 
      letter.tier === 3 ? Tier3Letter :
      letter.tier === 2 ? Tier2Letter : 
      Tier1Letter;
    
    return <Component letter={letter} />;
  }

  // Password screen
  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Sealed Letter Header */}
        <div className="h-60 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center relative">
          <div className="text-[140px] drop-shadow-2xl">✉️</div>
          <div className="absolute top-6 right-6 text-5xl">🔒</div>
          <div className="absolute -bottom-6 text-6xl">💕</div>
        </div>

        <div className="p-10 text-center">
          <h2 className="text-4xl font-bold text-pink-700 mb-3">A letter from the heart</h2>
          <p className="text-gray-600 mb-8">This letter is sealed with a secret code</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter the secret code..."
            className="w-full text-center text-2xl py-5 border-2 border-pink-300 rounded-2xl focus:border-pink-600 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleUnlock}
            disabled={loading}
            className="mt-8 w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-5 rounded-2xl text-xl font-semibold disabled:opacity-70"
          >
            {loading ? "Opening..." : "Open Letter"}
          </motion.button>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-red-500 font-medium"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}