require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const session = require('express-session');
const path = require('path');
const auth = require('./middleware/auth');
const User = require('./models/User');
const Question = require('./models/Question');

// College Schema
const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    courses: [{ type: String }],
    stats: {
        students: { type: Number, default: 0 },
        faculty: { type: Number, default: 0 },
        rating: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now }
});

const College = mongoose.model('College', collegeSchema);

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

const app = express();

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Explicit JSON body parser configuration
app.use(express.json({ limit: '10mb', strict: false }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging middleware
app.use((req, res, next) => {
    if (req.method === 'POST' && req.path.includes('/auth/register')) {
        console.log(`${req.method} ${req.path} - Body present: ${!!req.body}`);
        console.log('Headers:', req.headers);
        console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
    }
    next();
});
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// OTP Schema
const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, expires: 600 } // OTP expires in 10 minutes
});

const OTP = mongoose.model('OTP', otpSchema);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Authentication middleware
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Auth header:', authHeader);

        if (!authHeader) {
            console.log('No Authorization header found');
            return res.status(401).json({ 
                message: 'Please authenticate',
                error: 'No Authorization header'
            });
        }

        // Extract token whether it has 'Bearer ' prefix or not
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.replace('Bearer ', '')
            : authHeader;

        console.log('Processing token:', token);
        
        if (!token) {
            console.log('No token found in Authorization header');
            return res.status(401).json({ 
                message: 'Please authenticate',
                error: 'No token provided'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
            console.log('Decoded token:', decoded);

            if (!decoded.userId) {
                console.log('No userId in decoded token');
                return res.status(401).json({ 
                    message: 'Invalid token',
                    error: 'No userId in token'
                });
            }

            const user = await User.findById(decoded.userId);
            console.log('Found user:', user ? user.email : 'not found');
            
            if (!user) {
                console.log('User not found for ID:', decoded.userId);
                return res.status(401).json({ 
                    message: 'Please authenticate',
                    error: 'User not found'
                });
            }
            
            req.user = user;
            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ 
                message: 'Please authenticate',
                error: 'Invalid token'
            });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ 
            message: 'Authentication error',
            error: error.message 
        });
    }
};

// Import routes
const questionsRouter = require('./routes/questions');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/questions', questionsRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// IMPORTANT: We're commenting out the direct endpoint since we're now using the one in auth routes
/* 
app.post('/api/auth/register', async (req, res) => {
    console.log('=== Direct Register Request Received ===');
    console.log('Request body:', req.body);
    
    try {
        // Log the request for debugging
        console.log('Request headers:', req.headers);

        // Get data from request body, with fallbacks
        const name = req.body.name || req.body.fullName || '';
        const email = req.body.email || '';
        const password = req.body.password || '';
        const role = req.body.role || req.body.userType || 'prospective';
        const interestedColleges = req.body.interestedColleges || [];
        
        console.log('Processing signup with data:', {
            name: name || 'missing',
            email: email || 'missing',
            password: password ? 'provided' : 'missing',
            role: role || 'missing'
        });
        
        // Basic validation
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            interestedColleges: Array.isArray(interestedColleges) ? interestedColleges : [],
            verified: true // Auto-verify for now
        });

        await user.save();
        console.log('User created successfully:', user.email);

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error during registration', error: error.message });
    }
});
*/

app.post('/api/signup', async (req, res) => {
    console.log('=== Signup Request Received ===');
    console.log('Request body:', req.body);
    
    try {
        console.log('Raw body keys:', Object.keys(req.body));
        console.log('Request body contents:', JSON.stringify(req.body, null, 2));
        
        // Extract fields explicitly
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        
        console.log('Extracted fields for validation:')
        console.log('- name:', name, typeof name);
        console.log('- email:', email, typeof email);
        console.log('- password present:', !!password, typeof password);
        console.log('- role:', role, typeof role);

        // Validate required fields
        if (!name || !email || !password || !role) {
            console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
            return res.status(400).json({ msg: 'All fields are required' });
        }

        // Check if user already exists
        console.log('Checking for existing user:', email);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated OTP for:', email);
        
        // Hash password
        console.log('Hashing password');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save user
        console.log('Creating new user');
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verified: false,
            ...req.body
        });

        // Save user to database
        console.log('Saving user to database');
        await user.save();

        // Save OTP
        console.log('Saving OTP');
        await new OTP({ email, otp }).save();

        // Store only email in session
        req.session.verificationEmail = email;

        // Send OTP email
        try {
            console.log('Sending verification email');
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Verify your Campus Connect account',
                html: `
                    <h1>Welcome to Campus Connect!</h1>
                    <p>Your verification code is: <strong>${otp}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                `
            });
            console.log('Verification email sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Continue with signup even if email fails
        }

        console.log('Signup successful for:', email);
        res.status(200).json({ 
            message: 'OTP sent successfully',
            email: email // Send back email for frontend storage
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error during signup process' });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    console.log('=== OTP Verification Request ===');
    console.log('Request body:', req.body);
    
    try {
        const { email, otp } = req.body;

        // Input validation
        if (!email || !otp) {
            console.log('Missing required fields:', { email: !!email, otp: !!otp });
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Verify session email
        const sessionEmail = req.session.verificationEmail;
        console.log('Session data:', { sessionEmail, requestEmail: email });
        
        if (!sessionEmail || sessionEmail !== email) {
            console.log('Session email mismatch');
            return res.status(400).json({ message: 'Invalid verification attempt. Please try signing up again.' });
        }

        console.log('Looking for OTP record...');
        // Find OTP in database
        const otpRecord = await OTP.findOne({ email, otp });
        console.log('OTP record found:', !!otpRecord);
        
        if (!otpRecord) {
            console.log('Invalid or expired OTP for email:', email);
            return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new code.' });
        }

        console.log('Looking for user...');
        // Find and update the user's verification status
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { verified: true },
            { new: true }
        );
        console.log('User found and updated:', !!updatedUser);

        if (!updatedUser) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found. Please try signing up again.' });
        }

        console.log('Deleting OTP record...');
        // Delete OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        // Clear verification email from session
        req.session.verificationEmail = null;

        console.log('Verification successful for:', email);
        res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
        console.error('Verification error details:', {
            message: error.message,
            stack: error.stack,
            error: error
        });
        res.status(500).json({ 
            message: 'Error during verification process. Please try again.',
            details: error.message
        });
    }
});

// IMPORTANT: Using login from auth.js router instead
/* app.post('/api/login', async (req, res) => {
    console.log('=== Login Request Received ===');
    console.log('Request body:', req.body);
    console.log('Email:', req.body.email);
    console.log('Role:', req.body.role);
    
    try {
        const { email, password, role } = req.body;

        // Validate input
        if (!email || !password || !role) {
            console.log('Missing required fields:', { email: !!email, password: !!password, role: !!role });
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide email, password and role' 
            });
        }

        // Find user by email
        console.log('Looking for user with email:', email.toLowerCase());
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log('User found:', !!user);
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        console.log('User details:', {
            name: user.name,
            email: user.email,
            role: user.role,
            verified: user.verified
        });

        // Check if user is verified
        if (!user.verified) {
            console.log('User not verified:', email);
            return res.status(403).json({ 
                success: false, 
                message: 'Please verify your email before logging in' 
            });
        }

        // Check if role matches
        console.log('Checking role match:', { requested: role, actual: user.role });
        if (user.role !== role) {
            console.log('Role mismatch:', { requested: role, actual: user.role });
            return res.status(403).json({ 
                success: false, 
                message: `This account is registered as a ${user.role} student` 
            });
        }

        // Handle both hashed and plain text passwords during transition
        let isValidPassword = false;
        console.log('Checking password...');
        if (user.password.startsWith('$2')) {
            console.log('Password is hashed, comparing with bcrypt');
            isValidPassword = await bcrypt.compare(password, user.password);
        } else {
            console.log('Password is plain text, comparing directly');
            isValidPassword = password === user.password;
            
            if (isValidPassword) {
                console.log('Hashing password for future use');
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.updateOne({ _id: user._id }, { password: hashedPassword });
            }
        }
        
        console.log('Password valid:', isValidPassword);
        
        if (!isValidPassword) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Generate JWT token
        console.log('Generating JWT token');
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '24h' }
        );

        // Create session
        console.log('Creating session');
        req.session.userId = user._id;
        req.session.email = user.email;
        req.session.role = user.role;

        // Update last login
        console.log('Updating last login time');
        await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date()
        });
        console.log('Login successful for user:', email);

        // Send response
        const response = {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                firstName: user.name.split(' ')[0],
                lastName: user.name.split(' ').slice(1).join(' ')
            }
        };
        console.log('Sending response:', response);
        res.json(response);

    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred during login',
            error: error.message 
        });
    }
});
*/

app.get('/api/users/:userId', authMiddleware, async (req, res) => {
    console.log('=== Get User Profile Request ===');
    console.log('User ID:', req.params.userId);
    
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Add PATCH route for updating user profile
app.patch('/api/users/:userId', authMiddleware, async (req, res) => {
    console.log('=== Update User Profile Request ===');
    console.log('User ID:', req.params.userId);
    console.log('Update data:', req.body);
    
    try {
        const updates = req.body;
        console.log('Looking for user with ID:', req.params.userId);
        const user = await User.findById(req.params.userId);
        
        if (!user) {
            console.log('User not found:', req.params.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Current user data:', user.toObject());

        // Update only the fields that are provided
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                console.log(`Updating ${key} from "${user[key]}" to "${updates[key]}"`);
                user[key] = updates[key];
            }
        });

        console.log('Saving updated user data:', user.toObject());
        await user.save();
        console.log('User saved successfully');

        // Get complete user data including stats
        const stats = await getUserStats(user._id);
        const userData = {
            ...user.toObject(),
            stats
        };

        console.log('Sending response with updated user data:', userData);
        res.json(userData);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
});

app.post('/api/resend-otp', async (req, res) => {
    console.log('=== Resend OTP Request ===');
    console.log('Request body:', req.body);

    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            console.log('Missing email in request');
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        console.log('Looking for user:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(404).json({ message: 'User not found. Please sign up first.' });
        }

        if (user.verified) {
            console.log('User already verified:', email);
            return res.status(400).json({ message: 'Email is already verified. Please login.' });
        }

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated new OTP for:', email);
        
        // Delete any existing OTPs for this email
        console.log('Deleting existing OTPs');
        await OTP.deleteMany({ email });

        // Save new OTP
        console.log('Saving new OTP');
        const newOTP = new OTP({ email, otp });
        await newOTP.save();

        // Send new OTP email
        try {
            console.log('Attempting to send new verification email');
            // Create a new transporter instance for each email send
            const emailTransporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await emailTransporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'New Verification Code - CampusConnect',
                html: `
                    <h1>New Verification Code</h1>
                    <p>Your new verification code is: <strong>${otp}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                `            });

            console.log('New verification email sent successfully to:', email);
            res.status(200).json({ message: 'New verification code sent successfully' });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Delete the saved OTP if email fails
            await OTP.deleteOne({ _id: newOTP._id });
            // Log detailed error information
            console.error('Email error details:', {
                code: emailError.code,
                command: emailError.command,
                response: emailError.response,
                responseCode: emailError.responseCode
            });
            throw new Error('Failed to send verification email. Please try again.');
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ 
            message: error.message || 'Error generating new verification code. Please try again.',
            details: error.message 
        });
    }
});

// College Routes
app.get('/api/colleges', async (req, res) => {
    try {
        const { search, location, course } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (course) {
            query.courses = { $regex: course, $options: 'i' };
        }

        const colleges = await College.find(query);
        res.json(colleges);
    } catch (error) {
        console.error('Error fetching colleges:', error);
        res.status(500).json({ message: 'Error fetching colleges' });
    }
});

app.get('/api/colleges/:id', async (req, res) => {
    try {
        const college = await College.findById(req.params.id);
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json(college);
    } catch (error) {
        console.error('Error fetching college:', error);
        res.status(500).json({ message: 'Error fetching college' });
    }
});

// Popular Colleges Endpoint
app.get('/api/colleges/popular', async (req, res) => {
    try {
        const popularColleges = await College.find()
            .sort({ rating: -1, reviews: -1 })
            .limit(6);
        res.json(popularColleges);
    } catch (error) {
        console.error('Error fetching popular colleges:', error);
        res.status(500).json({ message: 'Error fetching popular colleges' });
    }
});

// Add this function after the Question model definition
async function createTestQuestions() {
    try {
        const count = await Question.countDocuments();
        if (count === 0) {
            console.log('Creating test questions...');
            const testQuestions = [
                {
                    title: 'What are the best engineering colleges in India?',
                    content: 'I am looking for top engineering colleges in India. Can anyone suggest some good options with their specializations?',
                    author: new mongoose.Types.ObjectId(), // This will be replaced with a real user ID
                    tags: ['engineering', 'colleges', 'admissions'],
                    views: 150,
                    upvotes: 25
                },
                {
                    title: 'How to prepare for JEE Advanced?',
                    content: 'I am preparing for JEE Advanced. What are some effective study strategies and resources?',
                    author: new mongoose.Types.ObjectId(),
                    tags: ['jee', 'entrance-exam', 'preparation'],
                    views: 200,
                    upvotes: 30
                },
                {
                    title: 'Best medical colleges in India',
                    content: 'Looking for information about top medical colleges in India. What are the admission criteria and facilities?',
                    author: new mongoose.Types.ObjectId(),
                    tags: ['medical', 'colleges', 'admissions'],
                    views: 180,
                    upvotes: 28
                }
            ];
            await Question.insertMany(testQuestions);
            console.log('Test questions created successfully');
        }
    } catch (error) {
        console.error('Error creating test questions:', error);
    }
}

// Modify the trending questions endpoint
app.get('/api/questions/trending', async (req, res) => {
    try {
        console.log('Fetching trending questions...');
        
        // First check if the Question model exists
        if (!Question) {
            console.error('Question model is not defined');
            return res.status(500).json({ 
                message: 'Database model error',
                error: 'Question model not found'
            });
        }

        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            console.error('Database not connected. Current state:', mongoose.connection.readyState);
            return res.status(500).json({ 
                message: 'Database connection error',
                error: 'Database not connected'
            });
        }

        // Check if we have any questions
        const questionCount = await Question.countDocuments();
        if (questionCount === 0) {
            console.log('No questions found, creating test questions...');
            await createTestQuestions();
        }

        console.log('Executing query...');
        const trendingQuestions = await Question.find()
            .sort({ 
                views: -1, 
                upvotes: -1,
                createdAt: -1 
            })
            .limit(6)
            .populate('author', 'name avatar')
            .lean();
        
        console.log('Query executed. Found questions:', trendingQuestions.length);
        
        // Ensure all required fields are present
        const formattedQuestions = trendingQuestions.map(question => ({
            _id: question._id,
            title: question.title || '',
            content: question.content || '',
            views: question.views || 0,
            upvotes: question.upvotes || 0,
            author: {
                name: question.author?.name || 'Anonymous',
                avatar: question.author?.avatar || '../assets/default-avatar.png'
            },
            createdAt: question.createdAt
        }));
        
        console.log('Sending response with', formattedQuestions.length, 'questions');
        res.json(formattedQuestions);
    } catch (error) {
        console.error('Detailed error in trending questions:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            message: 'Error fetching trending questions',
            error: error.message,
            details: error.stack
        });
    }
});

// Static file serving - Define these AFTER API routes
app.use(express.static(path.join(__dirname, '../x')));

// HTML routes - Define these AFTER API routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../x/index.html'));
});

app.get('/pages/:page', (req, res) => {
    res.sendFile(path.join(__dirname, '../x/pages', req.params.page));
});

app.get('/admin/:page', (req, res) => {
    res.sendFile(path.join(__dirname, '../x/admin', req.params.page));
});

// Catch-all route - This should be the LAST route
app.get('*', (req, res) => {
    // Check if the request is for an API endpoint
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    // For non-API routes, serve the index.html
    res.sendFile(path.join(__dirname, '../x/index.html'));
});

// Get user statistics
async function getUserStats(userId) {
    try {
        // Get questions count
        const questionsCount = await Question.countDocuments({ author: userId });
        
        // Get answers count
        const answersCount = await Question.countDocuments({
            'answers.author': userId
        });
        
        // Get total upvotes received
        const questions = await Question.find({ author: userId });
        const upvotesReceived = questions.reduce((total, question) => total + (question.upvotes || 0), 0);
        
        // Calculate reputation (example formula)
        const reputation = (questionsCount * 5) + (answersCount * 10) + (upvotesReceived * 2);
        
        return {
            questionsCount,
            answersCount,
            upvotesReceived,
            reputation
        };
    } catch (error) {
        console.error('Error calculating user stats:', error);
        return {
            questionsCount: 0,
            answersCount: 0,
            upvotesReceived: 0,
            reputation: 0
        };
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!',
        error: err.message
    });
});

// Get current user
app.get('/api/users/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// Get all questions with sorting and pagination
app.get('/api/questions', async (req, res) => {
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

// Get question by ID
app.get('/api/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('author', 'name avatar')
            .populate('answers.author', 'name avatar');
        
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Increment view count
        question.views += 1;
        await question.save();

        res.json(question);
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({ message: 'Error fetching question' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Add this after MongoDB connection success
mongoose.connection.once('open', async () => {
    console.log('Connected to MongoDB');
    await createTestQuestions();
    await createSampleColleges();
});

// Function to create sample colleges
async function createSampleColleges() {
    try {
        const count = await College.countDocuments();
        if (count === 0) {
            console.log('Creating sample colleges...');
            const sampleColleges = [
                {
                    name: 'Indian Institute of Technology Delhi',
                    location: 'New Delhi',
                    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    description: 'One of the premier engineering institutions in India, known for excellence in technical education and research.',
                    courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'],
                    stats: {
                        students: 8000,
                        faculty: 500,
                        rating: 4.8
                    }
                },
                {
                    name: 'National Institute of Technology Karnataka',
                    location: 'Surathkal, Karnataka',
                    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    description: 'A leading technical institution with state-of-the-art facilities and strong industry connections.',
                    courses: ['Information Technology', 'Electronics', 'Chemical Engineering', 'Industrial Engineering'],
                    stats: {
                        students: 6000,
                        faculty: 400,
                        rating: 4.6
                    }
                },
                {
                    name: 'VIT University',
                    location: 'Vellore, Tamil Nadu',
                    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    description: 'A private university known for its innovative teaching methods and strong placement record.',
                    courses: ['Computer Science', 'Electronics', 'Mechanical', 'Biotechnology'],
                    stats: {
                        students: 25000,
                        faculty: 1500,
                        rating: 4.5
                    }
                },
                {
                    name: 'Manipal Institute of Technology',
                    location: 'Manipal, Karnataka',
                    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    description: 'A prestigious engineering college with excellent infrastructure and research facilities.',
                    courses: ['Aerospace Engineering', 'Computer Science', 'Electronics', 'Mechanical Engineering'],
                    stats: {
                        students: 7000,
                        faculty: 450,
                        rating: 4.7
                    }
                },
                {
                    name: 'BITS Pilani',
                    location: 'Pilani, Rajasthan',
                    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    description: 'A premier technical university known for its innovative curriculum and strong industry ties.',
                    courses: ['Computer Science', 'Electrical', 'Mechanical', 'Chemical'],
                    stats: {
                        students: 10000,
                        faculty: 600,
                        rating: 4.9
                    }
                },
                {
                    name: 'PSG College of Technology',
                    location: 'Coimbatore, Tamil Nadu',
                    image: 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    description: 'A leading technical institution with strong focus on practical learning and industry collaboration.',
                    courses: ['Information Technology', 'Mechanical', 'Civil', 'Textile Technology'],
                    stats: {
                        students: 5000,
                        faculty: 350,
                        rating: 4.6
                    }
                }
            ];
            await College.insertMany(sampleColleges);
            console.log('Sample colleges created successfully');
        }
    } catch (error) {
        console.error('Error creating sample colleges:', error);
    }
}
 
