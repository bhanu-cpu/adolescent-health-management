const connection = require('../config/db'); // Import the MySQL connection

const HealthData = {
    // Function to create a new health record
    create: (height, weight, mentalHealthScore, userId, callback) => {
        const query = 'INSERT INTO health_data (height, weight, mental_health_score, user_id) VALUES (?, ?, ?, ?)';
        connection.query(query, [height, weight, mentalHealthScore, userId], (err, result) => {
            if (err) {
                console.error("Database error: ", err); // Log the error message
                return callback(err); // Pass the error to the callback
            }
            callback(null, result); // Pass the result if there's no error
        });
    },

    // Function to get a user's health record by userId
    findByUserId: (userId, callback) => {
        const query = 'SELECT * FROM health_data WHERE user_id = ?';
        connection.query(query, [userId], callback);
    },

    // Function to update the health record (e.g., updating weight or height)
    update: (userId, height, weight, mentalHealthScore, callback) => {
        const query = 'UPDATE health_data SET height = ?, weight = ?, mental_health_score = ? WHERE user_id = ?';
        connection.query(query, [height, weight, mentalHealthScore, userId], (err, result) => {
            if (err) {
                console.error("Database error: ", err); // Log the error message
                return callback(err); // Pass the error to the callback
            }
            callback(null, result); // Pass the result if there's no error
        });
    }
};

module.exports = HealthData; // Export the HealthData model
