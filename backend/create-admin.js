require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my_database');
        console.log('Connected to MongoDB');

        const name = "Super Admin";
        const email = "superadmin@ppes.edu";
        const userId = "super_admin_01";
        const password = "password123";

        const hashedPassword = await bcrypt.hash(password, 12);
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Admin already exists with this email.');
            process.exit(0);
        }

        const admin = new User({
            userId,
            usn: 'ADMIN-999',
            name,
            email,
            role: 'admin',
            password: hashedPassword
        });

        await admin.save();
        console.log('-----------------------------------');
        console.log('Admin Created Successfully!');
        console.log(`UserID: ${userId}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');
        
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
