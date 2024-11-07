const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chappidi@123',
  database: 'adolescent_health',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    process.exit(1);
  }
  console.log('Connected to the MySQL database');
});

// CRUD operations for health records

// Create health record (POST /health)
app.post('/health', (req, res) => {
  const { userId, weight, height, bmi } = req.body;

  // Insert query to add a new record to the database
  const query = 'INSERT INTO health_records (userId, weight, height, bmi) VALUES (?, ?, ?, ?)';
  
  db.query(query, [userId, weight, height, bmi], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating health record', error: err });
    }
    res.status(201).json({ message: 'Health record created', data: result });
  });
});

// Get specific health record (GET /health/:id)
app.get('/health/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM health_records WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error retrieving health record: ', err);
      return res.status(500).send({ message: 'Error retrieving health record', error: err });
    }
    if (result.length === 0) {
      return res.status(404).send({ message: 'Health record not found' });
    }
    res.status(200).send({ message: 'Health record found', data: result[0] });
  });
});

// Update health record (PUT /health/:id)
app.put('/health/:id', (req, res) => {
  const { id } = req.params;
  const { weight, height, bmi } = req.body;

  const query = 'UPDATE health_records SET weight = ?, height = ?, bmi = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  db.query(query, [weight, height, bmi, id], (err, result) => {
    if (err) {
      console.error('Error updating health record: ', err);
      return res.status(500).send({ message: 'Error updating health record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Health record not found' });
    }
    res.status(200).send({ message: 'Health record updated' });
  });
});

// Delete health record (DELETE /health/:id)
app.delete('/health/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM health_records WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting health record: ', err);
      return res.status(500).send({ message: 'Error deleting health record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Health record not found' });
    }
    res.status(200).send({ message: 'Health record deleted' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
