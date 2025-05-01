const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Get user by ID
router.get('/:userId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const user = await User.findById(req.params.userId)
                .select('-password') // Don't send password in response
                .populate('college', 'name logo')
                .populate('questions', 'title createdAt')
                .populate('answers', 'questionId createdAt');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.patch('/:userId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const updates = req.body;
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                updates,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
