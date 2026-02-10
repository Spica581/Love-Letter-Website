import { useState } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color';

export default function LetterEditor({ tier }) {
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [colors, setColors] = useState({ bg: '#fff0f5', text: '#4a2c2a', accent: '#e11d48' });
  const [hiddenMessage, setHiddenMessage] = useState('');
  const [password, setPassword] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [letterId, setLetterId] = useState(null);
  const [status, setStatus] = useState('');

  const handleSave = async () => {
    setStatus('Creating your love letter...');
    try {
      let musicUrl = null;
      if (musicFile && tier >= 2) {
        const formData = new FormData();
        formData.append('file', musicFile);
        const uploadRes = await axios.post('/api/uploads/music', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        musicUrl = uploadRes.data.music_url;
      }

      const letterData = {
        from_name: fromName,
        to_name: toName,
        date,
        content,
        colors,
        hidden_message: hiddenMessage || null,
        password: tier >= 3 ? password : null,
        music_url: musicUrl,
        tier
      };

      const res = await axios.post('/api/letters/', letterData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setLetterId(res.data.id);
      setStatus(`✅ Done! Share this link: /letter/${res.data.id}`);
    } catch (err) {
      setStatus('❌ Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-pink-100">
      <h2 className="text-3xl font-bold text-pink-700 mb-8 text-center">✍️ Write Your Letter</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input value={fromName} onChange={e => setFromName(e.target.value)} className="w-full border border-pink-200 rounded-xl px-4 py-3" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input value={toName} onChange={e => setToName(e.target.value)} className="w-full border border-pink-200 rounded-xl px-4 py-3" placeholder="Their name" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-pink-200 rounded-xl px-4 py-3" />
          </div>

          {tier >= 2 && (
            <div>
              <label className="block text-sm font-medium mb-1">Background Music (MP3)</label>
              <input type="file" accept=".mp3" onChange={e => setMusicFile(e.target.files[0])} className="w-full" />
            </div>
          )}

          {tier >= 3 && (
            <div>
              <label className="block text-sm font-medium mb-1">Secret Password</label>
              <input value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-pink-200 rounded-xl px-4 py-3" placeholder="Anniversary date or nickname" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Your Message</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows="10"
            className="w-full border border-pink-200 rounded-2xl px-4 py-3 resize-y"
            placeholder="My dearest..."
          />
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-medium mb-3">Choose Romantic Colors</p>
        <div className="flex gap-8 flex-wrap">
          <div>
            <p className="text-xs mb-1">Background</p>
            <ChromePicker color={colors.bg} onChange={c => setColors({...colors, bg: c.hex})} />
          </div>
          <div>
            <p className="text-xs mb-1">Text</p>
            <ChromePicker color={colors.text} onChange={c => setColors({...colors, text: c.hex})} />
          </div>
          <div>
            <p className="text-xs mb-1">Accent</p>
            <ChromePicker color={colors.accent} onChange={c => setColors({...colors, accent: c.hex})} />
          </div>
        </div>
      </div>

      {tier >= 2 && (
        <div className="mt-6">
          <label className="block text-sm font-medium mb-1">Hidden Surprise Message</label>
          <input value={hiddenMessage} onChange={e => setHiddenMessage(e.target.value)} className="w-full border border-pink-200 rounded-xl px-4 py-3" placeholder="Only visible on click..." />
        </div>
      )}

      <button
        onClick={handleSave}
        className="mt-10 w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 rounded-2xl text-xl font-medium hover:scale-105 transition transform"
      >
        ✨ Generate & Get Shareable Link
      </button>

      {status && <p className="text-center mt-6 font-medium">{status}</p>}
      {letterId && <p className="text-center mt-4 text-green-600">Share: <strong>http://localhost:5173/letter/{letterId}</strong></p>}
    </div>
  );
}
