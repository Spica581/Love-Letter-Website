import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Tier1Letter from '../components/Tier1Letter';
import Tier2Letter from '../components/Tier2Letter';
import Tier3Letter from '../components/Tier3Letter';

export default function LetterViewer() {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:8000/api/letters/${id}`)
      .then(res => res.json())
      .then(data => {
        setLetter(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Letter not found 💔");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen romantic-bg flex items-center justify-center text-3xl text-pink-600">Opening the letter...</div>;
  if (error) return <div className="min-h-screen romantic-bg flex items-center justify-center text-2xl text-red-500">{error}</div>;

  const Component = letter.tier === 3 ? Tier3Letter : letter.tier === 2 ? Tier2Letter : Tier1Letter;
  return <Component letter={letter} />;
}