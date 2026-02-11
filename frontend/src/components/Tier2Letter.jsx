import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tier1Letter from './Tier1Letter';

export default function Tier2Letter({ letter }) {
  const [showHidden, setShowHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hearts, setHearts] = useState([]);

  // Floating hearts on scroll
  useEffect(() => {
    const handleScroll = () => {
      setHearts(prev => [...prev.slice(-6), { id: Date.now(), left: Math.random() * 90 + 5 }]);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: letter.colors.bg }}>
      {hearts.map(h => (
        <motion.div
          key={h.id}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ y: '-20vh', opacity: 0 }}
          transition={{ duration: 6 }}
          className="absolute text-4xl pointer-events-none"
          style={{ left: `${h.left}%`, color: letter.colors.accent }}
        >
          ❤️
        </motion.div>
      ))}

      <Tier1Letter letter={letter} />

      {/* Clickable Heart for Hidden Message */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          whileHover={{ scale: 1.4 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHidden(!showHidden)}
          className="text-7xl cursor-pointer"
        >
          ❤️
        </motion.div>
        {showHidden && letter.hidden_message && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-white/90 backdrop-blur px-8 py-4 rounded-2xl shadow text-center max-w-xs"
          >
            {letter.hidden_message}
          </motion.p>
        )}
      </div>

      {/* Music Toggle */}
      {letter.music_url && (
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => {
              const audio = document.getElementById('love-music');
              isPlaying ? audio.pause() : audio.play();
              setIsPlaying(!isPlaying);
            }}
            className="bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
          >
            {isPlaying ? '⏸️' : '🎵'} {isPlaying ? 'Pause Music' : 'Play Our Song'}
          </button>
          <audio id="love-music" src={`http://localhost:8000${letter.music_url}`} loop />
        </div>
      )}
    </div>
  );
}