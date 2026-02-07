import { useState } from 'react';
import { motion } from 'framer-motion';
import Tier1Letter from './Tier1Letter';

export default function Tier2Letter({ letter }) {
  const [showHidden, setShowHidden] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);

  return (
    <div onScroll={() => {/* Floating hearts */}}>
      <Tier1Letter letter={letter} />
      <motion.div whileHover={{ scale: 1.1 }} onClick={() => setShowHidden(!showHidden)}>
        ❤️ Click for surprise
      </motion.div>
      {showHidden && <p>{letter.hidden_message}</p>}
      {letter.music_url && (
        <button onClick={() => setPlayMusic(!playMusic)}>{playMusic ? 'Pause' : 'Play Music'}</button>
      )}
      {playMusic && <audio src={letter.music_url} autoPlay loop />}
      {/* Typing animation, hover effects */}
    </div>
  );
}
