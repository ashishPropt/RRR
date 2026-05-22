import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { adminOrdersApi } from '../../services/api';

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function AdminOrderList() {
  const { token } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    adminOrdersApi.getAll(token)
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingStatus(orderId);
    try {
      await adminOrdersApi.updateStatus(token, orderId, status);
      setOrders(o => o.map(x => x.id === orderId ? { ...x, status } : x));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <>
      <Helmet><title>Orders | RRR Admin</title></Helmet>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-primary">Orders</h1>
            <p className="text-gray-500 text-sm mt-1">Customer orders from the shop</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
              <div className="text-5xl mb-4">📦</div>
              <p>No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => {
                const items = Array.isArray(order.items) ? order.items : [];
                const isOpen = expanded === order.id;
                const statusColor = STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={order.id} className="bg-white rounded-xl shadow overflow-hidden">
                    {/* Header row */}
                    <button
                      className="w-full text-left px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-gray-800">{order.customer_name}</span>
                          <span className="text-gray-400 text-sm">{order.customer_email}</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {' · '}
                          {items.length} item{items.length !== 1 ? 's' : ''}
                          {' · '}
                          <span className="font-semibold text-gray-600">${Number(order.subtotal).toFixed(2)}</span>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="border-t border-gray-100 px-6 py-5">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Left: customer info + items */}
                          <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Customer</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div><span className="font-medium">Name:</span> {order.customer_name}</div>
                              <div><span className="font-medium">Email:</span> {order.customer_email}</div>
                              {order.customer_phone && <div><span className="font-medium">Phone:</span> {order.customer_phone}</div>}
                              {order.shipping_address && <div><span className="font-medium">Address:</span> {order.shipping_address}</div>}
                              {order.notes && <div><span className="font-medium">Notes:</span> {order.notes}</div>}
                            </div>

                            <h3 className="font-semibold text-gray-700 mb-2 mt-4 text-sm uppercase tracking-wide">Items</h3>
                            <div className="space-y-2">
                              {items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span className="text-gray-700">
                                    {item.qty > 1 && <span className="text-gray-400 mr-1">{item.qty}×</span>}
                                    {item.title}
                                    {item.isSigned && <span className="ml-1 text-gold text-xs">(signed)</span>}
                                    {item.type === 'auction' && <span className="ml-1 text-accent text-xs">(bid)</span>}
                                  </span>
                                  <span className="font-semibold text-gray-800">${(Number(item.price) * (item.qty || 1)).toFixed(2)}</span>
                                </div>
                              ))}
                              <div className="border-t pt-2 flex justify-between font-bold text-gray-800 text-sm">
                                <span>Total</span>
                                <span>${Number(order.subtotal).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: status update */}
                          <div>
                            <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Update Status</h3>
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(STATUS_COLORS).map(s => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(order.id, s)}
                                  disabled={order.status === s || updatingStatus === order.id}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all disabled:opacity-50 ${
                                    order.status === s
                                      ? statusColor + ' ring-2 ring-offset-1 ring-current'
                                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {updatingStatus === order.id && order.status !== s ? '...' : s}
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-400 mt-3">
                              Order ID: <span className="font-mono">{order.id}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
