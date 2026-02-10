import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tier1Letter from '../components/Tier1Letter';
import Tier2Letter from '../components/Tier2Letter';
import Tier3Letter from '../components/Tier3Letter';

export default function LetterView() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/letters/${id}`)
      .then(res => res.json())
      .then(data => {
        setLetter(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl">Opening the letter...</div>;
  if (!letter) return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Letter not found 💔</div>;

  const Component = letter.tier === 3 ? Tier3Letter : letter.tier === 2 ? Tier2Letter : Tier1Letter;

  return <Component letter={letter} isPublic={true} />;
}
