const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/campusconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Routes
const questionRoutes = require('./routes/questions');
const collegeRoutes = require('./routes/colleges');
const userRoutes = require('./routes/users');

// API routes - mount them before static files
app.use('/api/questions', questionRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/users', userRoutes);

// Static files - serve after API routes
app.use(express.static(path.join(__dirname, '../')));

// API 404 handler - only for /api routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

// All other routes - serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Don't expose stack trace in production
    const error = {
        message: err.message || 'Something went wrong!',
        status: err.status || 500
    };
    
    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }
    
    res.status(error.status).json(error);
});

const PORT = process.env.PORT || 3000;

// Kill any existing process on PORT
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api`);
}); 