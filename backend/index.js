// This is the entry point for the backend server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const appliedJobRoutes = require('./routes/appliedJobRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// User routes
app.use('/api/user', userRoutes);
app.use('/api/applied-jobs', appliedJobRoutes);

// Dashboard routes
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/assistant", require("./routes/assistantRoutes"));
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
