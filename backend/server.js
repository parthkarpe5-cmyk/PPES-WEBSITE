// Local development server
// For local development with npm run dev
// For Vercel deployment, see api/index.js and vercel.json

const app = require('./app');

const PORT = process.env.PORT || 5000;

// Start server (local development only)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
