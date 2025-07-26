const AppliedJob = require('../models/AppliedJob');

// Create
exports.createAppliedJob = async (req, res) => {
  try {
    const { jobTitle, company, status, notes } = req.body;
    const newJob = await AppliedJob.create({
      user: req.user.id,
      jobTitle,
      company,
      status,
      notes
    });
    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ msg: 'Error adding job', error: err.message });
  }
};

// Get all for user
exports.getUserAppliedJobs = async (req, res) => {
  try {
    const jobs = await AppliedJob.find({ user: req.user.id }).sort({ appliedAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching jobs', error: err.message });
  }
};

// Update status or notes
exports.updateAppliedJob = async (req, res) => {
  try {
    const job = await AppliedJob.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: 'Error updating job', error: err.message });
  }
};

// Delete
exports.deleteAppliedJob = async (req, res) => {
  try {
    const job = await AppliedJob.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json({ msg: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Error deleting job', error: err.message });
  }
};
