const getMe = (req, res) => {
    res.status(200).json(req.user); // `req.user` is set in authMiddleware
  };
  
  module.exports = { getMe };
  