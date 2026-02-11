import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLetter, setNewLetter] = useState({
    from_name: '',
    to_name: '',
    date: '',
    content: '',
    colors: { background: '#ffffff', text: '#000000' }, // Default; adjust as needed
    hidden_message: '',
    music_url: '',
    tier: 1, // Numbers 1-3 based on your LetterViewer
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const password = localStorage.getItem('adminPassword');
    if (!password) {
      navigate('/admin');
      return;
    }

    fetchLetters(password);
  }, [navigate]);

  const fetchLetters = async (adminPassword) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/letters/admin/all', {
        params: { admin_token: adminPassword },
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

    try {
      let response;
      if (editingId) {
        // Update existing
        response = await axios.put(`/api/letters/${editingId}`, newLetter, {
          params: { admin_token: adminPassword },
        });
      } else {
        // Create new
        response = await axios.post('/api/letters', newLetter, {
          params: { admin_token: adminPassword },
        });
        const link = `${window.location.origin}/letter/${response.data.id}`;
        navigator.clipboard.writeText(link);
        alert(`New letter created! Link auto-copied: ${link}`);
      }
      fetchLetters(adminPassword); // Refresh list
      setNewLetter({
        from_name: '',
        to_name: '',
        date: '',
        content: '',
        colors: { background: '#ffffff', text: '#000000' },
        hidden_message: '',
        music_url: '',
        tier: 1,
      });
      setEditingId(null);
    } catch (err) {
      setError('Operation failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (letter) => {
    setNewLetter({
      ...letter,
      colors: letter.colors || { background: '#ffffff', text: '#000000' }, // Fallback if missing
    });
    setEditingId(letter.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    const adminPassword = localStorage.getItem('adminPassword');
    setError('');
    try {
      await axios.delete(`/api/letters/${id}`, {
        params: { admin_token: adminPassword },
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

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading dashboard...</div>;
  if (error && !letters.length) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>{editingId ? 'Edit Letter' : 'Create New Letter'}</h2>
      <form onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          value={newLetter.from_name}
          onChange={(e) => setNewLetter({ ...newLetter, from_name: e.target.value })}
          placeholder="From Name"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
          required
        />
        <input
          type="text"
          value={newLetter.to_name}
          onChange={(e) => setNewLetter({ ...newLetter, to_name: e.target.value })}
          placeholder="To Name"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
          required
        />
        <input
          type="date"
          value={newLetter.date}
          onChange={(e) => setNewLetter({ ...newLetter, date: e.target.value })}
          placeholder="Date"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <textarea
          value={newLetter.content}
          onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
          placeholder="Content"
          style={{ display: 'block', margin: '10px 0', width: '100%', height: '100px' }}
          required
        />
        {/* Colors as JSON string for simplicity; consider color picker inputs for better UX */}
        <input
          type="text"
          value={JSON.stringify(newLetter.colors)}
          onChange={(e) => {
            try {
              setNewLetter({ ...newLetter, colors: JSON.parse(e.target.value) });
            } catch {}
          }}
          placeholder='Colors (e.g., {"background": "#ffffff", "text": "#000000"})'
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <input
          type="text"
          value={newLetter.hidden_message}
          onChange={(e) => setNewLetter({ ...newLetter, hidden_message: e.target.value })}
          placeholder="Hidden Message"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <input
          type="text"
          value={newLetter.music_url}
          onChange={(e) => setNewLetter({ ...newLetter, music_url: e.target.value })}
          placeholder="Music URL"
          style={{ display: 'block', margin: '10px 0', width: '100%' }}
        />
        <select
          value={newLetter.tier}
          onChange={(e) => setNewLetter({ ...newLetter, tier: parseInt(e.target.value) })}
          style={{ margin: '10px 0', display: 'block' }}
        >
          <option value={1}>Tier 1</option>
          <option value={2}>Tier 2</option>
          <option value={3}>Tier 3</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setNewLetter({
                from_name: '',
                to_name: '',
                date: '',
                content: '',
                colors: { background: '#ffffff', text: '#000000' },
                hidden_message: '',
                music_url: '',
                tier: 1,
              });
            }}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Existing Letters</h2>
      {letters.length === 0 ? (
        <p>No letters found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {letters.map((letter) => (
            <li key={letter.id} style={{ margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}>
              <p><strong>From:</strong> {letter.from_name}</p>
              <p><strong>To:</strong> {letter.to_name}</p>
              <p><strong>Date:</strong> {letter.date}</p>
              <p><strong>Content:</strong> {letter.content.substring(0, 100)}...</p> {/* Truncate for preview */}
              <p><strong>Tier:</strong> {letter.tier}</p>
              <button onClick={() => handleEdit(letter)}>Edit</button>
              <button onClick={() => handleDelete(letter.id)} style={{ marginLeft: '10px' }}>Delete</button>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/letter/${letter.id}`;
                  navigator.clipboard.writeText(link);
                  alert(`Link copied: ${link}`);
                }}
                style={{ marginLeft: '10px' }}
              >
                Copy Link
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;