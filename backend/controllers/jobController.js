const Job = require('../models/AppliedJob');

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ dateMatched: -1 });
    res.status(200).json({ message: "Jobs fetched", userId: req.user.id, jobs });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching jobs', details: error.message });
  }
};