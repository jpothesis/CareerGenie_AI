// This is the entry point for the backend server
// Load environment variables
const dotenv = require('dotenv');         //define dotenv
dotenv.config();  
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

// Import necessary modules
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const appliedJobRoutes = require('./routes/appliedJobRoutes');
const resumeRoutes = require("./routes/resumeRoutes");

// Initialize express app
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', //frontend port
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// User routes
app.use('/api/user', userRoutes);
app.use('/api/applied-jobs', appliedJobRoutes);
app.use("/api/resume", resumeRoutes);

// Dashboard routes
app.use("/api/jobs", require("./routes/jobRoutes"));
// app.use("/api/assistant", require("./routes/assistantRoutes"));
app.use("/api/resume-builder", require("./routes/resumeRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// Error handling middleware
app.use(errorHandler);

// Default route
app.get('/api/test', (req, res) => {
  res.send('API is working');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
