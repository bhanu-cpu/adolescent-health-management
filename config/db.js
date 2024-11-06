// Import the required modules
require('dotenv').config(); // Load environment variables from the .env file
const mysql = require('mysql2'); // Use mysql2 package

// Create a MySQL connection using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST, // Fetch from .env file
    user: process.env.DB_USER, // Fetch from .env file
    password: process.env.DB_PASSWORD, // Fetch from .env file
    database: process.env.DB_NAME // Fetch from .env file
});

// Establish the MySQL connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Export the connection for use in other files
module.exports = connection;
