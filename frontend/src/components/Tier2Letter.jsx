import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tier1Letter from './Tier1Letter';

export default function Tier2Letter({ letter }) {
  const [showHidden, setShowHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-8), { id: Date.now(), left: Math.random() * 100 }]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: letter.colors.bg }}>
      {/* Floating hearts */}
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-100vh', opacity: 1 }}
          transition={{ duration: 8, ease: "linear" }}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${heart.left}vw`, color: letter.colors.accent }}
        >
          ❤️
        </motion.div>
      ))}

      <Tier1Letter letter={letter} />

      {/* Clickable heart for hidden message */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <motion.div
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHidden(!showHidden)}
          className="text-7xl cursor-pointer hover:drop-shadow-2xl transition"
        >
          ❤️
        </motion.div>
        {showHidden && letter.hidden_message && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-lg font-medium max-w-xs mx-auto px-6 py-3 bg-white/80 rounded-2xl shadow"
            style={{ color: letter.colors.text }}
          >
            {letter.hidden_message}
          </motion.p>
        )}
      </div>

      {/* Music Player */}
      {letter.music_url && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => {
              const audio = document.getElementById('love-audio');
              if (isPlaying) audio.pause();
              else audio.play();
              setIsPlaying(!isPlaying);
            }}
            className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-pink-600 font-medium"
          >
            {isPlaying ? '⏸️ Pause Music' : '🎵 Play Our Song'}
          </button>
          <audio id="love-audio" src={`http://localhost:8000${letter.music_url}`} loop />
        </div>
      )}
    </div>
  );
}
