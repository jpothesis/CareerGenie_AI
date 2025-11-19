const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['resume_generation', 'ai_interview', 'quiz', 'job_save', 'job_apply', 'custom'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  platform: { 
    type: String, 
    enum: ['mobile', 'desktop'], 
    default: 'desktop' 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
