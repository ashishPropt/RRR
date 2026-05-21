const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/database');

// Credentials (from env or safe defaults)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rrr-admin-2026';
const ADMIN_TOKEN    = process.env.ADMIN_TOKEN    || crypto.randomBytes(32).toString('hex');

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth  = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  res.json({ token: ADMIN_TOKEN });
});

// ── Blog management (all protected) ─────────────────────────────────────────

// GET /api/admin/blog — all posts including drafts
router.get('/blog', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT id, title, slug, category, published, created_at, updated_at
       FROM blog_posts ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET /api/admin/blog/stats
router.get('/blog/stats', requireAdmin, async (req, res, next) => {
  try {
    const total     = await db.query('SELECT COUNT(*) FROM blog_posts');
    const published = await db.query('SELECT COUNT(*) FROM blog_posts WHERE published = true');
    const drafts    = await db.query('SELECT COUNT(*) FROM blog_posts WHERE published = false');
    res.json({
      total:     parseInt(total.rows[0].count),
      published: parseInt(published.rows[0].count),
      drafts:    parseInt(drafts.rows[0].count),
    });
  } catch (err) { next(err); }
});

// GET /api/admin/blog/:id — single post (any publish state)
router.get('/blog/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM blog_posts WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST /api/admin/blog — create post
router.post('/blog', requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, content, excerpt, featured_image, author, category, tags, published } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'title, slug, and content are required' });
    }
    const result = await db.query(
      `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author, category, tags, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        title.trim(),
        slug.trim(),
        content,
        excerpt || null,
        featured_image || null,
        author || 'Natalie Cabinda',
        category || 'Uncategorized',
        tags || [],
        published !== false,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A post with this slug already exists. Please choose a different slug.' });
    }
    next(err);
  }
});

// PUT /api/admin/blog/:id — full update
router.put('/blog/:id', requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, content, excerpt, featured_image, author, category, tags, published } = req.body;
    const result = await db.query(
      `UPDATE blog_posts
       SET title=$1, slug=$2, content=$3, excerpt=$4, featured_image=$5,
           author=$6, category=$7, tags=$8, published=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
      [title, slug, content, excerpt || null, featured_image || null, author, category, tags || [], published, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'A post with this slug already exists.' });
    }
    next(err);
  }
});

// PUT /api/admin/blog/:id/publish — toggle published state
router.put('/blog/:id/publish', requireAdmin, async (req, res, next) => {
  try {
    const { published } = req.body;
    const result = await db.query(
      'UPDATE blog_posts SET published=$1, updated_at=NOW() WHERE id=$2 RETURNING id, published',
      [published, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// DELETE /api/admin/blog/:id
router.delete('/blog/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM blog_posts WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

module.exports = { router, requireAdmin };
