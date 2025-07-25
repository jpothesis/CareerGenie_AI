exports.getAssistantData = (req, res) => {
    res.status(200).json({
      message: "Assistant endpoint hit",
      userId: req.user.id,
      response: [],
    });
  };
  