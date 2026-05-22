const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database (non-blocking — server still starts if MongoDB is down)
connectDB().catch((err) => {
  console.warn('⚠️  MongoDB connection failed. Demo login will still work.');
  console.warn('   Run MongoDB and execute `node seed.js` for full functionality.');
});

const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const internRoutes = require('./routes/internRoutes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
const corsOrigin = process.env.NODE_ENV === 'production'
  ? 'http://localhost:5173'
  : true; // Allow all origins in development (Postman, browser, etc.)

app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ─── Debug logger (development only) ─────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('  Body:', JSON.stringify(req.body));
  }
  next();
});

// ─── Mount Routers ───────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/intern', internRoutes);

// ─── Base route ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Internship Verification API is running...',
    status: 'OK',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      me: 'GET /api/auth/me',
      generateCode: 'POST /api/intern/generate',
      verifyIntern: 'GET /api/intern/verify/:code',
      listInterns: 'GET /api/intern/list',
      getIntern: 'GET /api/intern/:id',
      updateIntern: 'PUT /api/intern/:id',
      dashboard: 'GET /api/intern/dashboard',
      deleteIntern: 'DELETE /api/intern/:id'
    }
  });
});

// ─── Error handling middleware ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`  📡 API: http://localhost:${PORT}/api`);
  console.log(`  🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('  Demo credentials:');
  console.log('  Email:    admin@test.com');
  console.log('  Password: password123');
  console.log('');
});
