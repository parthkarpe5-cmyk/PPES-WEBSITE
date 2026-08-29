// Vercel serverless handler
// This file exports the Express app to be used as a Vercel function

const app = require('../app');

// Export the Express app for Vercel serverless environment
module.exports = app;
