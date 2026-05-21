require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Nginx reverse proxy
app.set('trust proxy', 1);

// Security & middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// Serve static images bundled with the app
app.use('/images', express.static(path.join(__dirname, '..', '..', 'frontend', 'public', 'images')));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });
app.use('/api/', limiter);
app.use('/api/contact', contactLimiter);

// Routes
const { router: adminRouter } = require('./routes/admin');
app.use('/api/admin', adminRouter);
app.use('/api/books', require('./routes/books'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/products', require('./routes/products'));
app.use('/api/auction', require('./routes/auction'));
app.use('/api/speaking', require('./routes/speaking'));
app.use('/api/nonprofit', require('./routes/nonprofit'));
app.use('/api/slides', require('./routes/slides'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(PORT, () => console.log(`RRR server running on port ${PORT}`));

module.exports = app;
