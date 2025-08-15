const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseName: { type: String, required: true },
  progress: { type: Number, default: 0 }, // percentage (0-100)
  lastAccessed: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourseProgress', courseProgressSchema);
