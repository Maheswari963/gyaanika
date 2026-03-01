const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "gyaanika-super-secret-key-2026";

exports.authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: "error", message: "Access Denied: No Token Provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ status: "error", message: "Access Denied: Invalid Token" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ status: "error", message: "Access Denied: Insufficient Permissions" });
        }

        req.user = user;
        next();
    });
};

exports.signToken = (userPayload) => {
    return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '2h' });
};
