const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'Email is required!',
  },
  code: {
    type: String,
    required: 'Code is required!',
  }
}, {timestamps: true})

module.exports = mongoose.model('Otp', otpSchema);
