const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        console.log('Fetching user data for ID:', req.user._id);
        
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            console.log('User not found for ID:', req.user._id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found:', user.name);
        res.json(user);
    } catch (err) {
        console.error('Error in /me endpoint:', err);
        res.status(500).json({ 
            message: 'Error fetching user data',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

module.exports = router; 