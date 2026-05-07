require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { StreamClient } = require('@stream-io/node-sdk');
const Session = require('./models/Session');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Doubt = require('./models/Doubt');
const Message = require('./models/Message');
const doubtRoutes = require('./routes/doubtRoutes');
const messageRoutes = require('./routes/messageRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const Subject = require('./models/Subject');
const nodemailer = require('nodemailer');
const courseRoutes = require('./routes/courseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const materialRoutes = require('./routes/materialRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email Transporter Error:', error.message);
    } else {
        console.log('Email Server is ready to send messages');
    }
});

const sendUSNMail = async (userEmail, userName, usn) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'PPES Classroom - Your USN Information',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #0ea5e9;">Welcome, ${userName}!</h2>
                    <p>Your email has been confirmed. Below is your official University Seat Number (USN) for the classroom portal:</p>
                    <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 20px; font-weight: bold; color: #1e293b; text-align: center; border: 1px solid #cbd5e1;">
                        USN: ${usn}
                    </div>
                    <p style="margin-top: 20px; color: #64748b; font-size: 12px;">This is an automated message. Please do not reply.</p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
        console.log(`USN Email sent to ${userEmail}`);
    } catch (error) {
        console.error('Failed to send USN email:', error);
    }
};

// --- SEED DATA LOGIC (Internal) ---
const seedUsers = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 12);
        const testUsers = [
            { userId: 'admin_01', usn: 'ADMIN-001', name: 'Parth Karpe', email: 'admin@ppes.edu', role: 'admin', password: hashedPassword },
            { userId: 'faculty_01', usn: 'FAC-102', name: 'Dr. Smith', email: 'smith@ppes.edu', role: 'faculty', password: hashedPassword },
            { userId: 'faculty_02', usn: 'FAC-103', name: 'Dr. Brown', email: 'brown@ppes.edu', role: 'faculty', password: hashedPassword },
            { userId: 'student_01', usn: '1PP23CS045', name: 'Aryan Verma', email: 'aryan@student.edu', role: 'student', password: hashedPassword, grade: 'Class 10' },
            { userId: 'student_02', usn: '1PP23IS012', name: 'Aditi Sharma', email: 'aditi@student.edu', role: 'student', password: hashedPassword, grade: 'Class 9' },
            { userId: 'dev_admin_user', usn: 'DEV-999', name: 'Development Admin', email: 'dev@ppes.edu', role: 'admin', password: hashedPassword }
        ];

        for (const userData of testUsers) {
            await User.findOneAndUpdate(
                { userId: userData.userId },
                userData,
                { upsert: true, new: true }
            );
        }
        console.log('Seeded/Updated initial users in MongoDB.');
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

const seedSubjects = async () => {
    try {
        const subjects = [
            { name: 'Physics', code: 'PHY101', description: 'Classical and Modern Physics', facultyIds: ['faculty_01'] },
            { name: 'Mathematics', code: 'MAT101', description: 'Calculus and Linear Algebra', facultyIds: ['faculty_01', 'faculty_02'] },
            { name: 'Chemistry', code: 'CHE101', description: 'Organic and Inorganic Chemistry', facultyIds: ['faculty_02'] },
            { name: 'Computer Science', code: 'CS101', description: 'Data Structures and Algorithms', facultyIds: ['faculty_01'] },
            { name: 'Biology', code: 'BIO101', description: 'Study of Living Organisms', facultyIds: ['faculty_02'] },
            { name: 'English', code: 'ENG101', description: 'Literature and Communication', facultyIds: ['faculty_02'] },
            { name: 'Economics', code: 'ECO101', description: 'Principles of Economics', facultyIds: ['faculty_01'] }
        ];

        for (const sub of subjects) {
            await Subject.findOneAndUpdate(
                { code: sub.code },
                sub,
                { upsert: true, new: true }
            );
        }
        console.log('Seeded/Updated subjects in MongoDB.');
    } catch (err) {
        console.error('Subject seeding error:', err);
    }
};

// Stream Client Setup
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

let streamClient;
if (apiKey && apiSecret) {
    streamClient = new StreamClient(apiKey, apiSecret);
} else {
    console.warn('STREAM_API_KEY or STREAM_API_SECRET is missing. Live sessions will not work.');
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI is not defined in .env');
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/my_database')
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));

// --- API Routes ---

// 0. Log Attendance Entry
app.post('/api/attendance/log', async (req, res) => {
    try {
        const { userId, userName, classId, role } = req.body;

        const newEntry = new Attendance({
            userId,
            userName,
            classId,
            role
        });

        await newEntry.save();
        res.status(201).json({ message: 'Attendance logged' });
    } catch (error) {
        console.error('Error logging attendance:', error);
        res.status(500).json({ error: 'Failed to log attendance' });
    }
});

// 0.1 Get Aggregated Attendance Records
app.get('/api/attendance', async (req, res) => {
    try {
        const aggregatedRecords = await Attendance.aggregate([
            {
                $group: {
                    _id: { userId: "$userId", classId: "$classId" },
                    userName: { $first: "$userName" },
                    role: { $first: "$role" },
                    sessions: {
                        $push: {
                            entryTime: "$entryTime",
                            exitTime: "$exitTime"
                        }
                    },
                    totalDurationMs: {
                        $sum: {
                            $cond: [
                                { $and: [{ $gt: ["$exitTime", null] }, { $gt: ["$entryTime", null] }] },
                                { $subtract: ["$exitTime", "$entryTime"] },
                                0
                            ]
                        }
                    },
                    lastSeen: { $max: "$entryTime" },
                    sessionCount: { $sum: 1 },
                    isInClass: {
                        $max: {
                            $cond: [{ $eq: ["$exitTime", null] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { lastSeen: -1 } }
        ]);
        res.json(aggregatedRecords);
    } catch (error) {
        console.error('Error fetching aggregated attendance:', error);
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

// 0.2 Log Attendance Exit
app.patch('/api/attendance/exit', async (req, res) => {
    try {
        const { userId, classId } = req.body;

        // Find the most recent entry for this user in this class that hasn't exited yet
        const record = await Attendance.findOneAndUpdate(
            { userId, classId, exitTime: { $exists: false } },
            { exitTime: new Date() },
            { sort: { entryTime: -1 }, new: true }
        );

        res.json({ message: 'Exit logged', record });
    } catch (error) {
        console.error('Error logging exit:', error);
        res.status(500).json({ error: 'Failed to log exit' });
    }
});

// 0.2 Authenticated Login & Email Confirmation
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user by Email OR UserID and check Role
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { userId: email },
                { usn: email }
            ],
            role
        });

        // Strict validation: User must exist AND password must match
        const isMatch = user ? await bcrypt.compare(password || 'password123', user.password) : false;

        if (!user || !isMatch) {
            return res.status(401).json({ error: 'Invalid credentials or role' });
        }

        // Trigger the USN Email (Confirmation) for students ONLY ONCE
        if (user.role === 'student' && user.email && !user.isEmailSent) {
            await sendUSNMail(user.email, user.name, user.usn);
            // Mark as sent so they don't get it again on next login
            user.isEmailSent = true;
            await user.save();
            console.log(`USN Email sent and marked for user: ${user.userId}`);
        }

        res.json({
            success: true,
            user: {
                id: user.userId,
                name: user.name,
                role: user.role,
                usn: user.usn
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 1. Generate Token for Video Call
app.post('/api/live/token', (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    if (!streamClient) return res.status(500).json({ error: 'Stream client not initialized' });

    try {
        const validity = 60 * 60; // 1 hour
        const token = streamClient.generateUserToken({ user_id: userId, validity_in_seconds: validity });
        res.json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
    }
});

// 3. Get All Live Sessions
app.get('/api/live/sessions', async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// 2. Create a Live Session (Faculty only - simplified)
app.post('/api/live/sessions', async (req, res) => {
    const { title, description, facultyId, meetingId } = req.body;

    try {
        const newSession = new Session({
            title,
            description,
            facultyId,
            meetingId,
            status: 'scheduled'
        });
        await newSession.save();
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ error: 'Error creating session', details: error.message });
    }
});

// 4. Get All Users (MongoDB)
app.get('/api/users', async (req, res) => {
    try {
        await seedUsers(); // Ensure data exists
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users from MongoDB:', error);
        res.json([]);
    }
});

// Doubts & Payment System Routes
app.use('/api/v1/doubts', doubtRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/materials', materialRoutes);

// Basic route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Doubts Supplemental APIs
app.get('/api/v1/subjects', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.json({ success: true, data: subjects });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/v1/teachers', async (req, res) => {
    try {
        const teachers = await User.find({ role: 'faculty' });
        res.json({ success: true, data: teachers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    seedUsers();
    seedSubjects();
    console.log(`Server running on port ${PORT}`);
});
