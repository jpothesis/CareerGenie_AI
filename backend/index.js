// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// Core dependencies
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite default port
  credentials: true,
}));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing x-www-form-urlencoded
app.use(cookieParser()); // for parsing cookies if needed

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/applied-jobs", appliedJobRoutes);
app.use("/api/resume", resumeRoutes); // ResumeBuilder page integration
app.use("/api/jobs", jobRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/career", careerAdvisorRoutes);

// Health Check
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is working ✅" });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
