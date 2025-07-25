exports.getResumeData = (req, res) => {
    res.status(200).json({
      message: "Resume Builder data",
      userId: req.user.id,
      sections: [],
    });
  };
  