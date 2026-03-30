// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DK's Cake World — Express Server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const { connectDB, connectCloudinary } = require('./config');

// ── Route imports ──────────────────────────
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const galleryRoutes = require('./routes/gallery');
const carouselRoutes = require('./routes/carousel');
const feedbackRoutes = require('./routes/feedback');
const brandingRoutes = require('./routes/branding');
const aboutRoutes = require('./routes/about');

// ── Initialize Express ─────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ────────────────────
app.use(helmet());

// ── Rate Limiting ──────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ── CORS ───────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ── Body Parsers ───────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Logging ────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ───────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: "DK's Cake World API is running 🎂",
    timestamp: new Date().toISOString(),
  });
});

// ── Mount API Routes ───────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/carousel', carouselRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/branding', brandingRoutes);
app.use('/api/about', aboutRoutes);

// ── 404 Handler ────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ── Start Server ───────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    connectCloudinary();

    app.listen(PORT, () => {
      console.log(`\n🎂 DK's Cake World API`);
      console.log(`   Environment : ${process.env.NODE_ENV}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   Health      : http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
