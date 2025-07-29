//2. Kick-out inactive users after a certain time

// authenticateToken.js
const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Access Denied' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token Expired or Invalid' });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
