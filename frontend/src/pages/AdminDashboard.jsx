import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color';

function Admin() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLetter, setNewLetter] = useState({
    from_name: '',
    to_name: '',
    date: new Date().toISOString().split('T')[0],
    content: '',
    colors: { background: '#fff0f5', text: '#4a2c2a', accent: '#e11d48' },
    hidden_message: '',
    photo_urls: [],
    tier: 2,
  });
  const [newPhotoFiles, setNewPhotoFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const adminPassword = localStorage.getItem('adminPassword');
    if (!adminPassword) {
      navigate('/admin');
      return;
    }
    fetchLetters(adminPassword);
  }, [navigate]);

  const fetchLetters = async (adminPassword) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:8000/api/admin/all', {
        params: { password: adminPassword },
      });
      setLetters(response.data);
    } catch (err) {
      setError('Failed to fetch letters: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setError('');
    const adminPassword = localStorage.getItem('adminPassword');

    let uploadedUrls = [...newLetter.photo_urls];

    // Functional Photo Uploader for Tier 3
    if (newLetter.tier === 3 && newPhotoFiles.length > 0) {
      try {
        for (const file of newPhotoFiles) {
          const formData = new FormData();
          formData.append('file', file);
          const upload = await axios.post('http://localhost:8000/api/uploads/photo', formData);
          uploadedUrls.push(upload.data.photo_url);
        }
      } catch (err) {
        setError('Photo upload failed: ' + (err.response?.data?.detail || err.message));
        return;
      }
    }

    const letterToSend = { ...newLetter, photo_urls: uploadedUrls };

    try {
      if (editingId) {
        // FIXED: Using backticks for dynamic URL
        await axios.put(`http://localhost:8000/api/admin/${editingId}`, letterToSend, {
          params: { password: adminPassword },
        });
        alert('Letter updated successfully!');
      } else {
        const response = await axios.post('http://localhost:8000/api/admin/create', letterToSend, {
          params: { password: adminPassword },
        });
        // FIXED: Using backticks for link generation
        const link = `${window.location.origin}/letter/${response.data.id}`;
        navigator.clipboard.writeText(link);
        alert(`New letter created! Shareable link copied: ${link}`);
      }
      fetchLetters(adminPassword);
      resetForm();
    } catch (err) {
      setError('Operation failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const resetForm = () => {
    setNewLetter({
      from_name: '',
      to_name: '',
      date: new Date().toISOString().split('T')[0],
      content: '',
      colors: { background: '#fff0f5', text: '#4a2c2a', accent: '#e11d48' },
      hidden_message: '',
      photo_urls: [],
      tier: 2,
    });
    setNewPhotoFiles([]);
    setEditingId(null);
  };

  const handleEdit = (letter) => {
    setNewLetter({
      ...letter,
      colors: letter.colors || { background: '#fff0f5', text: '#4a2c2a', accent: '#e11d48' },
      photo_urls: letter.photo_urls || [],
    });
    setEditingId(letter.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    const adminPassword = localStorage.getItem('adminPassword');
    try {
      // FIXED: Using backticks for delete URL
      await axios.delete(`http://localhost:8000/api/admin/${id}`, {
        params: { password: adminPassword },
      });
      fetchLetters(adminPassword);
    } catch (err) {
      setError('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    navigate('/admin');
  };

  const removePhoto = (url) => {
    setNewLetter({
      ...newLetter,
      photo_urls: newLetter.photo_urls.filter((u) => u !== url),
    });
  };

  if (loading) return <div className="text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-pink-700">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-pink-600 underline">Logout</button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

        <div className="bg-white rounded-3xl p-10 shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-pink-700">{editingId ? 'Edit Letter' : 'Create New Letter'}</h2>
          <form onSubmit={handleCreateOrUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" value={newLetter.from_name} onChange={(e) => setNewLetter({ ...newLetter, from_name: e.target.value })} placeholder="From" className="border p-4 rounded-2xl" required />
              <input type="text" value={newLetter.to_name} onChange={(e) => setNewLetter({ ...newLetter, to_name: e.target.value })} placeholder="To" className="border p-4 rounded-2xl" required />
              <input type="date" value={newLetter.date} onChange={(e) => setNewLetter({ ...newLetter, date: e.target.value })} className="border p-4 rounded-2xl" />
              <select value={newLetter.tier} onChange={(e) => setNewLetter({ ...newLetter, tier: parseInt(e.target.value) })} className="border p-4 rounded-2xl">
                <option value={1}>Tier 1 - Simple</option>
                <option value={2}>Tier 2 - Interactive</option>
                <option value={3}>Tier 3 - Full Experience (Photos)</option>
              </select>
            </div>

            <textarea value={newLetter.content} onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })} rows={5} placeholder="Letter Content" className="w-full border p-4 rounded-2xl" required />

            <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
              <p className="font-bold text-pink-800 mb-4">Letter Background Color</p>
              <ChromePicker 
                color={newLetter.colors.background} 
                onChange={(color) => setNewLetter({
                  ...newLetter,
                  colors: { ...newLetter.colors, background: color.hex }
                })} 
              />
              <p className="mt-2 text-sm text-pink-600 italic">This color will be the background for the letter the recipient sees.</p>
            </div>

            {newLetter.tier === 3 && (
              <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="font-bold mb-4">Photos (Tier 3)</p>
                <div className="flex flex-wrap gap-4 mb-4">
                  {newLetter.photo_urls.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img src={url} alt="Uploaded" className="w-20 h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removePhoto(url)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✕</button>
                    </div>
                  ))}
                </div>
                <input type="file" multiple accept="image/*" onChange={(e) => setNewPhotoFiles(Array.from(e.target.files))} />
              </div>
            )}

            <button type="submit" className="w-full bg-pink-600 text-white py-4 rounded-2xl text-xl font-bold hover:bg-pink-700 transition-colors">
              {editingId ? 'Save Changes' : 'Create & Copy Link'}
            </button>
          </form>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Existing Letters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {letters.map((letter) => (
            <div key={letter.id} className="bg-white p-6 rounded-3xl shadow-md border-t-8" style={{ borderTopColor: letter.colors.background }}>
              <p className="font-bold">To: {letter.to_name}</p>
              <p className="text-sm text-gray-500">From: {letter.from_name}</p>
              <div className="mt-4 flex gap-4">
                <button onClick={() => {
                  const link = `${window.location.origin}/letter/${letter.id}`;
                  navigator.clipboard.writeText(link);
                  alert('Link copied!');
                }} className="text-pink-600 text-xs font-bold uppercase hover:underline">Copy Link</button>
                <button onClick={() => handleEdit(letter)} className="text-blue-600 text-xs font-bold uppercase hover:underline">Edit</button>
                <button onClick={() => handleDelete(letter.id)} className="text-red-600 text-xs font-bold uppercase hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;
