import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminBooksApi } from '../../services/api';

const empty = {
  title: '', subtitle: '', description: '', price: '', signed_price: '',
  cover_image: '', amazon_url: '', is_signed: true,
};

export default function AdminBookForm() {
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
    adminBooksApi.getAll(token).then(r => {
      const book = r.data.find(b => b.id === id);
      if (book) {
        setForm({
          title: book.title || '',
          subtitle: book.subtitle || '',
          description: book.description || '',
          price: book.price || '',
          signed_price: book.signed_price || '',
          cover_image: book.cover_image || '',
          amazon_url: book.amazon_url || '',
          is_signed: book.is_signed !== false,
        });
      }
    }).catch(() => {}).finally(() => setFetchLoading(false));
  }, [id, isEdit, token]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('A valid price is required.'); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        signed_price: form.signed_price ? Number(form.signed_price) : null,
      };
      if (isEdit) {
        await adminBooksApi.update(token, id, payload);
      } else {
        await adminBooksApi.create(token, payload);
      }
      navigate('/admin/books');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save book.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-400">Loading book...</div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Book' : 'Add Book'} | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/admin/books" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Books</Link>
            <h1 className="font-heading text-2xl font-bold text-primary">
              {isEdit ? 'Edit Book' : 'Add New Book'}
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
                placeholder="Regroup Refocus Rebuild" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
              <input type="text" value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="A Guide for Single Parents..." />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                placeholder="Book description..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Regular Price ($) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="19.99" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Signed Price ($)</label>
                <input type="number" step="0.01" min="0" value={form.signed_price} onChange={e => set('signed_price', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="29.99" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL</label>
              <input type="text" value={form.cover_image} onChange={e => set('cover_image', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="/images/book1-cover.png" />
              {form.cover_image && (
                <img src={form.cover_image} alt="preview" className="mt-2 h-24 object-contain rounded" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amazon URL</label>
              <input type="url" value={form.amazon_url} onChange={e => set('amazon_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="https://amazon.com/dp/..." />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_signed"
                checked={form.is_signed}
                onChange={e => set('is_signed', e.target.checked)}
                className="w-4 h-4 accent-accent"
              />
              <label htmlFor="is_signed" className="text-sm font-semibold text-gray-700">
                Offer signed copies
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="btn-primary text-sm disabled:opacity-60">
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Book'}
              </button>
              <Link to="/admin/books" className="btn-outline text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}
