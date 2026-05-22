const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Please add a designation'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Please add a duration'],
    trim: true
  },
  verificationCode: {
    type: String,
    required: [true, 'Verification code is missing'],
    unique: true,
    index: true // Indexing for faster search during verification
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Intern', internSchema);
