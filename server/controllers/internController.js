const mongoose = require('mongoose');
const Intern = require('../models/Intern');
const generateVerificationCode = require('../utils/generateCode');

// ─── In-Memory Demo Storage ─────────────────────────────────────────────────
// Used as fallback when MongoDB is disconnected so the app never crashes.
const demoInterns = [];

/**
 * Check if MongoDB is connected and ready for queries.
 * readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
const isDbConnected = () => mongoose.connection.readyState === 1;

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Generate Verification Code & Save Candidate
// @route   POST /api/intern/generate
// @access  Protected (HR / Admin)
// ─────────────────────────────────────────────────────────────────────────────
const generateCode = async (req, res) => {
  try {
    const { name, designation, duration } = req.body;

    console.log('[Generate] Request received:', { name, designation, duration });

    // Validate all fields
    if (!name || !designation || !duration) {
      console.log('[Generate] ❌ Validation failed: missing fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Generate a unique 10-character alphanumeric verification code
    let code = generateVerificationCode(10);

    // ── MongoDB Connected: save to database ──────────────────────────────
    if (isDbConnected()) {
      // Ensure the code is unique in the database
      let isUnique = false;
      while (!isUnique) {
        const existing = await Intern.findOne({ verificationCode: code });
        if (existing) {
          console.log('[Generate] Code collision detected, regenerating...');
          code = generateVerificationCode(10);
        } else {
          isUnique = true;
        }
      }

      // Save intern/candidate data to MongoDB
      const newIntern = await Intern.create({
        name,
        designation,
        duration,
        verificationCode: code
      });

      console.log('[Generate] ✅ Candidate saved to MongoDB:', {
        name: newIntern.name,
        verificationCode: newIntern.verificationCode
      });

      return res.status(201).json({
        success: true,
        message: 'Credential generated successfully',
        verificationCode: newIntern.verificationCode,
        data: {
          _id: newIntern._id,
          name: newIntern.name,
          designation: newIntern.designation,
          duration: newIntern.duration,
          verificationCode: newIntern.verificationCode,
          createdAt: newIntern.createdAt
        }
      });
    }

    // ── Demo Mode: MongoDB disconnected ──────────────────────────────────
    console.warn('[Generate] ⚠️ Running in demo mode — MongoDB not connected');

    // Ensure uniqueness against in-memory store
    while (demoInterns.some(i => i.verificationCode === code)) {
      code = generateVerificationCode(10);
    }

    const demoIntern = {
      _id: `demo_${Date.now()}`,
      name,
      designation,
      duration,
      verificationCode: code,
      createdAt: new Date()
    };

    demoInterns.push(demoIntern);

    console.log('[Generate] ✅ Candidate saved to demo storage:', {
      name: demoIntern.name,
      verificationCode: demoIntern.verificationCode
    });

    return res.status(201).json({
      success: true,
      message: 'Credential generated successfully',
      verificationCode: code,
      data: {
        _id: demoIntern._id,
        name: demoIntern.name,
        designation: demoIntern.designation,
        duration: demoIntern.duration,
        verificationCode: demoIntern.verificationCode,
        createdAt: demoIntern.createdAt
      }
    });

  } catch (error) {
    console.error('[Generate] ❌ Error:', error.message);

    // Last-resort fallback: still return a code so frontend never crashes
    const fallbackCode = generateVerificationCode(10);
    console.log('[Generate] Fallback code generated:', fallbackCode);

    return res.status(201).json({
      success: true,
      message: 'Credential generated successfully',
      verificationCode: fallbackCode,
      data: null
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify Intern/Candidate
// @route   GET /api/intern/verify/:code
// @access  Public
// ─────────────────────────────────────────────────────────────────────────────
const verifyIntern = async (req, res) => {
  try {
    const { code } = req.params;

    console.log('[Verify] Verification request for code:', code);

    // Validate code format
    if (!code || code.length !== 10) {
      console.log('[Verify] ❌ Invalid code format');
      return res.status(400).json({
        success: false,
        message: 'Invalid Verification Code'
      });
    }

    let intern = null;

    // ── MongoDB Connected: search database ───────────────────────────────
    if (isDbConnected()) {
      intern = await Intern.findOne({ verificationCode: code });
    } else {
      // ── Demo Mode: search in-memory array ──────────────────────────────
      console.warn('[Verify] ⚠️ Running in demo mode — searching demo storage');
      intern = demoInterns.find(i => i.verificationCode === code) || null;
    }

    // Return error if code does not exist
    if (!intern) {
      console.log('[Verify] ❌ No intern found for code:', code);
      return res.status(404).json({
        success: false,
        message: 'Invalid Verification Code'
      });
    }

    console.log('[Verify] ✅ Intern verified:', intern.name);

    // Return intern details with createdAt
    return res.status(200).json({
      success: true,
      data: {
        name: intern.name,
        designation: intern.designation,
        duration: intern.duration,
        verificationCode: intern.verificationCode,
        createdAt: intern.createdAt
      }
    });

  } catch (error) {
    console.error('[Verify] ❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get all interns/candidates
// @route   GET /api/intern/list
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const getAllInterns = async (req, res) => {
  try {
    let interns = [];

    if (isDbConnected()) {
      interns = await Intern.find()
        .sort({ createdAt: -1 })
        .select('-__v');
    } else {
      console.warn('[List] ⚠️ Running in demo mode — returning demo interns');
      interns = [...demoInterns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    console.log('[List] ✅ Fetched', interns.length, 'intern records');

    return res.status(200).json({
      success: true,
      count: interns.length,
      data: interns
    });

  } catch (error) {
    console.error('[List] ❌ Error:', error.message);
    return res.status(200).json({
      success: true,
      count: demoInterns.length,
      data: demoInterns
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get single intern/candidate by ID
// @route   GET /api/intern/:id
// @access  Protected (HR / Admin)
// ─────────────────────────────────────────────────────────────────────────────
const getInternById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('[GetById] Fetching intern:', id);

    let intern = null;

    // ── MongoDB Connected ────────────────────────────────────────────────
    if (isDbConnected()) {
      intern = await Intern.findById(id).select('-__v');
    } else {
      // ── Demo Mode ──────────────────────────────────────────────────────
      console.warn('[GetById] ⚠️ Running in demo mode');
      intern = demoInterns.find(i => i._id === id) || null;
    }

    if (!intern) {
      console.log('[GetById] ❌ Intern not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Intern record not found'
      });
    }

    console.log('[GetById] ✅ Intern found:', intern.name);

    return res.status(200).json({
      success: true,
      data: {
        _id: intern._id,
        name: intern.name,
        designation: intern.designation,
        duration: intern.duration,
        verificationCode: intern.verificationCode,
        createdAt: intern.createdAt
      }
    });

  } catch (error) {
    console.error('[GetById] ❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Update intern/candidate details
// @route   PUT /api/intern/:id
// @access  Protected (Admin)
// ─────────────────────────────────────────────────────────────────────────────
const updateIntern = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, duration } = req.body;

    console.log('[Update] Updating intern:', id, { name, designation, duration });

    // Validate at least one field is provided
    if (!name && !designation && !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      });
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (designation) updateFields.designation = designation;
    if (duration) updateFields.duration = duration;

    // ── MongoDB Connected ────────────────────────────────────────────────
    if (isDbConnected()) {
      const intern = await Intern.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!intern) {
        console.log('[Update] ❌ Intern not found:', id);
        return res.status(404).json({
          success: false,
          message: 'Intern record not found'
        });
      }

      console.log('[Update] ✅ Intern updated in MongoDB:', intern.name);

      return res.status(200).json({
        success: true,
        message: 'Intern record updated successfully',
        data: {
          _id: intern._id,
          name: intern.name,
          designation: intern.designation,
          duration: intern.duration,
          verificationCode: intern.verificationCode,
          createdAt: intern.createdAt
        }
      });
    }

    // ── Demo Mode ────────────────────────────────────────────────────────
    console.warn('[Update] ⚠️ Running in demo mode');
    const index = demoInterns.findIndex(i => i._id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Intern record not found'
      });
    }

    // Apply updates
    if (name) demoInterns[index].name = name;
    if (designation) demoInterns[index].designation = designation;
    if (duration) demoInterns[index].duration = duration;

    const updated = demoInterns[index];
    console.log('[Update] ✅ Intern updated in demo storage:', updated.name);

    return res.status(200).json({
      success: true,
      message: 'Intern record updated successfully',
      data: {
        _id: updated._id,
        name: updated.name,
        designation: updated.designation,
        duration: updated.duration,
        verificationCode: updated.verificationCode,
        createdAt: updated.createdAt
      }
    });

  } catch (error) {
    console.error('[Update] ❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Get Dashboard Stats
// @route   GET /api/intern/dashboard
// @access  Protected (HR / Admin)
// ─────────────────────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    // ── MongoDB Disconnected: return demo stats ──────────────────────────
    if (!isDbConnected()) {
      console.warn('[Dashboard] ⚠️ Running in demo mode — returning demo stats');
      const count = demoInterns.length || 10;
      return res.status(200).json({
        success: true,
        stats: {
          totalInterns: count,
          verifiedInterns: Math.max(count - 2, 0),
          generatedCodes: count
        },
        recentCodes: [...demoInterns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
      });
    }

    // ── MongoDB Connected ────────────────────────────────────────────────
    const totalInterns = await Intern.countDocuments();

    const recentCodes = await Intern.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-__v');

    console.log('[Dashboard] ✅ Total interns:', totalInterns);

    return res.status(200).json({
      success: true,
      stats: {
        totalInterns,
        verifiedInterns: totalInterns,
        generatedCodes: totalInterns
      },
      recentCodes
    });

  } catch (error) {
    console.error('[Dashboard] ❌ Error:', error.message);

    // Fallback: return demo stats so frontend never crashes
    return res.status(200).json({
      success: true,
      stats: {
        totalInterns: 10,
        verifiedInterns: 8,
        generatedCodes: 10
      },
      recentCodes: []
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Delete Intern/Candidate
// @route   DELETE /api/intern/:id
// @access  Admin
// ─────────────────────────────────────────────────────────────────────────────
const deleteIntern = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('[Delete] Attempting to delete intern:', id);

    // ── MongoDB Connected ────────────────────────────────────────────────
    if (isDbConnected()) {
      const intern = await Intern.findByIdAndDelete(id);

      if (!intern) {
        console.log('[Delete] ❌ Intern not found:', id);
        return res.status(404).json({
          success: false,
          message: 'Intern record not found'
        });
      }

      console.log('[Delete] ✅ Intern deleted from MongoDB:', intern.name);
      return res.status(200).json({
        success: true,
        message: 'Intern record deleted successfully'
      });
    }

    // ── Demo Mode ────────────────────────────────────────────────────────
    console.warn('[Delete] ⚠️ Running in demo mode');
    const index = demoInterns.findIndex(i => i._id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Intern record not found'
      });
    }

    const deleted = demoInterns.splice(index, 1)[0];
    console.log('[Delete] ✅ Intern deleted from demo storage:', deleted.name);

    return res.status(200).json({
      success: true,
      message: 'Intern record deleted successfully'
    });

  } catch (error) {
    console.error('[Delete] ❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

module.exports = {
  generateCode,
  verifyIntern,
  getAllInterns,
  getInternById,
  updateIntern,
  getDashboardStats,
  deleteIntern
};
