exports.getJobs = (req, res) => {
    res.status(200).json({
      message: "Jobs fetched",
      userId: req.user.id,
      jobs: [],
    });
  };