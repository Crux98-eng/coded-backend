const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  email: { type: String, required: true, unique: true },
  name: { type: String, required: false }, // User's name
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'BLOCKED'], default: 'PENDING' },
  subscription: { type: String, default: null }, // e.g., 'basic', 'premium'
  createdAt: { type: Date, default: Date.now },
  approvedAt: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);