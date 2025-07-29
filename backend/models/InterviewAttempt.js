const mongoose = require('mongoose');

const interviewAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String },
  date: { type: Date, default: Date.now },
  score: { type: Number, required: true },          // e.g., out of 5 or 100
  feedback: { type: String },                       // AI-generated feedback
  transcript: [String]                              // Optional: list of answers/questions
});

module.exports = mongoose.model('InterviewAttempt', interviewAttemptSchema);
