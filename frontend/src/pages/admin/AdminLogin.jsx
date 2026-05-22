import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/admin/login', { username: username.trim(), password });
      login(res.data.token, res.data.username);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login | RRR</title></Helmet>
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="font-heading text-3xl font-bold text-white mb-1">RRR Admin</div>
            <div className="text-white/50 text-sm">Regroup Refocus Rebuild</div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
            <h1 className="font-heading text-xl font-bold text-primary mb-6 text-center">Sign In</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                placeholder="ncabinda"
                autoFocus
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <a href="/" className="text-white/40 hover:text-white/70 text-xs transition">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
