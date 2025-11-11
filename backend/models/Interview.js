const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: String,
  date: { type: Date, default: Date.now },
  score: Number,
  feedback: String,
  transcript: [String]
});

module.exports = mongoose.model('Interview', interviewSchema);
