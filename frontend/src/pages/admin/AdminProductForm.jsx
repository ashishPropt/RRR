import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminProductsApi } from '../../services/api';

const CATEGORIES = ['Accessories', 'Journals', 'Wellness', 'Apparel', 'Books', 'Other'];

const empty = {
  name: '', description: '', price: '', category: 'Accessories',
  image_url: '', emoji: '',
};

export default function AdminProductForm() {
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
    adminProductsApi.getAll(token).then(r => {
      const product = r.data.find(p => p.id === id);
      if (product) {
        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || 'Accessories',
          image_url: product.image_url || '',
          emoji: product.emoji || '',
        });
      }
    }).catch(() => {}).finally(() => setFetchLoading(false));
  }, [id, isEdit, token]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('A valid price is required.'); return; }

    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price) };
      if (isEdit) {
        await adminProductsApi.update(token, id, payload);
      } else {
        await adminProductsApi.create(token, payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-400">Loading product...</div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Product' : 'Add Product'} | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <Link to="/admin/products" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">← Products</Link>
            <h1 className="font-heading text-2xl font-bold text-primary">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="RRR Motivational Mug" required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                placeholder="Product description..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($) *</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="18.99" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
              <input type="text" value={form.image_url} onChange={e => set('image_url', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="https://... or /uploads/..." />
              {form.image_url && (
                <img src={form.image_url} alt="preview" className="mt-2 h-20 object-contain rounded" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Emoji (shown when no image)
              </label>
              <input type="text" value={form.emoji} onChange={e => set('emoji', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                placeholder="☕" maxLength={4} />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="btn-primary text-sm disabled:opacity-60">
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
              </button>
              <Link to="/admin/products" className="btn-outline text-sm">Cancel</Link>
            </div>
          </form>
        </div>
      </AdminLayout>
    </>
  );
}
