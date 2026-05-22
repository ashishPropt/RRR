import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const { token, username } = useAdmin();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });
  const [orderCount, setOrderCount] = useState(0);

  // Change password state
  const [pwForm, setPwForm] = useState({ current: '', newPass: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/admin/blog/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => setStats(r.data)).catch(() => {});

    axios.get('/api/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => setOrderCount(r.data.length)).catch(() => {});
  }, [token]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwMsg('');
    if (pwForm.newPass !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }
    if (pwForm.newPass.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      await axios.post('/api/admin/change-password', {
        username,
        currentPassword: pwForm.current,
        newPassword: pwForm.newPass,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPwMsg('Password changed successfully!');
      setPwForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setPwError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  const cards = [
    { label: 'Blog Posts', value: stats.total, color: 'bg-primary', icon: '📝', link: '/admin/blog' },
    { label: 'Published', value: stats.published, color: 'bg-green-600', icon: '✅', link: '/admin/blog' },
    { label: 'Drafts', value: stats.drafts, color: 'bg-yellow-500', icon: '📄', link: '/admin/blog' },
    { label: 'Orders', value: orderCount, color: 'bg-accent', icon: '📦', link: '/admin/orders' },
  ];

  return (
    <>
      <Helmet><title>Dashboard | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8 max-w-5xl">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, {username || 'Natalie'}.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {cards.map(c => (
              <Link key={c.label} to={c.link} className={`${c.color} text-white rounded-xl p-6 shadow hover:opacity-90 transition-opacity`}>
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-4xl font-bold">{c.value}</div>
                <div className="text-white/80 text-sm mt-1">{c.label}</div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/blog/new" className="btn-primary text-sm">✍️ Write New Post</Link>
              <Link to="/admin/books/new" className="btn-primary text-sm">📚 Add Book</Link>
              <Link to="/admin/products/new" className="btn-primary text-sm">🛍️ Add Product</Link>
              <Link to="/admin/orders" className="btn-outline text-sm">📦 View Orders</Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">🌐 View Live Site</a>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">Change Password</h2>
            {pwMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">{pwMsg}</div>
            )}
            {pwError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{pwError}</div>
            )}
            <form onSubmit={handlePasswordChange} className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={pwForm.current}
                  onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={pwForm.newPass}
                  onChange={e => setPwForm(f => ({ ...f, newPass: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-2 rounded-lg text-sm transition disabled:opacity-60"
                >
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
