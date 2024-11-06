const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register User
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    User.register(name, email, password, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'User registered', userId: result.insertId });
    });
});

// Login User
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = results[0];
        if (user.password !== password) { // Note: Passwords should ideally be hashed
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user });
    });
});

module.exports = router; // Export the router
