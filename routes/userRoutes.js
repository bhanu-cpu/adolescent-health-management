// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registration route
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    User.register(name, email, password, (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ message: 'User registered', userId: result.insertId });
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.login(email, password, (err, user) => {
        if (err) return res.status(400).json({ error: err });
        res.json({ message: 'Login successful', user });
    });
});

module.exports = router;
