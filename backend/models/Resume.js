// models/Resume.js

const mongoose = require('mongoose');

// ⭐️ Use a separate schema for reusable structured blocks
const experienceSchema = new mongoose.Schema({
    id: String,
    role: String,
    company: String,
    duration: String,
    description: String,
}, { _id: false });

const educationSchema = new mongoose.Schema({
    id: String,
    degree: String,
    institution: String,
    year: String,
    gpa: String,
}, { _id: false });

const projectSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    techStack: [String],
    link: String,
}, { _id: false });

const certificationSchema = new mongoose.Schema({
    id: String,
    title: String,
    issuer: String,
    date: String,
}, { _id: false });


const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // ⭐️ Store the entire structured data object
  sections: {
    // Basic fields
    name: String,
    email: String,
    phone: String,
    location: String,
    jobTitle: String,
    summary: String,

    // Structured arrays
    skills: [String],
    experience: [experienceSchema], // ⭐️ Array of objects
    education: [educationSchema],   // ⭐️ Array of objects
    projects: [projectSchema],      // ⭐️ Array of objects
    certifications: [certificationSchema],
    languages: [String],
    
    // You could also add a 'rawText: String' field if you still want to store the plain text output for history/reference
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);