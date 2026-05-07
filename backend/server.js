require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { StreamClient } = require('@stream-io/node-sdk');
const Session = require('./models/Session');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const nodemailer = require('nodemailer');

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

const sendFacultyWelcomeMail = async (userEmail, userName, userId, password) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to PPES - Faculty Account Details',
            html: `
                <div style="font-family: sans-serif; padding: 30px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; margin: auto;">
                    <h2 style="color: #0ea5e9; margin-bottom: 20px;">Welcome to the Faculty Team!</h2>
                    <p>Dear ${userName},</p>
                    <p>An administrator has created your faculty account on the PPES Classroom portal. Below are your official login credentials:</p>
                    
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #cbd5e1;">
                        <p style="margin: 0 0 10px 0;"><strong>UserID:</strong> <span style="color: #0ea5e9;">${userId}</span></p>
                        <p style="margin: 0;"><strong>Default Password:</strong> <span style="color: #0ea5e9;">${password}</span></p>
                    </div>
                    
                    <p>Please use these details to log in to the faculty portal. We recommend changing your password after your first login.</p>
                    
                    <a href="${process.env.ALLOWED_ORIGIN || 'http://localhost:3000'}/login/faculty" 
                       style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
                       Go to Faculty Login
                    </a>
                    
                    <p style="margin-top: 30px; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; pt-20px;">
                        This is an automated message from PPES Administration.
                    </p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send Faculty Welcome email:', error);
    }
};

// --- SEED DATA LOGIC (Internal) ---
const seedUsers = async () => {
    try {
        const hashedPassword = await bcrypt.hash('password123', 12);
        const testUsers = [
            { userId: 'admin_01', usn: 'ADMIN-001', name: 'Parth Karpe', email: 'admin@ppes.edu', role: 'admin', password: hashedPassword },
            { userId: 'faculty_01', usn: 'FAC-102', name: 'Dr. Smith', email: 'smith@ppes.edu', role: 'faculty', password: hashedPassword },
            { userId: 'student_01', usn: '1PP23CS045', name: 'Aryan Verma', email: 'aryan@student.edu', role: 'student', password: hashedPassword },
            { userId: 'student_02', usn: '1PP23IS012', name: 'Aditi Sharma', email: 'aditi@student.edu', role: 'student', password: hashedPassword },
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
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));
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

// 0.3 Admin: Create Faculty
app.post('/api/admin/faculty', async (req, res) => {
    try {
        const { name, email, userId, usn, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password || 'password123', 12);
        
        const newFaculty = new User({
            userId: userId || email,
            usn: usn || userId,
            name,
            email,
            role: 'faculty',
            password: hashedPassword
        });

        await newFaculty.save();
        await sendFacultyWelcomeMail(email, name, userId, password || 'password123');

        res.status(201).json({ success: true, message: 'Faculty created and email sent' });
    } catch (error) {
        console.error('Create faculty error:', error);
        res.status(500).json({ error: 'Failed to create faculty member' });
    }
});

// 0.4 Admin: Get All Faculty
app.get('/api/admin/faculty', async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty' }).sort({ createdAt: -1 });
        res.json(faculty);
    } catch (error) {
        console.error('Fetch faculty error:', error);
        res.status(500).json({ error: 'Failed to fetch faculty list' });
    }
});

// 0.5 Admin: Delete Faculty
app.delete('/api/admin/faculty/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ success: true, message: 'Faculty member removed' });
    } catch (error) {
        console.error('Delete faculty error:', error);
        res.status(500).json({ error: 'Failed to delete faculty member' });
    }
});

// 0.6 Admin: Update Faculty
app.patch('/api/admin/faculty/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, userId } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, userId },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Faculty member not found' });
        }

        res.json({ success: true, message: 'Faculty member updated', user: updatedUser });
    } catch (error) {
        console.error('Update faculty error:', error);
        res.status(500).json({ error: 'Failed to update faculty member' });
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
        res.status(500).json({ error: 'Failed to generate stream token' });
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
    const { title, description, facultyId, meetingId, status } = req.body;

    try {
        const allowedStatuses = ['scheduled', 'live', 'ended'];
        const newSession = new Session({
            title,
            description,
            facultyId,
            meetingId,
            status: allowedStatuses.includes(status) ? status : 'scheduled'
        });
        await newSession.save();
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ error: 'Error creating session', details: error.message });
    }
});

// 5. Update Session Status (e.g., mark as ended)
app.patch('/api/live/sessions/:meetingId/status', async (req, res) => {
    const { meetingId } = req.params;
    const { status } = req.body;
    const allowedStatuses = ['scheduled', 'live', 'ended'];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const session = await Session.findOneAndUpdate(
            { meetingId },
            { status },
            { new: true }
        );
        if (!session) return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Error updating session status', details: error.message });
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

// Basic route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Start server
app.listen(PORT, () => {
    seedUsers();
    console.log(`Server running on port ${PORT}`);
});
