const express = require('express');
const router = express.Router();
const College = require('../models/College');
const auth = require('../middleware/auth');

// Get all colleges
router.get('/', async (req, res) => {
    try {
        const colleges = await College.find().sort('name');
        res.json(colleges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific college
router.get('/:id', async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json(college);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 