import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminAuctionApi } from '../../services/api';

const empty = {
  title: '', description: '', starting_bid: '', current_bid: '',
  emoji: '', image_url: '', end_date: '', active: true,
};

export default function AdminAuctionForm() {
  const { token } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    adminAuctionApi.getAll(token).then(r => {
      const item = r.data.find(x => x.id === id);
      if (item) {
        setForm({
          title: item.title || '',
          description: item.description || '',
          starting_bid: item.starting_bid ?? '',
          current_bid: item.current_bid ?? '',
          emoji: item.emoji || '',
          image_url: item.image_url || '',
          end_date: item.end_date ? item.end_date.substring(0, 10) : '',
          active: item.active !== false,
        });
      }
    }).catch(() => {}).finally(() => setFetchLoading(false));
  }, [id, isEdit, token]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.starting_bid || isNaN(Number(form.starting_bid))) { setError('A valid starting bid is required.'); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        starting_bid: Number(form.starting_bid),
        current_bid: form.current_bid ? Number(form.current_bid) : null,
        end_date: form.end_date || null,
      };
      if (isEdit) {
        await adminAuctionApi.update(token, id, payload);
      } else {
        await adminAuctionApi.create(token, payload);
      }
      navigate('/admin/products?tab=auction');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save auction item.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <AdminLayout><div className="p-8 text-center text-gray-400">Loading…</div></AdminLayout>;
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Auction Item' : 'Add Auction Item'} | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/admin/products?tab=auction" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Shop</Link>
            <h1 className="font-heading text-2xl font-bold text-primary">
              {isEdit ? 'Edit Auction Item' : 'Add Auction Item'}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="Signed Author Book Bundle" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                placeholder="What's included in this auction lot…" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Starting Bid ($) *</label>
                <input type="number" step="0.01" min="0" value={form.starting_bid} onChange={e => set('starting_bid', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="75.00" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Current Bid ($)</label>
                <input type="number" step="0.01" min="0" value={form.current_bid} onChange={e => set('current_bid', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="Leave blank if none yet" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Emoji (display icon)</label>
                <input type="text" value={form.emoji} onChange={e => set('emoji', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="📚" maxLength={4} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                <input type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
              <input type="text" value={form.image_url} onChange={e => set('image_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="https://… or /uploads/…" />
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="mt-2 h-20 object-contain rounded" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="active" checked={form.active}
                onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-accent" />
              <label htmlFor="active" className="text-sm font-semibold text-gray-700">
                Active (visible on the site)
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-60">
                {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Auction Item'}
              </button>
              <Link to="/admin/products?tab=auction" className="btn-outline text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}
