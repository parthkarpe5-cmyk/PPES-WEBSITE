require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// CORS configuration - allow production frontend and local development
const allowedOrigins = [
  'https://www.prarambhapath.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like curl, Postman, or direct server-to-server calls)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS not allowed'));
  },
  credentials: true
}));

app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Public contact route (no auth) for sending email notifications
app.use('/api/contact', require('./src/routes/contactRoutes'));

// Routes
const authMiddleware = require('./src/middleware/auth');
app.use('/api/v1/doubts', authMiddleware, require('./src/routes/doubtRoutes'));
app.use('/api/v1/messages', authMiddleware, require('./src/routes/messageRoutes'));
app.use('/api/v1/upload', authMiddleware, require('./src/routes/uploadRoutes'));
app.use('/api/v1', authMiddleware, require('./src/routes/subjectRoutes'));

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Student Doubt System API' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

module.exports = app;
