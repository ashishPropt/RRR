import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminProductsApi, adminAuctionApi } from '../../services/api';

// ── Products tab ─────────────────────────────────────────────────────────────
function ProductsTab({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    adminProductsApi.getAll(token)
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminProductsApi.remove(token, id);
      setProducts(p => p.filter(x => x.id !== id));
    } catch { alert('Failed to delete product.'); }
    finally { setDeleting(null); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading products…</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link to="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          <div className="text-5xl mb-4">🛍️</div>
          <p className="mb-4">No products yet.</p>
          <Link to="/admin/products/new" className="btn-primary text-sm">Add First Product</Link>
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
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded shadow-sm" />
                        : <div className="w-10 h-10 bg-accent/10 rounded flex items-center justify-center text-xl">{p.emoji || '🛍️'}</div>}
                      <div>
                        <div className="font-semibold text-gray-800">{p.name}</div>
                        {p.description && <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{p.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                      {p.category || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">${Number(p.price || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link to={`/admin/products/${p.id}`} className="text-accent hover:text-accent-dark font-semibold transition-colors">Edit</Link>
                    <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id}
                      className="text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-50">
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
  );
}

// ── Auction Items tab ─────────────────────────────────────────────────────────
function AuctionTab({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    adminAuctionApi.getAll(token)
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminAuctionApi.remove(token, id);
      setItems(i => i.filter(x => x.id !== id));
    } catch { alert('Failed to delete auction item.'); }
    finally { setDeleting(null); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading auction items…</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link to="/admin/auction/new" className="btn-primary text-sm">+ Add Auction Item</Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
          <div className="text-5xl mb-4">🏷️</div>
          <p className="mb-4">No auction items yet.</p>
          <Link to="/admin/auction/new" className="btn-primary text-sm">Add First Auction Item</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Item</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Starting Bid</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Current Bid</th>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-800">{item.title}</div>
                      {item.description && <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{item.description}</div>}
                      {item.end_date && (
                        <div className="text-xs text-gray-400 mt-0.5">
                          Ends: {new Date(item.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">${Number(item.starting_bid).toFixed(2)}</td>
                  <td className="px-6 py-4 font-semibold text-accent">
                    {item.current_bid ? `$${Number(item.current_bid).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link to={`/admin/auction/${item.id}`} className="text-accent hover:text-accent-dark font-semibold transition-colors">Edit</Link>
                    <button onClick={() => handleDelete(item.id, item.title)} disabled={deleting === item.id}
                      className="text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-50">
                      {deleting === item.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Combined Shop page ────────────────────────────────────────────────────────
const TABS = [
  { key: 'products', label: '🛍️ Products' },
  { key: 'auction',  label: '🏷️ Auction Items' },
];

export default function AdminShopList() {
  const { token } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'products';

  const setTab = (key) => setSearchParams({ tab: key }, { replace: true });

  return (
    <>
      <Helmet><title>Shop | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-primary">Shop</h1>
            <p className="text-gray-500 text-sm mt-1">Manage products and auction items</p>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mb-6 bg-gray-200 rounded-xl p-1 w-fit">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === t.key
                    ? 'bg-white text-primary shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'products' && <ProductsTab token={token} />}
          {activeTab === 'auction'  && <AuctionTab  token={token} />}
        </div>
      </AdminLayout>
    </>
  );
}
