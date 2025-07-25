exports.getAnalytics = (req, res) => {
    res.status(200).json({
      message: "Analytics data",
      userId: req.user.id,
      stats: {},
    });
  };
  