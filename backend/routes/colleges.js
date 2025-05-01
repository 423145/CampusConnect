const express = require('express');
const router = express.Router();
const College = require('../models/College');

// GET /api/colleges/popular
router.get('/popular', async (req, res) => {
    try {
        // Get popular colleges (sorted by number of students and questions)
        const popularColleges = await College.find()
            .sort({ students: -1, questions: -1 })
            .limit(6);

        if (!popularColleges || popularColleges.length === 0) {
            return res.status(200).json([]);
        }

        res.json(popularColleges);
    } catch (error) {
        console.error('Error fetching popular colleges:', error);
        res.status(500).json({ 
            message: 'Error fetching popular colleges',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/colleges
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalColleges = await College.countDocuments();
        const colleges = await College.find()
            .skip(skip)
            .limit(limit)
            .sort({ ranking: 1 });

        if (!colleges || colleges.length === 0) {
            return res.status(200).json({
                colleges: [],
                currentPage: page,
                totalPages: 0,
                totalColleges: 0
            });
        }

        res.json({
            colleges,
            currentPage: page,
            totalPages: Math.ceil(totalColleges / limit),
            totalColleges
        });
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ 
            message: 'Error fetching colleges',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/colleges/:id
router.get('/:id', async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        
        if (!college) {
            return res.status(404).json({ 
                message: 'College not found',
                error: 'COLLEGE_NOT_FOUND'
            });
        }

        res.json(college);
    } catch (error) {
        console.error('Error fetching college:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: 'Invalid college ID',
                error: 'INVALID_ID'
            });
        }
        res.status(500).json({ 
            message: 'Error fetching college details',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router; 