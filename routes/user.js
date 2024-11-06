const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path is correct

// Registration route
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    User.register(name, email, password, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered", userId: result.insertId });
    });
});

module.exports = router;
