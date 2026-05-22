import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminBooksApi } from '../../services/api';

export default function AdminBookList() {
  const { token } = useAdmin();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    adminBooksApi.getAll(token)
      .then(r => setBooks(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminBooksApi.remove(token, id);
      setBooks(b => b.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete book.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <Helmet><title>Books | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary">Books</h1>
              <p className="text-gray-500 text-sm mt-1">Manage signed books for sale</p>
            </div>
            <Link to="/admin/books/new" className="btn-primary text-sm">+ Add Book</Link>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading books...</div>
          ) : books.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
              <div className="text-5xl mb-4">📚</div>
              <p className="mb-4">No books yet.</p>
              <Link to="/admin/books/new" className="btn-primary text-sm">Add Your First Book</Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Book</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Price</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Signed Price</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {books.map(book => (
                    <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {book.cover_image ? (
                            <img src={book.cover_image} alt={book.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                          ) : (
                            <div className="w-10 h-14 bg-primary/10 rounded flex items-center justify-center text-xl">📚</div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-800">{book.title}</div>
                            {book.subtitle && <div className="text-xs text-gray-400 mt-0.5">{book.subtitle}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">${Number(book.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-gold font-semibold">
                        {book.signed_price ? `$${Number(book.signed_price).toFixed(2)}` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          book.is_signed ? 'bg-gold/20 text-yellow-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {book.is_signed ? 'Signed Available' : 'Regular Only'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/admin/books/${book.id}`}
                          className="text-accent hover:text-accent-dark font-semibold transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book.id, book.title)}
                          disabled={deleting === book.id}
                          className="text-red-400 hover:text-red-600 font-semibold transition-colors disabled:opacity-50"
                        >
                          {deleting === book.id ? 'Deleting…' : 'Delete'}
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
