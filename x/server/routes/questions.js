const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// Get all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find()
            .sort({ createdAt: -1 })
            .populate('collegeId', 'name')
            .populate('userId', 'name avatar');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get questions by college
router.get('/college/:collegeId', async (req, res) => {
    try {
        const questions = await Question.find({ collegeId: req.params.collegeId })
            .sort({ createdAt: -1 })
            .populate('collegeId', 'name')
            .populate('userId', 'name avatar');
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific question
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('collegeId', 'name')
            .populate('userId', 'name avatar')
            .populate({
                path: 'answers',
                populate: { path: 'userId', select: 'name avatar' }
            });
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Increment view count
        question.views += 1;
        await question.save();

        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new question
router.post('/', auth, async (req, res) => {
    try {
        console.log('Received question data:', req.body);
        console.log('User data:', req.user);

        const { title, content, tags, collegeId } = req.body;

        // Validate required fields
        if (!title || !content || !tags) {
            return res.status(400).json({ message: 'Title, content, and tags are required' });
        }

        // Create the question
        const question = new Question({
            title,
            content,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            collegeId: collegeId || null,
            userId: req.user._id,
            userName: req.user.name,
            userRole: req.user.role
        });

        // Save the question
        const newQuestion = await question.save();
        
        // Populate the references
        const populatedQuestion = await Question.findById(newQuestion._id)
            .populate('collegeId', 'name')
            .populate('userId', 'name avatar');

        console.log('Question created and populated:', populatedQuestion);
        
        res.status(201).json(populatedQuestion);
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update a question
router.patch('/:id', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is the author of the question
        if (question.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this question' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (key !== '_id' && key !== 'userId' && key !== 'createdAt') {
                question[key] = updates[key];
            }
        });

        const updatedQuestion = await question.save();
        await updatedQuestion.populate('collegeId', 'name').populate('userId', 'name avatar').execPopulate();
        
        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a question
router.delete('/:id', auth, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Check if user is the author of the question or an admin
        if (question.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this question' });
        }

        await question.remove();
        res.json({ message: 'Question deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router; 