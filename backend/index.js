// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Core dependencies
const express = require("express");
const cors = require("cors");

// Custom modules
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appliedJobRoutes = require("./routes/appliedJobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const careerAdvisorRoutes = require("./routes/careerAdvisorRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true,
}));
app.use(express.json());

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applied-jobs", appliedJobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/career", careerAdvisorRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/profile", profileRoutes);

// Health check/test route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});