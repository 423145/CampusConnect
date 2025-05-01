const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

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

module.exports = router; 