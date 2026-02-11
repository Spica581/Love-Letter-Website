import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();

  const openEnvelope = () => {
    setIsOpening(true);
    setTimeout(() => {
      // For demo: go to admin to create letter
      alert("💌 Beautiful envelope opened!\n\nGo to /admin to create a new love letter.");
    }, 1300);
  };

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, rotate: -8 }}
          animate={isOpening ? { scale: 1.2, rotate: 12 } : { scale: 1, rotate: -8 }}
          transition={{ duration: 1 }}
          onClick={openEnvelope}
          className="cursor-pointer mx-auto w-[380px] h-[380px] bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 rounded-[4.5rem] shadow-2xl flex items-center justify-center relative overflow-hidden"
        >
          <motion.div
            animate={isOpening ? { rotateX: 180, y: -30 } : { rotateX: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-gradient-to-br from-pink-400 to-rose-600 origin-top rounded-t-[3.5rem] flex items-center justify-center shadow-inner"
          >
            <span className="text-9xl drop-shadow-2xl">💌</span>
          </motion.div>

          <div className="text-[200px] drop-shadow-2xl z-10">✉️</div>

          {isOpening && (
            [...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: 120, x: (i - 7) * 25, opacity: 0 }}
                animate={{ y: -450, opacity: [0, 1, 0] }}
                transition={{ delay: i * 0.07, duration: 2 }}
                className="absolute text-5xl pointer-events-none"
                style={{ left: `${35 + i * 4}%` }}
              >
                ❤️
              </motion.div>
            ))
          )}
        </motion.div>

        <p className="mt-14 text-4xl font-medium text-pink-700">Click the envelope</p>
        <p className="text-pink-500 mt-2">A love letter awaits...</p>
      </div>
    </div>
  );
}