require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doubt = require('../models/Doubt');
const Message = require('../models/Message');
const Subject = require('../models/Subject');

const MONGODB_URI = process.env.MONGODB_URI;

async function reset() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // 1. Wipe Collections
        console.log('Wiping Doubts and Messages...');
        await Doubt.deleteMany({});
        await Message.deleteMany({});
        
        console.log('Wiping Users and Subjects...');
        await User.deleteMany({});
        await Subject.deleteMany({});

        // 2. Seed Users
        const hashedPassword = await bcrypt.hash('password123', 12);
        const testUsers = [
            { userId: 'admin_01', usn: 'ADMIN-001', name: 'Parth Karpe', email: 'admin@ppes.edu', role: 'admin', password: hashedPassword },
            { userId: 'faculty_01', usn: 'FAC-102', name: 'Dr. Smith', email: 'smith@ppes.edu', role: 'faculty', password: hashedPassword },
            { userId: 'faculty_02', usn: 'FAC-103', name: 'Dr. Brown', email: 'brown@ppes.edu', role: 'faculty', password: hashedPassword },
            { userId: 'student_01', usn: '1PP23CS045', name: 'Aryan Verma', email: 'aryan@student.edu', role: 'student', password: hashedPassword, grade: 'Class 10' },
            { userId: 'student_02', usn: '1PP23IS012', name: 'Aditi Sharma', email: 'aditi@student.edu', role: 'student', password: hashedPassword, grade: 'Class 9' },
            { userId: 'dev_admin_user', usn: 'DEV-999', name: 'Development Admin', email: 'dev@ppes.edu', role: 'admin', password: hashedPassword }
        ];

        console.log('Seeding Users...');
        await User.insertMany(testUsers);

        // 3. Seed Subjects
        const subjects = [
            { name: 'Physics', code: 'PHY101', description: 'Classical and Modern Physics', facultyIds: ['faculty_01'] },
            { name: 'Mathematics', code: 'MAT101', description: 'Calculus and Linear Algebra', facultyIds: ['faculty_01', 'faculty_02'] },
            { name: 'Chemistry', code: 'CHE101', description: 'Organic and Inorganic Chemistry', facultyIds: ['faculty_02'] },
            { name: 'Computer Science', code: 'CS101', description: 'Data Structures and Algorithms', facultyIds: ['faculty_01'] },
            { name: 'Biology', code: 'BIO101', description: 'Study of Living Organisms', facultyIds: ['faculty_02'] },
            { name: 'English', code: 'ENG101', description: 'Literature and Communication', facultyIds: ['faculty_02'] },
            { name: 'Economics', code: 'ECO101', description: 'Principles of Economics', facultyIds: ['faculty_01'] }
        ];

        console.log('Seeding Subjects...');
        await Subject.insertMany(subjects);

        console.log('DONE! Database has been reset and seeded.');
        process.exit(0);
    } catch (err) {
        console.error('Reset failed:', err);
        process.exit(1);
    }
}

reset();
