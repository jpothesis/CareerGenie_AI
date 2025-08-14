const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sections: {
    education: [String],
    experience: [String],
    skills: [String],
    projects: [String],
    summary: String
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
