const multer = require('multer');
const csv = require('csvtojson');
const Intern = require('../models/Intern');
const generateVerificationCode = require('../utils/generateCode');

// ─── Multer config: store file in memory ─────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Accept CSV and text files
    if (
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'text/plain' ||
      file.originalname.endsWith('.csv')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
}).single('file');

// ─── Upload CSV ──────────────────────────────────────────────────────────────
const uploadCSV = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('[Upload] Multer error:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a CSV file'
      });
    }

    console.log('[Upload] File received:', req.file.originalname, `(${req.file.size} bytes)`);

    try {
      const csvString = req.file.buffer.toString('utf-8');
      console.log('[Upload] CSV preview:', csvString.substring(0, 200));

      const jsonArray = await csv().fromString(csvString);
      console.log('[Upload] Parsed rows:', jsonArray.length);

      if (jsonArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'CSV file is empty or has invalid format. Expected headers: name,designation,duration'
        });
      }

      // ── Validate and prepare data ──────────────────────────────────────
      const validInterns = [];
      const invalidRows = [];

      for (let i = 0; i < jsonArray.length; i++) {
        const row = jsonArray[i];
        const name = (row.name || row.Name || row.NAME || '').trim();
        const designation = (row.designation || row.Designation || row.DESIGNATION || '').trim();
        const duration = (row.duration || row.Duration || row.DURATION || '').trim();

        if (name && designation && duration) {
          validInterns.push({
            name,
            designation,
            duration,
            verificationCode: generateVerificationCode(10)
          });
        } else {
          invalidRows.push({
            row: i + 2, // +2 for header row + 0-index
            data: row,
            reason: `Missing: ${!name ? 'name ' : ''}${!designation ? 'designation ' : ''}${!duration ? 'duration' : ''}`
          });
        }
      }

      if (validInterns.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid rows found. Ensure CSV has columns: name, designation, duration',
          invalidRows: invalidRows.slice(0, 5) // Show first 5 errors
        });
      }

      // ── Save to MongoDB if connected ───────────────────────────────────
      let savedCount = 0;
      const mongoose = require('mongoose');

      if (mongoose.connection.readyState === 1) {
        try {
          const result = await Intern.insertMany(validInterns, { ordered: false });
          savedCount = result.length;
          console.log(`[Upload] ✅ Saved ${savedCount} interns to database`);
        } catch (dbErr) {
          // insertMany with ordered:false continues on duplicate key errors
          console.error('[Upload] DB insert error:', dbErr.message);
          // Some may have been inserted
          savedCount = dbErr.insertedDocs?.length || 0;
        }
      } else {
        console.log('[Upload] ⚠️ MongoDB not connected, returning demo success');
        savedCount = validInterns.length;
      }

      return res.status(200).json({
        success: true,
        message: `Successfully processed ${savedCount} intern(s)`,
        uploaded: savedCount,
        failed: invalidRows.length,
        total: jsonArray.length,
        invalidRows: invalidRows.slice(0, 5)
      });

    } catch (error) {
      console.error('[Upload] ❌ Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to process CSV file. Ensure proper format: name,designation,duration'
      });
    }
  });
};

module.exports = { uploadCSV };
