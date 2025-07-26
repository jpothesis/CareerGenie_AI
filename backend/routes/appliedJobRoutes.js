const express = require('express');
const router = express.Router();
const {
  createAppliedJob,
  getUserAppliedJobs,
  updateAppliedJob,
  deleteAppliedJob
} = require('../controllers/appliedJobController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createAppliedJob);
router.get('/', protect, getUserAppliedJobs);
router.put('/:id', protect, updateAppliedJob);
router.delete('/:id', protect, deleteAppliedJob);

module.exports = router;
