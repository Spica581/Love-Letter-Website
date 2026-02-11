import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tier2Letter from './Tier2Letter';

export default function Tier3Letter({ letter }) {
  const [step, setStep] = useState('intro');
  const [isDark, setIsDark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  };

  // Simple confetti
  useEffect(() => {
    if (showConfetti) {
      for (let i = 0; i < 80; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.innerText = ['❤️','💖','💗','💓'][Math.floor(Math.random()*4)];
          heart.style.position = 'fixed';
          heart.style.left = Math.random() * 100 + 'vw';
          heart.style.top = '-50px';
          heart.style.fontSize = '28px';
          heart.style.zIndex = 9999;
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 6000);
        }, i * 25);
      }
    }
  }, [showConfetti]);

  if (step === 'intro') {
    return (
      <div className="min-h-screen romantic-bg flex flex-col items-center justify-center text-center p-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-pink-700 mb-8"
        >
          Our Story
        </motion.h1>
        <button
          onClick={() => setStep('letter')}
          className="bg-pink-600 text-white px-16 py-6 rounded-3xl text-2xl font-medium hover:scale-110 transition"
        >
          Open the Letter →
        </button>
      </div>
    );
  }

  if (step === 'letter') {
    return <Tier2Letter letter={letter} />;
  }

  if (step === 'surprise') {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-950 text-white' : 'romantic-bg'} flex flex-col items-center justify-center text-center p-6 transition-colors`}>
        <button onClick={() => setIsDark(!isDark)} className="absolute top-8 right-8 text-3xl">
          {isDark ? '☀️' : '🌙'}
        </button>

        <h1 className="text-6xl mb-12">Will you be my Valentine?</h1>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setClickCount(c => c + 1);
            if (clickCount >= 2) triggerConfetti();
            alert("❤️ I love you more than words can say!");
          }}
          className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-4xl px-20 py-10 rounded-3xl font-bold shadow-2xl"
        >
          YES, FOREVER ❤️
        </motion.button>

        <p className="mt-16 text-xl opacity-70">Click the button a few times for a surprise...</p>
      </div>
    );
  }
}