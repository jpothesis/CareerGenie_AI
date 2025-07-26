const mongoose = require('mongoose');

const appliedJob_Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  notes: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AppliedJob', appliedJob_Schema);
