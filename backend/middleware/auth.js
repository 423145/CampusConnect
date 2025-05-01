const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ 
                message: 'Please authenticate',
                error: 'No Authorization header'
            });
        }

        // Extract token whether it has 'Bearer ' prefix or not
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.replace('Bearer ', '')
            : authHeader;

        if (!token) {
            console.log('No token found in Authorization header');
            return res.status(401).json({ 
                message: 'Please authenticate',
                error: 'No token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
            console.log('Decoded token:', decoded);

            if (!decoded.userId) {
                console.log('No userId in decoded token');
                return res.status(401).json({ 
                    message: 'Invalid token',
                    error: 'No userId in token'
                });
            }

            // Find user
            const user = await User.findById(decoded.userId);
            console.log('Found user:', user ? user.email : 'not found');
            
            if (!user) {
                console.log('User not found for ID:', decoded.userId);
                return res.status(401).json({ 
                    message: 'Please authenticate',
                    error: 'User not found'
                });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ 
                message: 'Please authenticate',
                error: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ 
            message: 'Authentication error',
            error: error.message 
        });
    }
};

module.exports = auth; 