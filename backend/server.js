require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my_database';

// mongoose.connect(MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB Atlas'))
//     .catch((err) => console.error('MongoDB connection error:', err));

// Serve uploaded files statically
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

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

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
