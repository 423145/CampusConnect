const jwt = require('jsonwebtoken');

const JWT_SECRET = 'campus-connect-secret-key-2024'; // Use this same key when generating tokens

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        // Verify token format
        if (!authHeader.startsWith('Bearer ')) {
            console.log('Invalid token format');
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const token = authHeader.replace('Bearer ', '');
        
        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            console.log('Token verified successfully for user:', decoded._id);
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Token is invalid' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error in authentication' });
    }
};

module.exports = auth; 