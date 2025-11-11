const mongoose = require("mongoose");

const TurnSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    question: { type: String, required: true },
    answer: { type: String, default: "" }, // text from audio STT or typed
    feedback: { type: String, default: "" },
    score: { type: Number, min: 0, max: 10 },
    startTime: { type: Date },   // when question was asked
    endTime: { type: Date },     // when answer was submitted
    durationSec: { type: Number, min: 0 },
  },
  { _id: false }
);

const InterviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, required: true },
    seniority: { type: String, default: "junior" },
    numQuestions: { type: Number, default: 8 },
    jdText: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" },
    currentIndex: { type: Number, default: 0 },
    overallScore: { type: Number, min: 0, max: 10 },
    summary: { type: String, default: "" },
    turns: { type: [TurnSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", InterviewSessionSchema);
