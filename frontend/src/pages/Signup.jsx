import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('/api/users/signup', { username, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('tier', res.data.tier || 1);
      navigate('/');
    } catch (err) {
      alert('Signup error');
    }
  };

  return (
    <div className="p-4">
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
