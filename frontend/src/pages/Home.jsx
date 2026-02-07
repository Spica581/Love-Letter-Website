import { useState } from 'react';
import LetterEditor from '../components/LetterEditor';

export default function Home() {
  const tier = localStorage.getItem('tier') || 1;
  if (!localStorage.getItem('token')) return <div>Login first</div>;

  return (
    <div className="p-4">
      <h1>Create Love Letter (Tier {tier})</h1>
      <LetterEditor tier={parseInt(tier)} />
    </div>
  );
}
