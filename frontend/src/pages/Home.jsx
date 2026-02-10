import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LetterEditor from '../components/LetterEditor';

export default function Home() {
  const [tier, setTier] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedTier = localStorage.getItem('tier');
    if (!token) {
      navigate('/login');
    } else {
      setTier(parseInt(savedTier) || 1);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen romantic-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-pink-700 mb-2">💖 My Love Letter</h1>
          <p className="text-xl text-pink-600">Tier {tier} • Create something unforgettable</p>
        </div>

        <LetterEditor tier={tier} />
      </div>
    </div>
  );
}
