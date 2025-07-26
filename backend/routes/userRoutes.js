const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { protect }  = require('../middleware/authMiddleware');

router.get('/profile', protect, getMe); // protected route

module.exports = router;
