const mongoose = require('mongoose');

const resumeScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true }, // e.g., out of 100
  generatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResumeScore', resumeScoreSchema);
