import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import PageHero from '../components/PageHero';
import { useCart } from '../context/CartContext';
import { configApi, paymentsApi } from '../services/api';

// ── Order summary sidebar ────────────────────────────────────────────────────
function OrderSummary({ items, subtotal }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
      <h3 className="font-heading text-lg font-bold text-primary mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
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
        <p className="text-xs text-gray-400 mt-1">+ shipping (confirmed after order)</p>
      </div>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ method, name, email }) {
  const icon    = method === 'paypal' ? '🎉' : method === 'venmo' ? '💸' : '📋';
  const heading = method === 'paypal' ? 'Payment Complete!' : method === 'venmo' ? 'Almost There!' : 'Order Received!';
  const body    = method === 'paypal'
    ? `Your payment was processed successfully. A confirmation will be sent to ${email}.`
    : method === 'venmo'
      ? `Your order is saved. Once we confirm your Venmo payment, Natalie will email ${email} with shipping details.`
      : `Your order is saved. Natalie will email ${email} within 1–2 business days with payment and shipping details.`;

  return (
    <>
      <Helmet><title>Order Confirmed | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title={heading} subtitle="Thank you for supporting the mission" />
      <div className="py-24 text-center max-w-lg mx-auto px-4">
        <div className="text-6xl mb-6">{icon}</div>
        <h2 className="font-heading text-2xl font-bold text-primary mb-4">Thank you, {name?.split(' ')[0]}!</h2>
        <p className="text-gray-600 mb-8">{body}</p>
        {method === 'venmo' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-800">
            <strong>Reminder:</strong> Please complete your Venmo payment if you haven't already.
          </div>
        )}
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </>
  );
}

// ── Main checkout page ────────────────────────────────────────────────────────
export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    shipping_address: '', notes: '',
  });
  const [formValid, setFormValid] = useState(false);

  const [siteConfig, setSiteConfig] = useState(null);  // { paypal, venmo }
  const [configLoading, setConfigLoading] = useState(true);

  const [paymentError, setPaymentError] = useState('');
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [success, setSuccess] = useState(null); // { method: 'paypal'|'venmo'|'invoice' }

  // Load runtime config (PayPal client ID, Venmo handle) from backend
  useEffect(() => {
    configApi.get()
      .then(r => setSiteConfig(r.data))
      .catch(() => setSiteConfig({ paypal: { configured: false }, venmo: { configured: false } }))
      .finally(() => setConfigLoading(false));
  }, []);

  // Validate form
  useEffect(() => {
    setFormValid(form.customer_name.trim().length > 0 && form.customer_email.trim().length > 0);
  }, [form]);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const orderPayload = () => ({
    customer_name:    form.customer_name.trim(),
    customer_email:   form.customer_email.trim(),
    customer_phone:   form.customer_phone.trim(),
    shipping_address: form.shipping_address.trim(),
    notes:            form.notes.trim(),
    items:            items.map(({ cartKey: _, ...rest }) => rest),
    subtotal,
  });

  // PayPal: createOrder callback
  const handleCreatePayPalOrder = async () => {
    setPaymentError('');
    try {
      const res = await paymentsApi.createPayPalOrder({
        items: items.map(({ cartKey: _, ...rest }) => rest),
        subtotal,
      });
      return res.data.paypalOrderId;
    } catch {
      setPaymentError('Could not start PayPal session. Please try again.');
      throw new Error('create-order failed');
    }
  };

  // PayPal: onApprove callback (customer approved payment in PayPal popup)
  const handlePayPalApprove = async (data) => {
    setPaymentError('');
    try {
      await paymentsApi.capturePayPalOrder({ paypalOrderId: data.orderID, ...orderPayload() });
      clearCart();
      setSuccess({ method: 'paypal' });
      window.scrollTo(0, 0);
    } catch (err) {
      setPaymentError(err.response?.data?.error || 'Payment capture failed. Please contact us if your account was charged.');
    }
  };

  // Venmo: send to venmo.com with pre-filled amount + note
  const handleVenmo = async () => {
    setPaymentError('');
    // Save the order first so we have a record
    try {
      setInvoiceLoading(true);
      await paymentsApi.requestInvoice({ ...orderPayload(), payment_method: 'venmo' });
      clearCart();

      const handle = siteConfig?.venmo?.handle?.replace('@', '') || '';
      const note   = encodeURIComponent(`RRR Order — ${form.customer_name}`);
      const amount = subtotal.toFixed(2);
      // Deep-link to Venmo payment form
      window.open(`https://venmo.com/${handle}?txn=pay&amount=${amount}&note=${note}`, '_blank');

      setSuccess({ method: 'venmo' });
      window.scrollTo(0, 0);
    } catch (err) {
      setPaymentError('Could not save order. Please try again.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  // Invoice / Pay Later
  const handleInvoice = async () => {
    setPaymentError('');
    setInvoiceLoading(true);
    try {
      await paymentsApi.requestInvoice({ ...orderPayload(), payment_method: 'invoice' });
      clearCart();
      setSuccess({ method: 'invoice' });
      window.scrollTo(0, 0);
    } catch (err) {
      setPaymentError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setInvoiceLoading(false);
    }
  };

  // ── Empty cart ──────────────────────────────────────────────────────────────
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

  // ── Success ─────────────────────────────────────────────────────────────────
  if (success) {
    return <SuccessScreen method={success.method} name={form.customer_name} email={form.customer_email} />;
  }

  const paypal = siteConfig?.paypal;
  const venmo  = siteConfig?.venmo;

  return (
    <>
      <Helmet><title>Checkout | Regroup Refocus Rebuild</title></Helmet>
      <PageHero title="Checkout" subtitle="Complete your order" />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10">

            {/* ── Left: customer info ─────────────────────────────────────── */}
            <div>
              <h2 className="font-heading text-xl font-bold text-primary mb-6">Your Information</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                  <input type="text" value={form.customer_name} onChange={set('customer_name')} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input type="email" value={form.customer_email} onChange={set('customer_email')} required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={form.customer_phone} onChange={set('customer_phone')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Shipping Address</label>
                  <textarea value={form.shipping_address} onChange={set('shipping_address')} rows={3}
                    placeholder="Street, City, State, ZIP, Country"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Personalization / Notes
                    <span className="text-gray-400 font-normal ml-1">(signed book inscriptions, etc.)</span>
                  </label>
                  <textarea value={form.notes} onChange={set('notes')} rows={2}
                    placeholder="e.g. 'Please inscribe to Sarah — with love from Mom'"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none" />
                </div>
              </div>

              {/* ── Payment section ───────────────────────────────────────── */}
              <h2 className="font-heading text-xl font-bold text-primary mb-4">Payment</h2>

              {!formValid && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-4">
                  Please fill in your name and email above to unlock payment options.
                </div>
              )}

              {paymentError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {paymentError}
                </div>
              )}

              <div className={`space-y-4 transition-opacity ${!formValid ? 'opacity-40 pointer-events-none' : ''}`}>

                {/* PayPal smart buttons (includes Venmo button automatically when eligible) */}
                {configLoading ? (
                  <div className="text-center py-4 text-gray-400 text-sm">Loading payment options…</div>
                ) : paypal?.configured ? (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span>💳</span> Pay with PayPal or Venmo
                    </p>
                    <PayPalScriptProvider options={{
                      'client-id':       paypal.clientId,
                      currency:          'USD',
                      'enable-funding':  'venmo',
                      'disable-funding': 'paylater,card',
                      intent:            'capture',
                    }}>
                      <PayPalButtons
                        style={{ layout: 'vertical', shape: 'rect', label: 'pay', height: 45 }}
                        forceReRender={[subtotal]}
                        createOrder={handleCreatePayPalOrder}
                        onApprove={handlePayPalApprove}
                        onError={(err) => {
                          console.error('PayPal error:', err);
                          setPaymentError('Payment failed. Please try a different method.');
                        }}
                        onCancel={() => setPaymentError('')}
                      />
                    </PayPalScriptProvider>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Venmo button appears on mobile if you have the Venmo app installed.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-5 border border-dashed border-gray-300 text-center text-sm text-gray-400">
                    PayPal not configured — see admin settings to add your PayPal credentials.
                  </div>
                )}

                {/* Manual Venmo link (always shown if handle is set) */}
                {venmo?.configured && (
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <span>💸</span> Pay via Venmo
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Send <strong>${subtotal.toFixed(2)}</strong> to <strong>{venmo.handle}</strong>. We'll confirm and ship once received.
                    </p>
                    <button
                      onClick={handleVenmo}
                      disabled={invoiceLoading}
                      className="w-full bg-[#3D95CE] hover:bg-[#2e7bb5] text-white font-semibold py-3 rounded-lg transition text-sm disabled:opacity-60"
                    >
                      {invoiceLoading ? 'Saving order…' : `Send $${subtotal.toFixed(2)} on Venmo →`}
                    </button>
                  </div>
                )}

                {/* Request invoice / pay later */}
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                    <span>📋</span> Request an Invoice
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    No payment now. Natalie will email you within 1–2 business days with payment options (check, cash, Zelle, etc.).
                  </p>
                  <button
                    onClick={handleInvoice}
                    disabled={invoiceLoading}
                    className="w-full border border-gray-300 hover:border-primary text-gray-600 hover:text-primary font-semibold py-2.5 rounded-lg transition text-sm disabled:opacity-60"
                  >
                    {invoiceLoading ? 'Saving…' : 'Place Order — I\'ll Pay Later'}
                  </button>
                </div>
              </div>

              <Link to="/cart" className="block text-center text-sm text-gray-400 hover:text-gray-600 mt-5 transition">
                ← Back to Cart
              </Link>
            </div>

            {/* ── Right: order summary ────────────────────────────────────── */}
            <div>
              <h2 className="font-heading text-xl font-bold text-primary mb-6">Order Summary</h2>
              <OrderSummary items={items} subtotal={subtotal} />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
