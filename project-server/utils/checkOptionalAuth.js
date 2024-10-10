const jwt = require('jsonwebtoken');

// Middleware that checks if the user is authenticated but doesn't force authentication
const checkOptionalAuthentication = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token || token === 'null' || token.trim() === '') {
        // If no valid token is provided, continue without authentication
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification error:", err.message);
            return res.status(403).json({ error: 'Invalid token' });
        }
        // Attach the user to the request object
        req.user = user;
        next();
    });
};

module.exports = checkOptionalAuthentication;