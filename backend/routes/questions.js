const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

// GET /api/questions
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
        const numPage = parseInt(page);
        const numLimit = parseInt(limit);
        const skip = (numPage - 1) * numLimit;

        // Get total count
        const totalQuestions = await Question.countDocuments();
        if (totalQuestions === 0) {
            return res.json({
                questions: [],
                totalPages: 0,
                currentPage: numPage,
                totalQuestions: 0
            });
        }

        // Fetch questions with sorting and pagination
        const questions = await Question.find()
            .populate('author', 'name avatar')
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(numLimit);

        const totalPages = Math.ceil(totalQuestions / numLimit);
        res.json({
            questions,
            totalPages,
            currentPage: numPage,
            totalQuestions
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
});

// GET /api/questions/trending
router.get('/trending', async (req, res) => {
    try {
        // Get trending questions (sorted by views and upvotes)
        const trendingQuestions = await Question.find()
            .sort({ views: -1, upvotes: -1 })
            .limit(6)
            .populate('author', 'fullName email role');

        if (!trendingQuestions || trendingQuestions.length === 0) {
            return res.status(200).json([]);
        }

        // Transform the data to match frontend expectations
        const transformedQuestions = trendingQuestions.map(q => ({
            id: q._id,
            title: q.title,
            content: q.content,
            tags: q.tags,
            views: q.views,
            upvotes: q.upvotes,
            answers: q.answers,
            createdAt: q.createdAt,
            userName: q.author ? q.author.fullName : 'Unknown',
            userRole: q.author ? (q.author.role || 'student') : 'student',
            userId: q.author ? q.author._id : null
        }));

        res.json(transformedQuestions);
    } catch (error) {
        console.error('Error fetching trending questions:', error);
        res.status(500).json({ 
            message: 'Error fetching trending questions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/questions/user
router.get('/user', async (req, res) => {
    try {
        const { userId, email } = req.query;

        if (!userId && !email) {
            return res.status(400).json({ 
                message: 'Either userId or email is required',
                error: 'MISSING_PARAMETERS'
            });
        }

        // Build query based on provided parameters
        const query = {};
        if (userId) query.author = userId;
        if (email) query['author.email'] = email;

        // Get questions by user
        const questions = await Question.find(query)
            .sort({ createdAt: -1 })
            .populate('author', 'fullName email role');

        if (!questions || questions.length === 0) {
            return res.status(200).json([]);
        }

        // Transform the data to match frontend expectations
        const transformedQuestions = questions.map(q => ({
            id: q._id,
            title: q.title,
            content: q.content,
            tags: q.tags,
            views: q.views,
            upvotes: q.upvotes,
            answers: q.answers,
            createdAt: q.createdAt,
            userName: q.author ? q.author.fullName : 'Unknown',
            userRole: q.author ? (q.author.role || 'student') : 'student',
            userId: q.author ? q.author._id : null
        }));

        res.json(transformedQuestions);
    } catch (error) {
        console.error('Error fetching user questions:', error);
        res.status(500).json({ 
            message: 'Error fetching user questions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/questions
router.post('/', async (req, res) => {
    try {
        const { title, content, tags, college } = req.body;
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

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const question = new Question({
            title,
            content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            college,
            author
        });

        const savedQuestion = await question.save();
        await savedQuestion.populate('author', 'name avatar');
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Error creating question', error: error.message });
    }
});

module.exports = router; 