const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error("Token verification error:", err.message);
            return res.sendStatus(403); // Forbidden if token is invalid
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;