import { useState } from 'react';
import { motion } from 'framer-motion';
import Tier2Letter from './Tier2Letter';

export default function Tier3Letter({ letter }) {
  const [section, setSection] = useState('intro');
  const [unlocked, setUnlocked] = useState(false);
  const [inputPass, setInputPass] = useState('');

  if (!unlocked) {
    return (
      <div>
        <input value={inputPass} onChange={e => setInputPass(e.target.value)} placeholder="Password" />
        <button onClick={() => setUnlocked(inputPass === letter.password)}>Unlock</button>
      </div>
    );
  }

  return (
    <div>
      {section === 'intro' && <p>Intro...</p>}
      {section === 'letter' && <Tier2Letter letter={letter} />}
      {section === 'surprise' && (
        <>
          <p>Will you be my Valentine?</p>
          <motion.div onClick={() => {/* Confetti */}} animate={{ opacity: [0, 1] }}>🎉</motion.div>
        </>
      )}
      <button onClick={() => setSection('letter')}>Next</button>
      {/* Photos, pop-ups, day/night toggle, heartbeat */}
      <button onClick={() => {/* Toggle dark mode */}}>Day/Night</button>
    </div>
  );
}
