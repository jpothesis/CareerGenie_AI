const logActivity = require('../utils/activityLogger');
const Job = require("../models/Job");

// Create a Job 
const createJob = async (req, res) => {
  try {
    const { title, company, description, skillsRequired, location, status, notes } = req.body;

    const job = await Job.create({
      user: req.user._id,
      title,
      company,
      description,
      skillsRequired,
      location,
      status,
      notes
    });
    
    // Log the job application activity
    await logActivity(req.user._id, 'job_apply', `Applied to ${req.body.company}`, req);

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating job" });
  }
};

//  Get Jobs (Filter by Company + Status) 
const getJobs = async (req, res) => {
  try {
    const { company, status } = req.query;
    const filter = { user: req.user._id };

    // Filter by company (case-insensitive, partial match)
    if (company) {
      filter.company = { $regex: company, $options: "i" };
    }

    // Filter by status (exact match)
    if (status) {
      filter.status = status;
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// Get Job by ID 
const getJobById = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.user._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job" });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating job" });
  }
};

// Delete Job 
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!job) {
      return res.status(404).json({ message: "Job not found or not authorized" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job" });
  }
};

// Get Job Stats (Optional for Dashboard) 
const getJobStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching job stats" });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats
};