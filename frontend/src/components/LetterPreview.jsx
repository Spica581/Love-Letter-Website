import { useEffect, useState } from 'react';
import axios from 'axios';
import Tier1Letter from './Tier1Letter';
import Tier2Letter from './Tier2Letter';
import Tier3Letter from './Tier3Letter';

export default function LetterPreview({ letterId }) {
  const [letter, setLetter] = useState(null);

  useEffect(() => {
    axios.get(`/api/letters/${letterId}`).then(res => setLetter(res.data));
  }, [letterId]);

  if (!letter) return <div>Loading...</div>;

  const Component = letter.tier === 1 ? Tier1Letter : letter.tier === 2 ? Tier2Letter : Tier3Letter;
  return <Component letter={letter} />;
}
