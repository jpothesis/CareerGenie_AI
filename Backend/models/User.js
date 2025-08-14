// User model for a Node.js application using Mongoose and bcrypt for password hashing
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User.js
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // User profile information
  resumeScore: { type: Number, default: 0 },          // out of 100
  aiInterviewScore: { type: Number, default: 0 },     // rating (e.g., out of 5 or 100)
  learningProgress: { type: Number, default: 0 },     // percentage (0–100)

  deviceUsage: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 }
  },

  // Track user activities
  activities: [
    {
      type: {
        type: String,                                  // e.g., 'Resume Generated', 'Career Quiz Taken'
        required: true
      },
      date: { type: Date, default: Date.now },
      status: { type: String, default: 'Completed' }   // e.g., Completed / Pending
    }
  ]
});

// To hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', UserSchema);
