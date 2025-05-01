const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT secret key - should be moved to environment variables in production
const JWT_SECRET = 'campus-connect-secret-key-2024';

// Login route
router.post('/login', async (req, res) => {
    console.log('Login request received');
    console.log('Request body:', req.body);
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        console.log('Looking for user with email:', email);
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('User found:', user._id);

        // Verify password
        console.log('Verifying password');
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('Password verified successfully');

        // Generate token
        console.log('Generating token');
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log('Token generated successfully');

        // Send response
        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

module.exports = router;
