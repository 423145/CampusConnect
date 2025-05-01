const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');
const Report = require('../models/Report');

// POST /api/answers/:id/comments - Add a comment to an answer
router.post('/:id/comments', async (req, res) => {
    try {
        const { content } = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.replace('Bearer ', '');
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const author = decoded.userId;
        const answerId = req.params.id;
        if (!content || !answerId) {
            return res.status(400).json({ message: 'Content and answer ID are required' });
        }
        // Ensure the answer exists
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        const comment = new Comment({
            parentType: 'Answer',
            parentId: answerId,
            content,
            author
        });
        const savedComment = await comment.save();
        await savedComment.populate('author', 'name avatar');
        res.status(201).json(savedComment);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ message: 'Error posting comment', error: error.message });
    }
});

// GET /api/answers/:id/comments - Get all comments for an answer
router.get('/:id/comments', async (req, res) => {
    try {
        const answerId = req.params.id;
        console.log('Fetching comments for answerId:', answerId);
        const answer = await Answer.findById(answerId);
        console.log('Answer found:', answer);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        const comments = await Comment.find({ parentType: 'Answer', parentId: answerId })
            .populate('author', 'name avatar')
            .sort({ createdAt: 1 });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
});

// POST /api/answers/:id/report - Submit a report for an answer
router.post('/:id/report', async (req, res) => {
    try {
        const { reason, description } = req.body;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.replace('Bearer ', '');
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const author = decoded.userId;
        const answerId = req.params.id;
        // Ensure the answer exists
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        const report = new Report({
            parentType: 'Answer',
            parentId: answerId,
            reason,
            description,
            author
        });
        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Error submitting report', error: error.message });
    }
});

// GET /api/answers/:id/report-count - Get number of reports for an answer
router.get('/:id/report-count', async (req, res) => {
    try {
        const answerId = req.params.id;
        const count = await Report.countDocuments({ parentType: 'Answer', parentId: answerId });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching report count:', error);
        res.status(500).json({ message: 'Error fetching report count', error: error.message });
    }
});

// POST /api/answers/:id/upvote - Upvote an answer
router.post('/:id/upvote', async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findByIdAndUpdate(
            answerId,
            { $inc: { upvotes: 1 } },
            { new: true }
        );
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        res.json({ upvotes: answer.upvotes });
    } catch (error) {
        console.error('Error upvoting answer:', error);
        res.status(500).json({ message: 'Error upvoting answer', error: error.message });
    }
});

// POST /api/answers/:id/downvote - Downvote an answer
router.post('/:id/downvote', async (req, res) => {
    try {
        const answerId = req.params.id;
        const answer = await Answer.findByIdAndUpdate(
            answerId,
            { $inc: { upvotes: -1 } },
            { new: true }
        );
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        res.json({ upvotes: answer.upvotes });
    } catch (error) {
        console.error('Error downvoting answer:', error);
        res.status(500).json({ message: 'Error downvoting answer', error: error.message });
    }
});

module.exports = router; 