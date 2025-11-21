// authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path to your User model

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find user and attach to request object
      // decoded.id is the ID stored in the JWT payload
      req.user = await User.findById(decoded.id).select('-password');

      // Crucial: Check if the user was actually found in the database
      if (!req.user) {
        // If token is valid but user was deleted
        console.error('User not found for token ID:', decoded.id);
        return res.status(401).json({ msg: 'Not authorized, user not found' });
      }
      
      // ✅ SUCCESS: Log the user ID to confirm authentication works
      // This is a great debug line to leave in while testing
      console.log(`[PROTECT] Request authenticated for User ID: ${req.user._id}`); 

      // 4. Continue to the next middleware/route handler
      next();

    } catch (error) {
      // Handle JWT-specific errors (Expired, Invalid Signature)
      console.error("JWT Error:", error);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expired. Please log in again.' });
      }
      // General JWT verification failure
      return res.status(401).json({ msg: 'Not authorized, token failed or invalid' });
    }
  } else {
    // No token found in headers
    return res.status(401).json({ msg: 'Not authorized, no token provided' });
  }
};