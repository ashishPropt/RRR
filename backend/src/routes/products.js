const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM products WHERE active = true';
    const params = [];
    if (category) { params.push(category); query += ` AND category = $${params.length}`; }
    query += ' ORDER BY display_order ASC, name ASC';
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, price, image_url, category, stock, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO products (name, description, price, image_url, category, stock, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, description, price, image_url, category, stock || 0, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
