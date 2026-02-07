import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LetterEditor from '../components/LetterEditor';

export default function Home() {
  const tier = localStorage.getItem('tier') || 1;
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  if (!token) {
    const useDemo = () => {
      localStorage.setItem('token', 'dev-token');
      localStorage.setItem('tier', '1');
      window.location.reload();
    };

    return (
      <div className="p-4">
        <h2 className="mb-2">Login required</h2>
        <p className="mb-4">You need to <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to access the editor.</p>
        <div className="flex gap-2">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/signup" className="btn">Sign up</Link>
          <button onClick={useDemo} className="btn">Use demo token</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1>Create Love Letter (Tier {tier})</h1>
      <LetterEditor tier={parseInt(tier)} />
    </div>
  );
}
