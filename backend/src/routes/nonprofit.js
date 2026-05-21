const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM nonprofit_programs WHERE active = true ORDER BY display_order ASC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description, image_url, display_order } = req.body;
    const result = await db.query(
      `INSERT INTO nonprofit_programs (name, description, image_url, display_order)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, description, image_url, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
