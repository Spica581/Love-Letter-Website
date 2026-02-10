import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tier2Letter from './Tier2Letter';

export default function Tier3Letter({ letter }) {
  const [step, setStep] = useState('password');
  const [inputPassword, setInputPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePassword = () => {
    if (inputPassword.toLowerCase() === (letter.password || '').toLowerCase()) {
      setIsUnlocked(true);
      setStep('intro');
    } else {
      alert("That's not the secret code 💔 Try again.");
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // Simple confetti
  useEffect(() => {
    if (showConfetti) {
      const colors = ['#e11d48', '#db2777', '#f472b6'];
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.textContent = '❤️';
          heart.style.position = 'fixed';
          heart.style.left = Math.random() * 100 + 'vw';
          heart.style.top = '-50px';
          heart.style.fontSize = '30px';
          heart.style.zIndex = '9999';
          heart.style.pointerEvents = 'none';
          document.body.appendChild(heart);

          setTimeout(() => heart.remove(), 5000);
        }, i * 30);
      }
    }
  }, [showConfetti]);

  if (step === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-bg">
        <div className="text-center">
          <h2 className="text-3xl mb-6">This letter is locked with a secret code ❤️</h2>
          <input
            type="text"
            value={inputPassword}
            onChange={e => setInputPassword(e.target.value)}
            placeholder="Enter the secret code..."
            className="px-8 py-4 rounded-2xl text-xl border-2 border-pink-300 focus:border-pink-600 w-96"
          />
          <button
            onClick={handlePassword}
            className="block mx-auto mt-6 bg-pink-600 text-white px-10 py-4 rounded-2xl text-lg font-medium hover:bg-pink-700"
          >
            Unlock the Letter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isDark ? 'bg-gray-950 text-white' : 'romantic-bg'} style={{ minHeight: '100vh' }}>
      {/* Day/Night Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur p-3 rounded-full shadow"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {step === 'intro' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex flex-col items-center justify-center text-center p-6"
        >
          <h1 className="text-5xl font-bold mb-8">Our Story Begins Here...</h1>
          <button
            onClick={() => setStep('letter')}
            className="bg-pink-600 text-white px-12 py-5 rounded-3xl text-2xl font-medium hover:scale-110 transition"
          >
            Open the Letter →
          </button>
        </motion.div>
      )}

      {step === 'letter' && (
        <Tier2Letter letter={letter} />
      )}

      {step === 'surprise' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-6xl mb-10">Will you be my Valentine?</h1>
          
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              triggerConfetti();
              alert("❤️ I knew you'd say yes! I love you so much.");
            }}
            className="bg-gradient-to-r from-pink-500 to-rose-600 text-white text-3xl px-16 py-8 rounded-3xl font-bold shadow-2xl"
          >
            YES, FOREVER ❤️
          </motion.button>

          <p className="mt-12 text-xl opacity-75">Click the button for a surprise...</p>
        </div>
      )}

      {step === 'letter' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          <button
            onClick={() => setStep('surprise')}
            className="bg-white/90 backdrop-blur px-8 py-4 rounded-2xl shadow font-medium"
          >
            Next Chapter →
          </button>
        </div>
      )}
    </div>
  );
}
