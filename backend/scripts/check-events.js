require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('../models/Event');

const checkDatabase = async () => {
    try {
        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully!');

        const count = await Event.countDocuments();
        console.log(`\n========================================`);
        console.log(`Total Events in Database: ${count}`);
        console.log(`========================================\n`);

        const events = await Event.find().sort({ createdAt: -1 });
        events.forEach((event, index) => {
            console.log(`[Event #${index + 1}]`);
            console.log(`ID:        ${event._id}`);
            console.log(`Title:     ${event.title}`);
            console.log(`Type:      ${event.type}`);
            console.log(`Mode:      ${event.mode} (${event.platformOrLocation})`);
            console.log(`Category:  ${event.category || 'N/A'}`);
            console.log(`Date/Time: ${event.date} at ${event.time}`);
            console.log(`----------------------------------------`);
        });

    } catch (error) {
        console.error('Error querying database:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB.');
    }
};

checkDatabase();
