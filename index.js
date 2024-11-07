const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

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

// JWT Secret key (make sure to replace this with a more secure key)
const JWT_SECRET = 'your_secret_key'; 

// Function to generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

// Function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Middleware to authenticate routes using JWT
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  req.user = decoded; // Attach the decoded user information to the request
  next();
}

// POST /login - User login (Generate a JWT token)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Sample authentication (use a real method here)
  if (username === 'testuser' && password === 'password123') {
    const token = generateToken(1); // Example user ID
    return res.status(200).json({ message: 'Login successful', token });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
});

// POST /health - Create a new health record with validation
app.post('/health', [
  // Validation rules
  body('userId').isInt().withMessage('User ID must be an integer'),
  body('weight').isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('height').isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('bmi').isFloat({ min: 0 }).withMessage('BMI must be a positive number')
], authenticateToken, (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract validated data
  const { userId, weight, height, bmi } = req.body;
  const query = 'INSERT INTO health_records (userId, weight, height, bmi) VALUES (?, ?, ?, ?)';

  db.query(query, [userId, weight, height, bmi], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating health record', error: err });
    }
    res.status(201).json({ message: 'Health record created', data: { id: result.insertId, userId, weight, height, bmi } });
  });
});

// PUT /health/:id - Update a health record with validation
app.put('/health/:id', [
  // Validation rules
  body('weight').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
  body('height').optional().isFloat({ min: 0 }).withMessage('Height must be a positive number'),
  body('bmi').optional().isFloat({ min: 0 }).withMessage('BMI must be a positive number')
], authenticateToken, (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract validated data
  const { id } = req.params;
  const { weight, height, bmi } = req.body;
  const query = 'UPDATE health_records SET weight = ?, height = ?, bmi = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

  db.query(query, [weight, height, bmi, id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating health record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    res.status(200).json({ message: 'Health record updated' });
  });
});

// GET /health/:id - Retrieve a specific health record
app.get('/health/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM health_records WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving health record', error: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    res.status(200).json({ data: result[0] });
  });
});

// DELETE /health/:id - Delete a health record
app.delete('/health/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM health_records WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting health record', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Health record not found' });
    }
    res.status(200).json({ message: 'Health record deleted' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
