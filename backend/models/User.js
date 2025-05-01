const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['prospective', 'current', 'alumni'],
        default: 'prospective',
        required: true
    },
    verified: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    college: { type: String, default: '' },
    major: { type: String, default: '' },
    graduationYear: { type: String, default: '' },
    avatar: { type: String, default: '../assets/default-avatar.png' },
    interestedColleges: [String],
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date, default: null }
}, {
    timestamps: true
});

// Middleware to ensure role is set before saving
userSchema.pre('save', async function(next) {
    try {
        // If role is not set or invalid, set to default
        if (!this.role || !['prospective', 'current', 'alumni'].includes(this.role)) {
            this.role = 'prospective';
        }
        
        // Log the role being saved
        console.log('Saving user with role:', this.role);
        
        next();
    } catch (error) {
        console.error('Role validation error:', error);
        next(error);
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        console.log('Comparing passwords:');
        console.log('- Candidate password length:', candidatePassword ? candidatePassword.length : 'invalid');
        console.log('- Stored password type:', typeof this.password);
        console.log('- Stored password starts with:', this.password ? this.password.substring(0, 5) + '...' : 'none');

        // TEMPORARY DEVELOPMENT FIX:
        // First, try direct string comparison (for plain text passwords in development)
        if (candidatePassword === this.password) {
            console.log('✓ MATCH: Direct string comparison succeeded');
            return true;
        }
        
        // Next, try bcrypt comparison if it looks like a hash
        if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$'))) {
            const result = await bcrypt.compare(candidatePassword, this.password);
            console.log(result ? '✓ MATCH: Bcrypt comparison succeeded' : '✗ NO MATCH: Bcrypt comparison failed');
            return result;
        }
        
        console.log('✗ NO MATCH: Both comparison methods failed');
        return false;
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);
