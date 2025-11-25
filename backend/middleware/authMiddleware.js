// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // [DEBUG] Check what we received
      console.log("1. Token Received:", token.substring(0, 10) + "..."); 

      // [DEBUG] Check if Secret exists
      if (!process.env.JWT_SECRET) {
         console.error("CRITICAL: JWT_SECRET is missing in Environment Variables!");
         return res.status(500).json({ msg: "Server Error: Auth Configuration Missing" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("2. Token Decoded. User ID:", decoded.id);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error("3. FAILURE: Token valid, but User ID not found in DB.");
        console.error("   This happens if you are using a Local Token on a Live DB.");
        return res.status(401).json({ msg: 'Not authorized, user not found' });
      }

      console.log("4. SUCCESS: User found:", req.user.email);
      next();

    } catch (error) {
      console.error("AUTH ERROR:", error.name, error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Invalid Token Signature (Check JWT_SECRET)' });
      }
      
      return res.status(401).json({ msg: 'Not authorized' });
    }
  } else {
    console.log("No Token provided in headers");
    return res.status(401).json({ msg: 'Not authorized, no token' });
  }
};