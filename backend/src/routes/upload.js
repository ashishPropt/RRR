const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Only images allowed'), allowed.includes(file.mimetype));
  },
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    await db.query(
      'INSERT INTO media (filename, original_name, mime_type, size, url, alt_text) VALUES ($1,$2,$3,$4,$5,$6)',
      [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url, req.body.alt_text || '']
    );
    res.json({ url, filename: req.file.filename });
  } catch (err) { next(err); }
});

module.exports = router;
