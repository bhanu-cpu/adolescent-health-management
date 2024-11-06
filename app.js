// app.js
const express = require('express');
const app = express();
const healthRoutes = require('./routes/healthRoutes'); // Import the healthRoutes

// Middleware to parse JSON data from incoming requests
app.use(express.json());

// Use the health routes for all `/api/health` paths
app.use('/api/health', healthRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
