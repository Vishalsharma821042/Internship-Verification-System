const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ─── Demo credentials (works even without MongoDB) ───────────────────────────
const DEMO_USERS = [
  {
    _id: 'demo_admin_001',
    name: 'System Administrator',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin'
  },
  {
    _id: 'demo_hr_001',
    name: 'HR Manager',
    email: 'hr@test.com',
    password: 'password123',
    role: 'hr'
  }
];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ─── Register ────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Check MongoDB connection before attempting DB queries
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.warn('[Register] ⚠️ MongoDB not connected');
      return res.status(503).json({ success: false, message: 'Database unavailable. Please try again later.' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });

    console.log('[Register] ✅ User registered:', user.email);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('[Register] ❌ Error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  console.log('');
  console.log('🔐 Login attempt received');
  console.log('   Email:', req.body?.email);
  console.log('   Password provided:', req.body?.password ? 'Yes' : 'No');

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('   ❌ Missing email or password');
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // ── Try MongoDB first ──────────────────────────────────────────────────
    let user = null;
    let isDbUser = false;

    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        // MongoDB is connected
        user = await User.findOne({ email });
        if (user) {
          isDbUser = true;
          console.log('   📦 Found user in database:', user.email);
        }
      } else {
        console.log('   ⚠️  MongoDB not connected, trying demo credentials...');
      }
    } catch (dbError) {
      console.log('   ⚠️  MongoDB query failed:', dbError.message);
    }

    // ── If DB user found, verify with bcrypt ───────────────────────────────
    if (isDbUser && user) {
      const isMatch = await user.matchPassword(password);
      if (isMatch) {
        console.log('   ✅ Login successful (database user)');
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          token: generateToken(user._id),
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } else {
        console.log('   ❌ Password mismatch (database user)');
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    // ── Fallback: Demo credentials (no MongoDB needed) ─────────────────────
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      console.log('   ✅ Login successful (demo credentials)');
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: generateToken(demoUser._id),
        user: {
          _id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role
        }
      });
    }

    // ── No match ───────────────────────────────────────────────────────────
    console.log('   ❌ No matching user found');
    return res.status(401).json({ success: false, message: 'Invalid email or password' });

  } catch (error) {
    console.error('   ❌ Login error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ─── Get Current User ────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { registerUser, loginUser, getMe };
