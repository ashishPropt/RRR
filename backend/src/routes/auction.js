const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM auction_items WHERE active = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM auction_items WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Item not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, starting_bid, image_url, end_date } = req.body;
    const result = await db.query(
      `INSERT INTO auction_items (title, description, starting_bid, image_url, end_date)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, description, starting_bid, image_url, end_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
