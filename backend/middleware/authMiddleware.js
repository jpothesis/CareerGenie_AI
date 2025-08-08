const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // 2. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user (excluding password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ msg: 'User not found' });
      }

      // 5. Attach user to request
      req.user = user;
      return next();
    } catch (err) {
      console.error("JWT verification error:", err.message);

      // Specific error messages
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token expired. Please login again.' });
      }

      return res.status(401).json({ msg: 'Invalid token. Access denied.' });
    }
  }

  // 6. No token sent
  return res.status(401).json({ msg: 'Not authorized, token missing' });
};
