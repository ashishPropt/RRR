import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminBlogList() {
  const { token } = useAdmin();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    axios.get('/api/admin/blog', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setPosts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const togglePublish = async (post) => {
    try {
      await axios.put(`/api/admin/blog/${post.id}/publish`, { published: !post.published }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      load();
    } catch {}
  };

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/admin/blog/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(p => p.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete post.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Helmet><title>Blog Posts | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary">Blog Posts</h1>
              <p className="text-gray-500 text-sm mt-1">{posts.length} total posts</p>
            </div>
            <Link to="/admin/blog/new" className="btn-primary text-sm">
              ✍️ New Post
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-gray-500 mb-4">No posts yet.</p>
              <Link to="/admin/blog/new" className="btn-primary text-sm">Write Your First Post</Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Title</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                    <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {posts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary leading-snug">{post.title}</div>
                        <div className="text-gray-400 text-xs mt-0.5">/blog/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full">
                          {post.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublish(post)}
                          className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${
                            post.published
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                          }`}
                        >
                          {post.published ? '✅ Published' : '📄 Draft'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/blog/${post.id}`}
                            className="text-accent hover:text-accent/80 font-medium transition"
                          >
                            Edit
                          </Link>
                          {post.published && (
                            <a
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-600 transition"
                              title="View live"
                            >
                              View
                            </a>
                          )}
                          <button
                            onClick={() => deletePost(post.id)}
                            disabled={deleting === post.id}
                            className="text-red-400 hover:text-red-600 transition disabled:opacity-50"
                          >
                            {deleting === post.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
