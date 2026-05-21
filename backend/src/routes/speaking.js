const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM speaking_events WHERE active = true ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, event_date, location, image_url, booking_url } = req.body;
    const result = await db.query(
      `INSERT INTO speaking_events (title, description, event_date, location, image_url, booking_url)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, event_date, location, image_url, booking_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
