const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fullName: { type: String, required: true },
  headline: { type: String }, // e.g. "Full Stack Developer"
  bio: { type: String },
  location: { type: String },
  skills: { type: [String], default: [] },
  profilePic: { type: String }, // store uploaded image URL
  experience: [
    {
      company: String,
      role: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ],
  education: [
    {
      institution: String,
      degree: String,
      startDate: Date,
      endDate: Date,
      description: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
