const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusconnect';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB:', MONGO_URI);
    // Initialize models after connection
    require('./models/User');
    require('./models/College');
    require('./models/Question');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if database connection fails
});

// JWT Secret Key
const JWT_SECRET = 'your-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

// File upload configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files from the client directory (../x)
const clientPath = path.join(__dirname, '../x');
app.use(express.static(clientPath));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/questions', require('./routes/questions'));

// Default route – serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    console.log('Request headers:', req.headers);
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        console.log('No authorization header found');
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log('Authorization header present but no token found');
        return res.status(401).json({ message: 'No token provided' });
    }

    console.log('Token received:', token.substring(0, 10) + '...'); // Log first 10 chars for security
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log('Token verified successfully');
        console.log('Decoded token:', decoded);
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Test endpoint
app.get('/api/test', async (req, res) => {
    try {
        // Test database connection
        const questions = await Question.find({}, 'title content').limit(2);
        res.json({ 
            message: 'Server is running correctly',
            database: 'Connected',
            questions: questions
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get current user
app.get('/api/users/me', verifyToken, async (req, res) => {
    try {
        console.log('Request to /api/users/me received');
        console.log('Request user ID:', req.user.id);
        
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('User not found in database for ID:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log('User found:', user.email);
        res.json({
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,
            bio: user.bio,
            college: user.college,
            major: user.major,
            graduationYear: user.graduationYear,
            avatar: user.avatar,
            interestedColleges: user.interestedColleges
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get all questions with pagination
app.get('/api/questions', async (req, res) => {
    try {
        console.log('GET /api/questions - Request received', req.query);
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
        const numPage = parseInt(page);
        const numLimit = parseInt(limit);
        const skip = (numPage - 1) * numLimit;
        
        console.log(`Fetching questions with: page=${numPage}, limit=${numLimit}, skip=${skip}, sort=${sort}, order=${order}`);

        // Get total count first
        const total = await Question.countDocuments();
        console.log(`Total questions in database: ${total}`);
        
        if (total === 0) {
            console.log('No questions found in database');
            return res.json({
                total: 0,
                questions: [],
                totalPages: 0,
                currentPage: numPage
            });
        }

        // Fetch questions with pagination
        const questions = await Question.find({})
            .populate('author', 'name avatar')
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(numLimit);

        const totalPages = Math.ceil(total / numLimit);
        console.log(`Questions fetched successfully. Total pages: ${totalPages}`);

        res.json({
            total,
            questions,
            totalPages,
            currentPage: numPage
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ 
            message: 'Server error',
            error: error.message
        });
    }
});

// Get trending questions
app.get('/api/questions/trending', async (req, res) => {
    try {
        const questions = await Question.find({})
            .populate('author', 'name avatar')
            .sort({ upvotes: -1 })
            .limit(5);
        res.json(questions);
    } catch (error) {
        console.error('Error fetching trending questions:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new question
app.post('/api/questions', verifyToken, async (req, res) => {
    try {
        console.log('GET /api/questions - Request received', req.query);
        const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
        const numPage = parseInt(page);
        const numLimit = parseInt(limit);
        const skip = (numPage - 1) * numLimit;
        
        console.log(`Fetching questions with: page=${numPage}, limit=${numLimit}, skip=${skip}, sort=${sort}, order=${order}`);

        // Get total count first
        const total = await Question.countDocuments();
        console.log(`Total questions in database: ${total}`);
        
        if (total === 0) {
            console.log('No questions found in database');
            return res.json({
                questions: [],
                totalPages: 0,
                currentPage: numPage,
                totalQuestions: 0
            });
        }

        // Fetch questions
        const questions = await Question.find()
            .populate('author', 'name avatar')
            .sort({ [sort]: order === 'desc' ? -1 : 1 })
            .skip(skip)
            .limit(numLimit);
        
        console.log(`Found ${questions.length} questions`);
        if (questions.length > 0) {
            console.log('First question:', { 
                id: questions[0]._id, 
                title: questions[0].title,
                author: questions[0].author
            });
        }
        
        // Return the response
        const response = {
            questions,
            totalPages: Math.ceil(total / numLimit),
            currentPage: numPage,
            totalQuestions: total
        };
        console.log('Sending response with questions count:', questions.length);
        res.json(response);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    console.log('Login attempt:', req.body);
    const { email } = req.body;
    
    // Find user by email
    const user = Object.values(users).find(u => u.email === email);
    
    if (!user) {
        console.log('User not found for email:', email);
        return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    console.log('Generated token for user:', user._id);
    
    res.json({
        token,
        user
    });
});

// API Routes
app.patch('/api/users/:userId', verifyToken, upload.single('avatar'), (req, res) => {
    console.log('Update request received for user:', req.params.userId);
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    
    const userId = req.params.userId;
    const user = users[userId];

    if (!user) {
        console.log('User not found in database. Available users:', Object.keys(users));
        return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    const updates = req.body;
    Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
            user[key] = updates[key];
        }
    });

    // Handle avatar upload
    if (req.file) {
        user.avatar = '/uploads/' + req.file.filename;
    }

    // Save updated user
    users[userId] = user;
    console.log('User updated successfully:', user);

    res.json(user);
});

// Get user profile
app.get('/api/users/:userId', verifyToken, (req, res) => {
    console.log('Get request received for user:', req.params.userId);
    
    const userId = req.params.userId;
    const user = users[userId];

    if (!user) {
        console.log('User not found in database. Available users:', Object.keys(users));
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Handle 404 routes
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({ message: 'Route not found' });
});

// Function to find an available port
const findAvailablePort = (startPort) => {
    return new Promise((resolve, reject) => {
        const server = require('net').createServer();
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });

        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
};

// Start server with port fallback
const startServer = async () => {
    try {
        const availablePort = await findAvailablePort(port);
        app.listen(availablePort, () => {
            console.log(`Server is running on port ${availablePort}`);
            console.log('Available users:', Object.keys(users));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Initialize server
startServer(); 