// Authentication and Session Management

// Admin Authentication Module
const AdminAuth = {
    // Initialize authentication state
    init() {
        this.checkSession();
        this.setupAuthListeners();
    },

    // Check and validate current session
    checkSession() {
        const session = this.getSession();
        if (!session) {
            this.redirectToLogin();
            return false;
        }
        return true;
    },

    // Get current session from localStorage
    getSession() {
        const session = localStorage.getItem('adminSession');
        if (!session) return null;
        
        try {
            const parsedSession = JSON.parse(session);
            if (this.isSessionValid(parsedSession)) {
                return parsedSession;
            }
            this.clearSession();
            return null;
        } catch (e) {
            this.clearSession();
            return null;
        }
    },

    // Validate session data
    isSessionValid(session) {
        if (!session) return false;
        
        // Check if session has required fields
        if (!session.user || !session.user.id || !session.user.role) return false;
        
        // Verify user is admin
        if (session.user.role !== 'admin') return false;
        
        // Check session expiration
        if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
            this.clearSession();
            return false;
        }
        
        return true;
    },

    // Create new session
    createSession(userData) {
        if (!userData || !userData.role || userData.role !== 'admin') {
            throw new Error('Invalid user data for admin session');
        }

        const session = {
            user: userData,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        localStorage.setItem('adminSession', JSON.stringify(session));
        return session;
    },

    // Clear current session
    clearSession() {
        localStorage.removeItem('adminSession');
    },

    // Handle login
    async login(email, password) {
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            
            // Store token
            localStorage.setItem('token', data.token);
            
            // Fetch and store user details
            await this.fetchAndStoreUserDetails(data.userId);
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async fetchAndStoreUserDetails(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            const userData = await response.json();
            
            // Store user data in localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            return userData;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },

    // Handle logout
    async logout() {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        
        // Redirect to login page
        window.location.href = 'login.html';
    },

    // Navigation methods
    redirectToLogin() {
        window.location.href = '/pages/login.html';
    },

    redirectToDashboard() {
        window.location.href = '/admin/html/dashboard.html';
    },

    redirectToProfile() {
        const session = this.getSession();
        if (!session || !session.user) {
            this.redirectToLogin();
            return;
        }
        
        if (session.user.role === 'admin') {
            this.redirectToDashboard();
        } else {
            window.location.href = '/pages/profile.html';
        }
    },

    // Setup auth-related event listeners
    setupAuthListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.logout-link, .logout-link *')) {
                e.preventDefault();
                this.logout();
            }
        });
    },

    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    getCurrentUser() {
        try {
            const userJson = localStorage.getItem('currentUser');
            console.log('Current user from localStorage:', userJson);
            if (!userJson) {
                console.log('No user found in localStorage');
                return null;
            }
            const user = JSON.parse(userJson);
            console.log('Parsed user data:', user);
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    // Function to check if token is expired
    isTokenExpired() {
        const token = localStorage.getItem('token');
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000;
        } catch (error) {
            return true;
        }
    },

    // Function to refresh user data
    async refreshUserData() {
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id) {
            await this.fetchAndStoreUserDetails(currentUser.id);
        }
    }
};

// Export AdminAuth
export { AdminAuth };

// Regular user authentication
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('=== Login Form Submitted ===');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        
        try {
            const session = await AdminAuth.login(email, password);
            
            // Handle admin login success
            if (session) {
                AdminAuth.redirectToDashboard();
                return;
            }
            
            // Handle regular user login success
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                window.location.href = '/pages/profile.html';
                return;
            }
            
            throw new Error('Login failed. Please try again.');
        } catch (error) {
            alert('Login failed: ' + (error.message || 'Invalid credentials'));
        }
    });
}

// Toggle password visibility
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('#password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// Registration form functionality
const registerForm = document.getElementById('registerForm');
const roleOptions = document.querySelectorAll('.role-option');
const collegeEmailSection = document.getElementById('collegeEmailSection');

if (roleOptions) {
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            roleOptions.forEach(opt => opt.classList.remove('selected'));
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Show/hide college email section based on role
            if (collegeEmailSection) {
                collegeEmailSection.style.display = 
                    this.getAttribute('data-role') === 'verified_student' ? 'block' : 'none';
            }
            
            // Set hidden input value
            const roleInput = document.getElementById('role');
            if (roleInput) {
                roleInput.value = this.getAttribute('data-role');
            }
        });
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('role').value;
        
        try {
            // Basic validation
            if (!name || !email || !password || !confirmPassword) {
                throw new Error('All fields are required');
            }
            
            // Validate email format
            if (!validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }
            
            // Validate password match
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            // Validate password strength
            if (password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            
            // Validate college email if role is verified_student
            if (role === 'verified_student') {
                const collegeEmail = document.getElementById('collegeEmail').value.trim();
                if (!validateCollegeEmail(collegeEmail)) {
                    throw new Error('Please enter a valid college email address');
                }
            }
            
            // Get existing users or initialize empty array
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                throw new Error('This email is already registered');
            }
            
            // Create new user
            const newUser = {
                id: users.length + 1,
                name,
                email,
                avatar: '../assets/default-avatar.jpg',
                role,
                reputation: 0,
                createdAt: new Date().toISOString()
            };
            
            // Add college if verified student
            if (role === 'verified_student') {
                const collegeEmail = document.getElementById('collegeEmail').value.trim();
                newUser.college = determineCollege(collegeEmail);
            }
            
            // Add user to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Show success message and redirect
            alert('Registration successful! Welcome to CampusConnect.');
            window.location.href = '../index.html';
            
        } catch (error) {
            alert(error.message);
        }
    });
}

// Helper function to determine college
function determineCollege(email) {
    const collegeDomain = email.split('@')[1];
    const collegeMap = {
        'nitandhra': 'NIT Andhra Pradesh',
        'iitm': 'IIT Madras',
        'bitspilani': 'BITS Pilani',
        'vit': 'VIT Vellore'
    };
    
    for (const [domain, college] of Object.entries(collegeMap)) {
        if (collegeDomain.includes(domain)) {
            return college;
        }
    }
    return 'Other';
}

// Email validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCollegeEmail(email) {
    // Verified student email domains (institutional)
    const verifiedStudentDomains = [
        'student.nitandhra.ac.in',
        'student.iitm.ac.in',
        'student.bitspilani.ac.in',
        'student.vit.ac.in',
        'student.iitb.ac.in',
        'student.iitd.ac.in',
        'student.iisc.ac.in',
        'student.jnu.ac.in',
        'student.du.ac.in',
        'student.manipal.edu',
        'student.amrita.edu',
        'edu'
    ];

    // Prospective student email domains (general purpose)
    const prospectiveStudentDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com',
        'live.com',
        'rediffmail.com'
    ];
    
    if (!validateEmail(email)) {
        return false;
    }
    
    const domain = email.split('@')[1];
    
    // Check if domain ends with .edu (for international students)
    if (domain.endsWith('.edu')) {
        return true;
    }
    
    // Check if domain is in the verified student domains list
    if (verifiedStudentDomains.some(validDomain => domain === validDomain)) {
        return true;
    }

    // Check if domain is in the prospective student domains list
    if (prospectiveStudentDomains.some(validDomain => domain === validDomain)) {
        return true;
    }
    
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Alert function
    function showAlert(message, type, targetForm) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        // Insert alert before the form
        targetForm.insertAdjacentElement('beforebegin', alert);

        // Only auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                if (alert && alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }

    // Handle form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Remove any existing event listeners
        const newLoginForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newLoginForm, loginForm);

        // Get form elements from the new form
        const emailInput = newLoginForm.querySelector('#email');
        const passwordInput = newLoginForm.querySelector('#password');
        const togglePassword = newLoginForm.querySelector('.toggle-password');
        const rememberCheckbox = newLoginForm.querySelector('#remember');
        const roleButtons = document.querySelectorAll('.role-btn');
        let currentRole = 'prospective'; // Default role

        // Handle role selection
        roleButtons.forEach(button => {
            button.addEventListener('click', function() {
                roleButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentRole = this.dataset.role === 'current' ? 'current' : 'prospective';
                console.log('Selected role:', currentRole);
            });
        });
        
        newLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get the submit button
            const submitButton = this.querySelector('button[type="submit"]');
            
            // Disable the button immediately
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

            try {
                // Get form data
                const formData = {
                    email: emailInput.value.trim().toLowerCase(),
                    password: passwordInput.value,
                    role: currentRole
                };

                console.log('Attempting login with:', {
                    email: formData.email,
                    role: formData.role
                });

                // Validate form data
                if (!formData.email || !formData.password || !formData.role) {
                    showAlert('Please fill in all fields and select a role', 'danger', newLoginForm);
                    submitButton.disabled = false;
                    submitButton.textContent = 'Log In';
                    return false;
                }

                // Send login request
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                console.log('Server response:', data);

                // Always reset button state first
                submitButton.disabled = false;
                submitButton.textContent = 'Log In';

                if (!data.success) {
                    showAlert(data.message || 'Login failed', 'danger', newLoginForm);
                    return false;
                }

                // Only proceed if login was successful
                showAlert('Login successful! Redirecting...', 'success', newLoginForm);
                
                // Store user data and update header
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify({
                    ...data.user,
                    avatar: data.user.avatar || '../assets/default-avatar.jpg',
                    notifications: data.user.notifications || []
                }));

                // Update header if HeaderManager exists
                if (window.headerManager) {
                    window.headerManager.updateHeaderState();
                }

                // Redirect after a short delay
                setTimeout(() => {
                    const redirectPath = currentRole === 'current' ? 
                        '/dashboard-current.html' : '/dashboard-prospective.html';
                    window.location.href = redirectPath;
                }, 1500);

            } catch (error) {
                console.error('Login error:', error);
                submitButton.disabled = false;
                submitButton.textContent = 'Log In';
                showAlert('Error during login. Please try again.', 'danger', newLoginForm);
                return false;
            }
        });

        // Handle "Remember me" checkbox
        if (rememberCheckbox) {
            const storedEmail = localStorage.getItem('rememberedEmail');
            if (storedEmail) {
                emailInput.value = storedEmail;
                rememberCheckbox.checked = true;
            }

            rememberCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('rememberedEmail', emailInput.value);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
            });
        }

        // Toggle password visibility
        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye');
                this.classList.toggle('fa-eye-slash');
            });
        }
    }
});