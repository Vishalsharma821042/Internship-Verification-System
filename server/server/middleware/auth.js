const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Demo users for fallback when MongoDB is unavailable ─────────────────────
const DEMO_USERS = {
  demo_admin_001: {
    _id: 'demo_admin_001',
    name: 'System Administrator',
    email: 'admin@test.com',
    role: 'admin'
  },
  demo_hr_001: {
    _id: 'demo_hr_001',
    name: 'HR Manager',
    email: 'hr@test.com',
    role: 'hr'
  }
};

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      console.log('[Auth] Token verified, user ID:', decoded.id);

      // ── Try MongoDB first ──────────────────────────────────────────────
      let user = null;
      try {
        const mongoose = require('mongoose');
        if (mongoose.connection.readyState === 1) {
          user = await User.findById(decoded.id).select('-password');
        }
      } catch (dbErr) {
        console.log('[Auth] MongoDB lookup failed:', dbErr.message);
      }

      // ── Fallback: check demo users ─────────────────────────────────────
      if (!user && DEMO_USERS[decoded.id]) {
        user = DEMO_USERS[decoded.id];
        console.log('[Auth] Using demo user:', user.email);
      }

      if (!user) {
        console.log('[Auth] ❌ User not found for ID:', decoded.id);
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.log('[Auth] ❌ Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('[Auth] ❌ No token provided');
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

module.exports = { protect, adminOnly };
