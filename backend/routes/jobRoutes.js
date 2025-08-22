const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats
} = require("../controllers/jobController");

// Create a job
router.post("/", protect, createJob);

// Get all jobs (with optional ?company= & ?status= filters)
router.get("/", protect, getJobs);

// Get job stats (count by status for dashboard)
router.get("/stats", protect, getJobStats);

// Get a single job by ID
router.get("/:id", protect, getJobById);

// Update a job by ID
router.put("/:id", protect, updateJob);

// Delete a job by ID
router.delete("/:id", protect, deleteJob);

module.exports = router;
