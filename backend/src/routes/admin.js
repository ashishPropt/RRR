const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Fallback token for stateless auth (stored in memory, regenerated on restart)
let ADMIN_TOKEN = process.env.ADMIN_TOKEN || crypto.randomBytes(32).toString('hex');

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth  = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Auto-seed default admin user if none exists
async function ensureAdminExists() {
  try {
    const { rows } = await db.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(rows[0].count) === 0) {
      const defaultPass = process.env.ADMIN_PASSWORD || 'rrr-admin-2026';
      const hash = await bcrypt.hash(defaultPass, 12);
      await db.query(
        'INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)',
        ['ncabinda', hash]
      );
      console.log('[Admin] Default admin user created: ncabinda');
    }
  } catch (err) {
    console.error('[Admin] Could not seed admin user:', err.message);
  }
}
ensureAdminExists();

// ── POST /api/admin/login ────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const { rows } = await db.query(
      'SELECT * FROM admin_users WHERE username = $1', [username.trim()]
    );
    if (!rows.length) return res.status(401).json({ error: 'Invalid username or password' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });
    res.json({ token: ADMIN_TOKEN, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ── POST /api/admin/change-password ─────────────────────────────────────────
router.post('/change-password', requireAdmin, async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }
  try {
    const { rows } = await db.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 12);
    await db.query(
      'UPDATE admin_users SET password_hash=$1, updated_at=NOW() WHERE username=$2',
      [hash, username]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ── Blog management ──────────────────────────────────────────────────────────

router.get('/blog/stats', requireAdmin, async (req, res, next) => {
  try {
    const [total, published, drafts] = await Promise.all([
      db.query('SELECT COUNT(*) FROM blog_posts'),
      db.query('SELECT COUNT(*) FROM blog_posts WHERE published=true'),
      db.query('SELECT COUNT(*) FROM blog_posts WHERE published=false'),
    ]);
    res.json({
      total:     parseInt(total.rows[0].count),
      published: parseInt(published.rows[0].count),
      drafts:    parseInt(drafts.rows[0].count),
    });
  } catch (err) { next(err); }
});

router.get('/blog', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id,title,slug,category,published,created_at,updated_at FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/blog/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM blog_posts WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.post('/blog', requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, content, excerpt, featured_image, author, category, tags, published } = req.body;
    if (!title || !slug || !content) return res.status(400).json({ error: 'title, slug, and content are required' });
    const result = await db.query(
      `INSERT INTO blog_posts (title,slug,content,excerpt,featured_image,author,category,tags,published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title.trim(), slug.trim(), content, excerpt||null, featured_image||null,
       author||'Natalie Cabinda', category||'Uncategorized', tags||[], published!==false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A post with this slug already exists.' });
    next(err);
  }
});

router.put('/blog/:id', requireAdmin, async (req, res, next) => {
  try {
    const { title,slug,content,excerpt,featured_image,author,category,tags,published } = req.body;
    const result = await db.query(
      `UPDATE blog_posts SET title=$1,slug=$2,content=$3,excerpt=$4,featured_image=$5,
       author=$6,category=$7,tags=$8,published=$9,updated_at=NOW() WHERE id=$10 RETURNING *`,
      [title,slug,content,excerpt||null,featured_image||null,author,category,tags||[],published,req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A post with this slug already exists.' });
    next(err);
  }
});

router.put('/blog/:id/publish', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE blog_posts SET published=$1,updated_at=NOW() WHERE id=$2 RETURNING id,published',
      [req.body.published, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/blog/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM blog_posts WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

// ── Books management ─────────────────────────────────────────────────────────

router.get('/books', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY display_order ASC');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/books', requireAdmin, async (req, res, next) => {
  try {
    const { title,subtitle,description,author,price,amazon_url,cover_image,is_signed,signed_price,in_stock,display_order } = req.body;
    const result = await db.query(
      `INSERT INTO books (title,subtitle,description,author,price,amazon_url,cover_image,is_signed,signed_price,in_stock,display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [title,subtitle||null,description||null,author||'Natalie Cabinda',
       parseFloat(price)||0, amazon_url||null, cover_image||null,
       is_signed||false, signed_price?parseFloat(signed_price):null,
       in_stock!==false, parseInt(display_order)||99]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/books/:id', requireAdmin, async (req, res, next) => {
  try {
    const { title,subtitle,description,author,price,amazon_url,cover_image,is_signed,signed_price,in_stock,display_order } = req.body;
    const result = await db.query(
      `UPDATE books SET title=$1,subtitle=$2,description=$3,author=$4,price=$5,amazon_url=$6,
       cover_image=$7,is_signed=$8,signed_price=$9,in_stock=$10,display_order=$11,updated_at=NOW()
       WHERE id=$12 RETURNING *`,
      [title,subtitle||null,description||null,author||'Natalie Cabinda',
       parseFloat(price)||0, amazon_url||null, cover_image||null,
       is_signed||false, signed_price?parseFloat(signed_price):null,
       in_stock!==false, parseInt(display_order)||99, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Book not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/books/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM books WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Book not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

// ── Products (boutique) management ───────────────────────────────────────────

router.get('/products', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY display_order ASC, name ASC');
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/products', requireAdmin, async (req, res, next) => {
  try {
    const { name,description,price,image_url,category,stock,display_order,active } = req.body;
    const result = await db.query(
      `INSERT INTO products (name,description,price,image_url,category,stock,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name,description||null,parseFloat(price)||0,image_url||null,
       category||'General',parseInt(stock)||0,parseInt(display_order)||99,active!==false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const { name,description,price,image_url,category,stock,display_order,active } = req.body;
    const result = await db.query(
      `UPDATE products SET name=$1,description=$2,price=$3,image_url=$4,category=$5,
       stock=$6,display_order=$7,active=$8 WHERE id=$9 RETURNING *`,
      [name,description||null,parseFloat(price)||0,image_url||null,
       category||'General',parseInt(stock)||0,parseInt(display_order)||99,active!==false,req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/products/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('DELETE FROM products WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json({ deleted: true });
  } catch (err) { next(err); }
});

// ── Orders management ────────────────────────────────────────────────────────

router.get('/orders', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/orders/:id', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM orders WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

router.put('/orders/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const result = await db.query(
      'UPDATE orders SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING id,status',
      [req.body.status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = { router, requireAdmin };
