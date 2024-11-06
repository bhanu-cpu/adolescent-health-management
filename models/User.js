// models/User.js
const bcrypt = require('bcrypt');
const connection = require('../config/db'); // Import database connection

const User = {
    // Register user function
    register: (name, email, password, callback) => {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        connection.query(query, [name, email, hashedPassword], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    // Login user function
    login: (email, password, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], (err, results) => {
            if (err || results.length === 0) return callback(err || "User not found");

            const user = results[0];
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) return callback("Password incorrect");

            callback(null, user);
        });
    },

    // Find a user by email function
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        connection.query(query, [email], callback);
    }
};

module.exports = User;
