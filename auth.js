const jwt = require('jsonwebtoken');

// Generate JWT Token
function generateToken(userId) {
    return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
}

// Verify JWT Token (optional, if you want a separate verify function)
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        return decoded;
    } catch (err) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
