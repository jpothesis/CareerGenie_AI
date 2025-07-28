const express = require('express');
const router = express.Router();
const {
  createAppliedJob,
  getUserAppliedJobs,
  updateAppliedJob,
  deleteAppliedJob
} = require('../controllers/appliedJobController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createAppliedJob);      // Create a new applied job
router.get('/', protect, getUserAppliedJobs);     // Get all applied jobs for user
router.put('/:id', protect, updateAppliedJob);    // Update status/notes/etc.
router.delete('/:id', protect, deleteAppliedJob); // Delete a job

module.exports = router;
