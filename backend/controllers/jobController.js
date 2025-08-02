const Job = require("../models/Job");

// Get all jobs for the logged-in user
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ message: "Jobs fetched", jobs });
  } catch (error) {
    res.status(500).json({ error: "Error fetching jobs", details: error.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: "Error fetching job", details: error.message });
  }
};

// Add a new job
exports.addJob = async (req, res) => {
  try {
    const newJob = new Job({
      ...req.body,
      user: req.user.id,
    });
    const savedJob = await newJob.save();
    res.status(201).json({ message: "Job added", job: savedJob });
  } catch (error) {
    res.status(400).json({ error: "Error adding job", details: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ message: "Job updated", job: updatedJob });
  } catch (error) {
    res.status(400).json({ error: "Error updating job", details: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deletedJob) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ message: "Job deleted", job: deletedJob });
  } catch (error) {
    res.status(500).json({ error: "Error deleting job", details: error.message });
  }
};