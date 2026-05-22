import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import PageHero from '../components/PageHero';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    shipping_address: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  if (items.length === 0 && !success) {
    return (
      <>
        <Helmet><title>Checkout | Regroup Refocus Rebuild</title></Helmet>
        <PageHero title="Checkout" subtitle="Complete your order" />
        <div className="py-24 text-center">
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link to="/the-boutique" className="btn-primary">Shop Now</Link>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <Helmet><title>Order Placed! | Regroup Refocus Rebuild</title></Helmet>
        <PageHero title="Order Received!" subtitle="Thank you for your purchase" />
        <div className="py-24 text-center max-w-lg mx-auto px-4">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="font-heading text-2xl font-bold text-primary mb-4">Thank You, {form.customer_name.split(' ')[0]}!</h2>
          <p className="text-gray-600 mb-2">Your order has been received. Natalie will be in touch at <strong>{form.customer_email}</strong> within 1–2 business days to confirm details and arrange payment.</p>
          <p className="text-gray-500 text-sm mb-8">For signed books, please allow 7–10 days for personalization and shipping.</p>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customer_name || !form.customer_email) {
      return setError('Name and email are required.');
    }
    setSubmitting(true);
    try {
      await axios.post('/api/orders', {
        ...form,
        items: items.map(({ cartKey: _, ...rest }) => rest),
        subtotal,
      });
      clearCart();
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Checkout" subtitle="Complete your order" />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
            {/* Customer info */}
            <div>
              <h2 className="font-heading text-xl font-bold text-primary mb-6">Your Information</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={form.customer_name} onChange={set('customer_name')} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input type="email" value={form.customer_email} onChange={set('customer_email')} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={form.customer_phone} onChange={set('customer_phone')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Shipping Address</label>
                  <textarea value={form.shipping_address} onChange={set('shipping_address')} rows={3}
                    placeholder="Street, City, State, ZIP, Country"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Personalization / Notes
                    <span className="text-gray-400 font-normal ml-1">(for signed books, inscriptions, etc.)</span>
                  </label>
                  <textarea value={form.notes} onChange={set('notes')} rows={3}
                    placeholder="e.g. 'Please inscribe to Sarah — with love from Mom'"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none" />
                </div>
              </div>

              <div className="bg-accent/10 rounded-xl p-4 mt-6 border border-accent/20">
                <p className="text-sm text-primary font-semibold mb-1">📋 How ordering works</p>
                <p className="text-sm text-gray-600">After you submit, Natalie will email you within 1–2 business days to confirm your order and arrange payment. No payment is collected now.</p>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <h2 className="font-heading text-xl font-bold text-primary mb-6">Order Summary</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.cartKey} className="flex gap-3 items-start">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                        {item.image
                          ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          : <span className="text-xl">{item.emoji || '🛍️'}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{item.title}</p>
                        {item.isSigned && <p className="text-xs text-gold">✍️ Signed</p>}
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-primary text-sm flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-primary text-xl">
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">+ shipping (to be confirmed)</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full text-center py-4 text-base mt-6 disabled:opacity-60"
              >
                {submitting ? 'Placing Order...' : 'Place Order →'}
              </button>

              <Link to="/cart" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition">
                ← Back to Cart
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
