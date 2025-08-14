const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
  getJobById,
} = require("../controllers/jobController");

// Get all jobs
router.get("/", protect, getJobs);

// Get a single job by ID
router.get("/:id", protect, getJobById);

// Add a new job
router.post("/", protect, addJob);

// Update a job
router.put("/:id", protect, updateJob);

// Delete a job
router.delete("/:id", protect, deleteJob);

module.exports = router;
