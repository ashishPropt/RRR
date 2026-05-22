const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

function buildOrderEmail(order) {
  const lines = order.items.map(i =>
    `  - ${i.title}${i.isSigned ? ' (SIGNED)' : ''} × ${i.quantity} @ $${Number(i.price).toFixed(2)}`
  ).join('\n');

  return `
New order received from ${order.customer_name}

CUSTOMER DETAILS
Name:    ${order.customer_name}
Email:   ${order.customer_email}
Phone:   ${order.customer_phone || 'not provided'}
Address: ${order.shipping_address || 'not provided'}

ORDER ITEMS
${lines}

SUBTOTAL: $${Number(order.subtotal).toFixed(2)}

Notes: ${order.notes || 'none'}

Order ID: ${order.id}
Placed:   ${new Date(order.created_at).toLocaleString()}
  `.trim();
}

// POST /api/orders — place an order
router.post('/', async (req, res, next) => {
  try {
    const { customer_name, customer_email, customer_phone, shipping_address, items, subtotal, notes } = req.body;

    if (!customer_name || !customer_email || !items || !items.length) {
      return res.status(400).json({ error: 'Name, email, and at least one item are required' });
    }

    const result = await db.query(
      `INSERT INTO orders (customer_name,customer_email,customer_phone,shipping_address,items,subtotal,notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [customer_name, customer_email, customer_phone||null, shipping_address||null,
       JSON.stringify(items), parseFloat(subtotal)||0, notes||null]
    );
    const order = result.rows[0];

    // Send notification email (non-blocking)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({
          from: `"RRR Store" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_TO || process.env.EMAIL_USER,
          subject: `New Order from ${customer_name} — $${Number(subtotal).toFixed(2)}`,
          text: buildOrderEmail(order),
        });
      } catch (mailErr) {
        console.error('[Orders] Email notification failed:', mailErr.message);
      }
    }

    res.status(201).json({ orderId: order.id, success: true });
  } catch (err) { next(err); }
});

module.exports = router;
