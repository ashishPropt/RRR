const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all books
router.get('/', async (req, res, next) => {
  try {
    const { signed } = req.query;
    let query = 'SELECT * FROM books WHERE in_stock = true';
    const params = [];
    if (signed === 'true') {
      query += ' AND is_signed = true';
    }
    query += ' ORDER BY display_order ASC, created_at DESC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET single book
router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST create book (admin)
router.post('/', async (req, res, next) => {
  try {
    const { title, subtitle, description, author, price, amazon_url, cover_image, is_signed, signed_price, in_stock, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO books (title, subtitle, description, author, price, amazon_url, cover_image, is_signed, signed_price, in_stock, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title, subtitle, description, author || 'Natalie Cabinda', price, amazon_url, cover_image, is_signed, signed_price, in_stock !== false, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// PUT update book
router.put('/:id', async (req, res, next) => {
  try {
    const { title, subtitle, description, author, price, amazon_url, cover_image, is_signed, signed_price, in_stock, display_order } = req.body;
    const result = await db.query(
      `UPDATE books SET title=$1, subtitle=$2, description=$3, author=$4, price=$5, amazon_url=$6,
       cover_image=$7, is_signed=$8, signed_price=$9, in_stock=$10, display_order=$11, updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [title, subtitle, description, author, price, amazon_url, cover_image, is_signed, signed_price, in_stock, display_order, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
