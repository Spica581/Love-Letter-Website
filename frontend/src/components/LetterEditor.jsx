import { useState } from 'react';
import { ChromePicker } from 'react-color';
import axios from 'axios';

export default function LetterEditor({ tier }) {
  const [content, setContent] = useState('');
  const [names, setNames] = useState({ from: '', to: '' });
  const [date, setDate] = useState('');
  const [colors, setColors] = useState({ bg: '#ffebee', text: '#d32f2f', accent: '#f48fb1' });
  const [insideJokes, setInsideJokes] = useState([]);
  const [hiddenMessage, setHiddenMessage] = useState('');
  const [password, setPassword] = useState('');
  const [photos, setPhotos] = useState([]);
  const [musicFile, setMusicFile] = useState(null);
  const [letterId, setLetterId] = useState(null);

  const handleColorChange = (key, color) => {
    setColors({ ...colors, [key]: color.hex });
  };

  const handleUploadMusic = async () => {
    if (!musicFile || tier < 2) return;
    const formData = new FormData();
    formData.append('file', musicFile);
    const res = await axios.post('/api/uploads/music', formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return res.data.music_url;
  };

  const handleSave = async () => {
    const musicUrl = await handleUploadMusic();
    const letter = {
      content,
      names,
      date,
      colors,
      inside_jokes: insideJokes,
      hidden_message: hiddenMessage,
      password: tier >= 3 ? password : null,
      photos: tier >= 3 ? photos : null,
      music_url: musicUrl,
      tier,
    };
    const res = await axios.post('/api/letters/', letter, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setLetterId(res.data.id);
    alert(`Share: /letter/${res.data.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Inputs for content, names, date */}
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Letter content" />
      <input value={names.from} onChange={e => setNames({ ...names, from: e.target.value })} placeholder="From" />
      <input value={names.to} onChange={e => setNames({ ...names, to: e.target.value })} placeholder="To" />
      <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date" />

      {/* Color customizers */}
      <div>Background: <ChromePicker color={colors.bg} onChange={c => handleColorChange('bg', c)} /></div>
      <div>Text: <ChromePicker color={colors.text} onChange={c => handleColorChange('text', c)} /></div>
      <div>Accent: <ChromePicker color={colors.accent} onChange={c => handleColorChange('accent', c)} /></div>

      {tier >= 2 && (
        <>
          <input type="file" accept=".mp3" onChange={e => setMusicFile(e.target.files[0])} />
          <input value={hiddenMessage} onChange={e => setHiddenMessage(e.target.value)} placeholder="Hidden message" />
          {/* Add inputs for inside jokes */}
        </>
      )}

      {tier >= 3 && (
        <>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Secret password" />
          {/* Add photo uploads (similar to music, base64 or URLs) */}
        </>
      )}

      <button onClick={handleSave}>Save & Generate</button>
      {letterId && <LetterPreview letterId={letterId} />}
    </div>
  );
}
