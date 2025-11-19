// This file defines the routes for user authentication in an Express application.
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { getMe } = require('../controllers/userController');
const { protect }  = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getMe);

module.exports = router;
