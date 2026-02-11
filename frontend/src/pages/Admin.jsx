import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [adminPass, setAdminPass] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [letters, setLetters] = useState([]);

  // Form states
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [colors, setColors] = useState({ bg: '#fff0f5', text: '#4a2c2a', accent: '#e11d48' });
  const [hiddenMessage, setHiddenMessage] = useState('');
  const [password, setPassword] = useState('');
  const [tier, setTier] = useState(2);
  const [musicFile, setMusicFile] = useState(null);
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  const checkAdmin = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/all?password=${encodeURIComponent(adminPass)}`);
      if (res.ok) {
        const data = await res.json();
        setLetters(data);
        setIsAuthenticated(true);
      } else {
        alert("Wrong admin password");
      }
    } catch (err) {
      alert("Error connecting to server");
    }
  };

  const createLetter = async () => {
    setStatus("Creating letter...");
    try {
      let musicUrl = null;
      if (musicFile) {
        const formData = new FormData();
        formData.append('file', musicFile);
        const upload = await fetch('http://localhost:8000/api/uploads/music', {
          method: 'POST',
          body: formData
        });
        const uploadData = await upload.json();
        musicUrl = uploadData.music_url;
      }

      const letterData = {
        from_name: fromName,
        to_name: toName,
        date,
        content,
        colors,
        hidden_message: hiddenMessage,
        password: password,
        music_url: musicUrl,
        tier
      };

      const res = await fetch(`http://localhost:8000/api/admin/create?password=${encodeURIComponent(adminPass)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(letterData)
      });

      if (!res.ok) {
        alert("Failed to create letter");
        setStatus("Error creating letter");
        return;
      }

      const data = await res.json();
      alert(`Letter created! Share link: /letter/${data.id}`);
      window.location.reload();
    } catch (err) {
      setStatus("Error creating letter");
    }
  };

  return (
    <div className="min-h-screen romantic-bg p-8">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 shadow-2xl text-center">
          <h1 className="text-4xl mb-8">🔐 Super Admin</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border-2 border-pink-300 text-xl mb-6"
          />
          <button
            onClick={checkAdmin}
            className="w-full bg-pink-600 text-white py-4 rounded-2xl text-xl font-medium"
          >
            Enter Admin Panel
          </button>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold text-pink-700">Super Admin Dashboard</h1>
            <button onClick={() => navigate('/')} className="text-pink-600 underline">← Back to Home</button>
          </div>

          {/* Create New Letter Form */}
          <div className="bg-white rounded-3xl p-10 shadow-xl mb-12">
            <h2 className="text-3xl font-bold mb-8 text-pink-700">Create New Love Letter</h2>
            <div className="grid grid-cols-2 gap-8">
              <input value={fromName} onChange={e=>setFromName(e.target.value)} placeholder="From" className="border p-4 rounded-2xl" />
              <input value={toName} onChange={e=>setToName(e.target.value)} placeholder="To" className="border p-4 rounded-2xl" />
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="border p-4 rounded-2xl" />
              <select value={tier} onChange={e=>setTier(Number(e.target.value))} className="border p-4 rounded-2xl">
                <option value={1}>Tier 1 - Simple</option>
                <option value={2}>Tier 2 - Interactive</option>
                <option value={3}>Tier 3 - Full Experience</option>
              </select>
            </div>

            <textarea value={content} onChange={e=>setContent(e.target.value)} rows={6} placeholder="Write the love letter..." className="w-full mt-6 border p-4 rounded-3xl" />

            <div className="mt-6">
              <p className="font-medium mb-2">Secret Password for this letter</p>
              <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="e.g. ouranniversary2025" className="border p-4 rounded-2xl w-full" />
            </div>

            <button onClick={createLetter} className="mt-8 w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-5 rounded-3xl text-xl font-bold">
              Create & Get Share Link
            </button>
          </div>

          {/* List of All Letters */}
          <h2 className="text-2xl font-bold mb-6">All Love Letters ({letters.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map(l => (
              <div key={l.id} className="bg-white p-6 rounded-3xl shadow">
                <p className="font-medium">To: {l.to_name}</p>
                <p className="text-sm text-gray-500">From: {l.from_name}</p>
                <p className="text-xs text-gray-400 mt-2">{l.date}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(`http://localhost:5173/letter/${l.id}`)}
                  className="mt-4 text-pink-600 text-sm underline"
                >
                  Copy Share Link
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
