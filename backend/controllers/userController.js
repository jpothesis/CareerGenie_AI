const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
    res.status(200).json({user : req.user}); // `req.user` is set in authMiddleware
  };
  
  module.exports = { getMe };
  