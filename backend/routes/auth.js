const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        console.log('Register endpoint called in auth.js with body:', req.body);
        console.log('Raw body:', JSON.stringify(req.body));
        console.log('Body type:', typeof req.body);
        console.log('Content-Type:', req.headers['content-type']);
        
        // Get field values with fallbacks for different field names
        const name = req.body.name || req.body.fullName || '';
        const email = req.body.email || '';
        const password = req.body.password || '';
        const role = req.body.role || req.body.userType || 'prospective'; // Default to prospective
        const interestedColleges = req.body.interestedColleges || [];
        const college = req.body.college || '';
        const major = req.body.major || '';
        const graduationYear = req.body.graduationYear || '';
        
        console.log('Extracted field values:');
        console.log('- name:', name, 'from', req.body.name);
        console.log('- email:', email, 'from', req.body.email);
        console.log('- password present:', !!password);
        console.log('- role:', role, 'from', req.body.role);
        console.log('- interestedColleges:', interestedColleges);
        
        // Validate role
        const validRoles = ['prospective', 'current', 'alumni'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
            });
        }
        
        console.log('Processing signup with fields:', { name, email, role });

        // Basic validation
        if (!name || !email || !password) {
            console.log('Missing required fields');
            return res.status(400).json({ msg: 'Please fill all required fields.' });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already registered.' });
        }

        // Validate college email if role is 'current'
        if (role === 'current') {
            const allowedDomains = ['.edu', '.ac.in'];
            const isCollegeEmail = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));

            if (!isCollegeEmail) {
                return res.status(400).json({ msg: 'Current students must register with a valid college email.' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with consistent field names
        console.log('Creating new user with role:', role);
        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role || 'prospective', // Ensure role is set
            college,
            major,
            graduationYear,
            interestedColleges: Array.isArray(interestedColleges) ? interestedColleges : [],
            verified: true, // Auto-verify for now
            createdAt: new Date()
        });

        // Log the user object before saving
        console.log('User object before save:', JSON.stringify(newUser, null, 2));
        
        await newUser.save();
        
        // Log the user object after save
        console.log('User object after save:', JSON.stringify(newUser, null, 2));
        // Generate token to automatically log in the user after registration
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '24h' }
        );

        // Return user data with token in the format the frontend expects
        res.status(201).json({
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.name.split(' ')[0],
                lastName: newUser.name.split(' ').slice(1).join(' ')
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', JSON.stringify(req.body, null, 2));
        console.log('Request headers:', JSON.stringify(req.headers, null, 2));
        
        const { email, password, role } = req.body;
        
        // Extra validation and debugging
        if (!email || !password || !role) {
            console.log('Missing required fields:', {
                hasEmail: !!email,
                hasPassword: !!password,
                hasRole: !!role
            });
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields. Please provide email, password and role.' 
            });
        }
        
        console.log('Looking for user with email:', email);
        
        // Find user by email (case insensitive)
        const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        
        console.log('Existing user role before update:', user ? user.role : 'User not found');
        console.log('User found:', user ? 'Yes' : 'No');
        console.log('User role:', user ? user.role : 'N/A');
        
        // Log the user's role before finding
        console.log('Existing user role before update:', user ? user.role : 'No user found');

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        console.log('User found:', user ? 'Yes' : 'No');
        console.log('User role:', user ? user.role : 'No user found');
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // If role is undefined or invalid, update it with the provided role
        if (!user.role || !['prospective', 'current', 'alumni'].includes(user.role)) {
            console.log('Invalid role detected. Updating to:', role);
            console.log('User ID:', user._id);
            console.log('Current user object:', JSON.stringify(user, null, 2));
            
            try {
                // Update the user with the new role
                const updateResult = await User.findByIdAndUpdate(
                    user._id,
                    {
                        role: role,
                        name: user.name || email.split('@')[0]
                    },
                    { new: true, runValidators: true } // Return the updated document and run validators
                );
                
                console.log('Update result:', JSON.stringify(updateResult, null, 2));
                if (!updateResult) {
                    console.error('Update failed: No document returned');
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to update user role' 
                    });
                }
                
                user.role = role; // Update the user object in memory
                console.log('Updated user role:', user.role);
                
                // Verify the role was actually updated
                const finalUser = await User.findById(user._id);
                if (!finalUser || !finalUser.role) {
                    console.error('Role update verification failed');
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Failed to verify role update' 
                    });
                }
                
                console.log('Final user role after verification:', finalUser.role);
            } catch (updateError) {
                console.error('Error updating role:', updateError);
                return res.status(500).json({ 
                    success: false, 
                    message: updateError.message || 'Error updating user role' 
                });
            }
        }
        
        // Validate the provided role
        if (!role || !['prospective', 'current', 'alumni'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid role to login.'
            });
        }

        // Check if user has a role and if it matches
        if (!user.role) {
            // Set default role if none exists
            try {
                await User.findByIdAndUpdate(user._id, { role: role });
                user.role = role;
            } catch (error) {
                console.error('Error setting role:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Error setting user role'
                });
            }
        } else if (user.role !== role) {
            // Role mismatch
            return res.status(403).json({
                success: false,
                message: `You are registered as a ${user.role} student. Please select the correct role to login.`
            });
        }

        // Verify password
        console.log('About to verify password for:', user.email);
        console.log('Password from request (length):', password ? password.length : 'no password');
        console.log('Stored password in DB (partial):', user.password ? (user.password.substring(0, 5) + '...') : 'no password');
        
        const isValidPassword = await user.comparePassword(password);
        console.log('Password verification result:', isValidPassword);
        
        if (!isValidPassword) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Log user details after role update and password verification
        console.log('User after role update and password verification:', {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
        });

        // Add a clear login success message
        console.log('\x1b[32m%s\x1b[0m', '✓ LOGIN SUCCESSFUL - User authenticated successfully!');
        console.log(`User: ${user.name} (${user.email}) with role: ${user.role}`);

        // Generate token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-jwt-secret',
            { expiresIn: '24h' }
        );

        // Update last login
        await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date()
        });

        // Return success response
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                createdAt: user.createdAt,
                lastLoginAt: new Date()
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
});

module.exports = router;
