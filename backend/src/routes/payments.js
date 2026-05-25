const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

// ── Helpers ───────────────────────────────────────────────────────────────────

function paypalBase() {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

// Use Node 22 built-in fetch — no axios dependency needed.
async function ppFetch(url, options = {}) {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body?.message || `PayPal API error ${res.status}`);
    err.status = res.status;
    err.data = body;
    throw err;
  }
  return body;
}

async function getPayPalToken() {
  const id     = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PayPal credentials not configured');

  const auth = Buffer.from(`${id}:${secret}`).toString('base64');
  const body = await ppFetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  return body.access_token;
}

async function sendOrderEmail(order) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    const lines = (order.items || []).map(i =>
      `  - ${i.title}${i.isSigned ? ' (SIGNED)' : ''} × ${i.qty || i.quantity || 1} @ $${Number(i.price).toFixed(2)}`
    ).join('\n');

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const paymentLine = order.payment_method === 'paypal'
      ? `PayPal — Transaction ID: ${order.payment_id} — Amount paid: $${Number(order.amount_paid).toFixed(2)}`
      : order.payment_method === 'venmo'
        ? `Venmo (manual — awaiting confirmation)`
        : `Invoice requested — payment pending`;

    await transporter.sendMail({
      from: `"RRR Store" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Order — ${order.customer_name} — $${Number(order.subtotal).toFixed(2)} [${order.payment_method || 'invoice'}]`,
      text: `
New order received from ${order.customer_name}

PAYMENT
${paymentLine}

CUSTOMER
Name:    ${order.customer_name}
Email:   ${order.customer_email}
Phone:   ${order.customer_phone || 'not provided'}
Address: ${order.shipping_address || 'not provided'}

ITEMS
${lines}

SUBTOTAL: $${Number(order.subtotal).toFixed(2)}
Notes: ${order.notes || 'none'}
Order ID: ${order.id}
      `.trim(),
    });
  } catch (err) {
    console.error('[Payments] Email notification failed:', err.message);
  }
}

// ── POST /api/payments/create-order ──────────────────────────────────────────
router.post('/create-order', async (req, res, next) => {
  try {
    const { subtotal, items } = req.body;
    if (!subtotal || !items?.length) {
      return res.status(400).json({ error: 'subtotal and items are required' });
    }

    const token = await getPayPalToken();
    const order = await ppFetch(`${paypalBase()}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: Number(subtotal).toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: Number(subtotal).toFixed(2) },
            },
          },
          items: items.map(i => ({
            name:        (i.title || 'Item').substring(0, 127),
            unit_amount: { currency_code: 'USD', value: Number(i.price).toFixed(2) },
            quantity:    String(i.qty || i.quantity || 1),
          })),
          description: 'Regroup Refocus Rebuild — Shop Order',
        }],
        application_context: {
          brand_name:          'Regroup Refocus Rebuild',
          landing_page:        'NO_PREFERENCE',
          user_action:         'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    });

    res.json({ paypalOrderId: order.id });
  } catch (err) {
    console.error('[Payments] create-order error:', err.data || err.message);
    res.status(500).json({ error: 'Failed to create PayPal order. Please try again.' });
  }
});

// ── POST /api/payments/capture ────────────────────────────────────────────────
router.post('/capture', async (req, res, next) => {
  try {
    const {
      paypalOrderId,
      customer_name, customer_email, customer_phone,
      shipping_address, notes, items, subtotal,
    } = req.body;

    if (!paypalOrderId || !customer_name || !customer_email || !items?.length) {
      return res.status(400).json({ error: 'paypalOrderId, customer info, and items are required' });
    }

    const token   = await getPayPalToken();
    const capture = await ppFetch(
      `${paypalBase()}/v2/checkout/orders/${paypalOrderId}/capture`,
      { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: '{}' }
    );

    const unit       = capture.purchase_units?.[0];
    const payment    = unit?.payments?.captures?.[0];
    const amountPaid = parseFloat(payment?.amount?.value || subtotal);
    const txId       = payment?.id || paypalOrderId;

    const result = await db.query(
      `INSERT INTO orders
         (customer_name, customer_email, customer_phone, shipping_address,
          items, subtotal, notes,
          payment_status, payment_method, payment_id, amount_paid, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [
        customer_name, customer_email,
        customer_phone || null, shipping_address || null,
        JSON.stringify(items), parseFloat(subtotal) || 0, notes || null,
        'paid', 'paypal', txId, amountPaid, 'confirmed',
      ]
    );

    await sendOrderEmail({ ...result.rows[0], items });
    res.json({ success: true, orderId: result.rows[0].id, transactionId: txId });
  } catch (err) {
    console.error('[Payments] capture error:', err.data || err.message);
    res.status(502).json({ error: err.message || 'Payment capture failed. Please try again.' });
  }
});

// ── POST /api/payments/invoice ────────────────────────────────────────────────
router.post('/invoice', async (req, res, next) => {
  try {
    const {
      customer_name, customer_email, customer_phone,
      shipping_address, notes, items, subtotal, payment_method,
    } = req.body;

    if (!customer_name || !customer_email || !items?.length) {
      return res.status(400).json({ error: 'Name, email, and items are required' });
    }

    const result = await db.query(
      `INSERT INTO orders
         (customer_name, customer_email, customer_phone, shipping_address,
          items, subtotal, notes,
          payment_status, payment_method, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        customer_name, customer_email,
        customer_phone || null, shipping_address || null,
        JSON.stringify(items), parseFloat(subtotal) || 0, notes || null,
        'unpaid', payment_method || 'invoice', 'pending',
      ]
    );

    await sendOrderEmail({ ...result.rows[0], items });
    res.status(201).json({ success: true, orderId: result.rows[0].id });
  } catch (err) { next(err); }
});

module.exports = router;
