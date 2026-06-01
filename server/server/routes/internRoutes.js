const express = require('express');
const router = express.Router();
const {
  generateCode,
  verifyIntern,
  getAllInterns,
  getInternById,
  updateIntern,
  getDashboardStats,
  deleteIntern
} = require('../controllers/internController');
const { validateGenerateCode } = require('../middleware/validate');
const { protect, adminOnly } = require('../middleware/auth');

// ─── Protected Routes (require authentication) ──────────────────────────────

// POST /api/intern/generate — Generate verification code & save candidate
router.post('/generate', protect, validateGenerateCode, generateCode);

// GET /api/intern/dashboard — Dashboard statistics
router.get('/dashboard', protect, getDashboardStats);

// GET /api/intern/list — List all interns (Admin only)
router.get('/list', protect, adminOnly, getAllInterns);

// GET /api/intern/:id — Get single intern by ID
router.get('/:id', protect, getInternById);

// PUT /api/intern/:id — Update intern details (Admin only)
router.put('/:id', protect, adminOnly, updateIntern);

// DELETE /api/intern/:id — Delete intern record (Admin only)
router.delete('/:id', protect, adminOnly, deleteIntern);

// ─── Public Routes ──────────────────────────────────────────────────────────

// GET /api/intern/verify/:code — Verify internship (public)
router.get('/verify/:code', verifyIntern);

module.exports = router;
