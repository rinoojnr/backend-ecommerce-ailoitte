const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (role) => (req, res, next) => {
    try {
        if (req.user.role != role) {
            return res.status(403).json({ succes: false, message: 'Access denied.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: 'internal server error' });
    }
}