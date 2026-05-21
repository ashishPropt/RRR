const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET all posts (with pagination)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;

    let whereClause = 'WHERE published = true';
    const params = [];
    if (category) {
      params.push(category);
      whereClause += ` AND category = $${params.length}`;
    }

    const countResult = await db.query(`SELECT COUNT(*) FROM blog_posts ${whereClause}`, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const result = await db.query(
      `SELECT id, title, slug, excerpt, featured_image, author, category, tags, created_at, updated_at
       FROM blog_posts ${whereClause}
       ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      posts: result.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) { next(err); }
});

// GET recent posts (for homepage preview)
router.get('/recent', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 3;
    const result = await db.query(
      `SELECT id, title, slug, excerpt, featured_image, author, category, created_at
       FROM blog_posts WHERE published = true ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET categories
router.get('/categories', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT category, COUNT(*) as count FROM blog_posts WHERE published = true GROUP BY category ORDER BY count DESC`
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

// GET single post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true',
      [req.params.slug]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

// POST create post
router.post('/', async (req, res, next) => {
  try {
    const { title, slug, content, excerpt, featured_image, author, category, tags, published } = req.body;
    const result = await db.query(
      `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author, category, tags, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, slug, content, excerpt, featured_image, author || 'Natalie Cabinda', category || 'Uncategorized', tags || [], published !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

// PUT update post
router.put('/:id', async (req, res, next) => {
  try {
    const { title, slug, content, excerpt, featured_image, author, category, tags, published } = req.body;
    const result = await db.query(
      `UPDATE blog_posts SET title=$1, slug=$2, content=$3, excerpt=$4, featured_image=$5,
       author=$6, category=$7, tags=$8, published=$9, updated_at=NOW() WHERE id=$10 RETURNING *`,
      [title, slug, content, excerpt, featured_image, author, category, tags, published, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;
