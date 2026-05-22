import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminProductsApi } from '../../services/api';

export default function AdminProductList() {
  const { token } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminProductsApi.getAll(token)
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminProductsApi.remove(token, id);
      setProducts(p => p.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Helmet><title>Boutique Items | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary">Boutique Items</h1>
              <p className="text-gray-500 text-sm mt-1">Manage merchandise for sale</p>
            </div>
            <Link to="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="mb-4">No products yet.</p>
              <Link to="/admin/products/new" className="btn-primary text-sm">Add Your First Product</Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Product</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Category</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 bg-accent/10 rounded flex items-center justify-center text-xl">
                              {p.emoji || '🛍️'}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-800">{p.name}</div>
                            {p.description && (
                              <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{p.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                          {p.category || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">${Number(p.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/admin/products/${p.id}`}
                          className="text-accent hover:text-accent-dark font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className="text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-50"
                        >
                          {deleting === p.id ? 'Deleting…' : 'Delete'}
                        </button>
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
