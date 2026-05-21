import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const { token } = useAdmin();
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

  useEffect(() => {
    axios.get('/api/admin/blog/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => setStats(r.data)).catch(() => {});
  }, [token]);

  const cards = [
    { label: 'Total Posts', value: stats.total, color: 'bg-primary', icon: '📝' },
    { label: 'Published', value: stats.published, color: 'bg-green-600', icon: '✅' },
    { label: 'Drafts', value: stats.drafts, color: 'bg-yellow-500', icon: '📄' },
  ];

  return (
    <>
      <Helmet><title>Dashboard | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back, Natalie.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {cards.map(c => (
              <div key={c.label} className={`${c.color} text-white rounded-xl p-6 shadow`}>
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-4xl font-bold">{c.value}</div>
                <div className="text-white/80 text-sm mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-heading text-lg font-bold text-primary mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Link to="/admin/blog/new" className="btn-primary text-sm">
                ✍️ Write New Post
              </Link>
              <Link to="/admin/blog" className="btn-outline text-sm">
                📋 Manage All Posts
              </Link>
              <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                🌐 View Live Site
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
