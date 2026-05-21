const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM hero_slides WHERE active = true ORDER BY display_order ASC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { image_url, title, subtitle, quote, quote_author, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO hero_slides (image_url, title, subtitle, quote, quote_author, display_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [image_url, title, subtitle, quote, quote_author, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
