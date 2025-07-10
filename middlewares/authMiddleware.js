const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeToken;
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
