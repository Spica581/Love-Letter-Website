import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();

  const openEnvelope = () => {
    setIsOpening(true);
    
    setTimeout(() => {
      navigate('/letter/new');   // We will handle "new" as a special case
    }, 1200);
  };

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, rotate: -8 }}
          animate={isOpening ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: -8 }}
          transition={{ duration: 0.8 }}
          onClick={openEnvelope}
          className="cursor-pointer mx-auto w-96 h-96 bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 rounded-[4rem] shadow-2xl flex items-center justify-center relative overflow-hidden"
        >
          {/* Envelope flap */}
          <motion.div
            animate={isOpening ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-1/2 bg-gradient-to-br from-pink-400 to-rose-600 origin-top rounded-t-[3rem] flex items-center justify-center"
          >
            <span className="text-8xl drop-shadow-lg">💌</span>
          </motion.div>

          <div className="text-[180px] drop-shadow-2xl">✉️</div>

          {/* Flying hearts during opening */}
          {isOpening && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 100, x: (i - 6) * 20, opacity: 0 }}
                  animate={{ y: -400, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 1.8 }}
                  className="absolute text-4xl"
                  style={{ left: `${40 + i * 5}%` }}
                >
                  ❤️
                </motion.div>
              ))}
            </>
          )}
        </motion.div>

        <p className="mt-12 text-3xl font-medium text-pink-700 tracking-wide">
          Click the envelope to open your letter
        </p>
      </div>
    </div>
  );
}