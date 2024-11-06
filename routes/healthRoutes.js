// routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const HealthData = require('../models/HealthData'); // Import HealthData model

// Create a new health record
router.post('/create', (req, res) => {
    const { height, weight, mentalHealthScore, userId } = req.body;

    if (!height || !weight || !mentalHealthScore || !userId) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Call the model to insert data
    HealthData.create(height, weight, mentalHealthScore, userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json({ message: "Health record created", result });
    });
});

// Get health record by userId
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    // Call the model to fetch health data for the user
    HealthData.findByUserId(userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "No health record found for this user" });
        }
        res.status(200).json(result);
    });
});

// Update a user's health record
router.put('/update/:userId', (req, res) => {
    const { userId } = req.params;
    const { height, weight, mentalHealthScore } = req.body;

    if (!height || !weight || !mentalHealthScore) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Call the model to update health data
    HealthData.update(userId, height, weight, mentalHealthScore, (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(200).json({ message: "Health record updated", result });
    });
});

module.exports = router; // Export the routes
