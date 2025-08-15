const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    skillsRequired: [String],
    location: String,
    status: {
      type: String,
      enum: ['Wishlist', 'Applied', 'Interview', 'Offer'],
      default: 'Wishlist',
    },
    notes: {
      recruiter: { type: String },
      interviewDate: { type: Date },
      comments: { type: String },
    },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
