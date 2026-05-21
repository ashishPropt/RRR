const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// POST contact form submission
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    // Save to DB
    const result = await db.query(
      'INSERT INTO contact_messages (name, phone, email, message) VALUES ($1,$2,$3,$4) RETURNING id',
      [name, phone || null, email, message || null]
    );

    // Send email notification (non-blocking)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = createTransporter();
      transporter.sendMail({
        from: `"RRR Website" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL || 'nataliecabinda@gmail.com',
        subject: `New Contact Form Message from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message || 'No message'}</p>
        `,
      }).catch(console.error);
    }

    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) { next(err); }
});

// GET all messages (admin)
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) { next(err); }
});

module.exports = router;
