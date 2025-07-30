const AppliedJob = require('../models/AppliedJob');

// Create Applied Job
exports.createAppliedJob = async (req, res) => {
  try {
    const { jobTitle, company, status, notes, resumeScore, interviewFeedback, source } = req.body;

    if (!jobTitle || !company) {
      return res.status(400).json({ msg: "Job title and company are required" });
    }

    const newJob = await AppliedJob.create({
      user: req.user.id,
      jobTitle,
      company,
      status,
      notes,
      resumeScore,
      interviewFeedback,
      source
    });

    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding job', error: err.message });
  }
};

// Get all Applied Jobs for User
exports.getUserAppliedJobs = async (req, res) => {
  try {
    const jobs = await AppliedJob.find({ user: req.user.id }).sort({ appliedAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching jobs', error: err.message });
  }
};

// Update Applied Job (status, notes, etc.)
exports.updateAppliedJob = async (req, res) => {
  try {
    const allowedFields = ['jobTitle', 'company', 'status', 'notes', 'resumeScore', 'interviewFeedback', 'source'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const job = await AppliedJob.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true }
    );

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating job', error: err.message });
  }
};

// Delete Applied Job
exports.deleteAppliedJob = async (req, res) => {
  try {
    const job = await AppliedJob.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    res.status(200).json({ msg: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting job', error: err.message });
  }
};
