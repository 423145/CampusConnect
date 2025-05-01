// Login Page Functionality
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitButton = document.querySelector('.btn-primary');
const roleButtons = document.querySelectorAll('.role-btn');

// Initialize role selection
function initializeRoleSelection() {
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            roleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Get selected role
function getSelectedRole() {
    const activeRoleBtn = Array.from(roleButtons).find(btn => btn.classList.contains('active'));
    return activeRoleBtn ? activeRoleBtn.dataset.role : 'prospective';
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize role selection
    initializeRoleSelection();

    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/';
        return;
    }

    // Initialize password toggle
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordField = document.getElementById('password');
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Add form submission handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Validate form
        if (!emailInput.value.trim() || !passwordInput.value.trim()) {
            alert('Please enter both email and password');
            return;
        }
        
        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        try {
            // Get selected role
            const role = getSelectedRole();
            console.log('Selected role:', role);
            
            if (!role) {
                alert('Please select a role');
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                return;
            }
            
            // Validate role
            const validRoles = ['prospective', 'current', 'alumni'];
            
            if (!validRoles.includes(role)) {
                throw new Error('Invalid role selected');
            }
            
            // Log the login data being sent
            const requestData = {
                email: emailInput.value.trim(),
                password: passwordInput.value.trim(),
                role: role
            };
            
            // For log safety, create a separate object with masked password
            const logSafeData = {
                email: requestData.email,
                password: '***',
                role: requestData.role
            };
            console.log('Sending login data:', logSafeData);
            
            // Make AJAX request
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const response = await loginResponse.json();
            console.log('Login response:', response);

            if (!loginResponse.ok) {
                throw new Error(response.message || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('lastLogin', new Date().toString());

            // Fetch user profile and store as currentUser
            try {
                const profileRes = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: { 'Authorization': `Bearer ${response.token}` }
                });
                if (profileRes.ok) {
                    const profile = await profileRes.json();
                    localStorage.setItem('currentUser', JSON.stringify(profile));
                } else {
                    // fallback to response.user if profile fetch fails
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                }
            } catch (e) {
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            console.log('Successfully logged in');
            
            // Show success message to user
            const successMessage = document.createElement('div');
            successMessage.className = 'login-success-message';
            successMessage.innerHTML = `
                <div style="background-color: #4CAF50; color: white; padding: 15px; 
                            margin: 20px 0; border-radius: 5px; text-align: center;">
                    <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
                    Login successful! Welcome back, ${response.user.name || 'User'}
                </div>
            `;
            
            // Insert the success message at the top of the form
            loginForm.parentNode.insertBefore(successMessage, loginForm);
            
            // Scroll to show the message
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // CRITICAL: Force header update immediately
            if (window.headerManager) {
                console.log('Forcing immediate header update after login');
                window.headerManager.updateHeaderState();
            }
            
            // Determine where to redirect after a slight delay (to show success message)
            setTimeout(() => {
                redirectToIndex(response.user);
            }, 1500);
            
            function redirectToIndex(user) {
                // Improved redirection logic - go to index/home first
                let redirectPath;
                
                // Determine base path based on current location
                const currentPath = window.location.pathname;
                console.log('Current path:', currentPath);
                
                if (currentPath.includes('/pages/')) {
                    // We're in the pages directory, go up one level
                    redirectPath = '../index.html';
                } else {
                    // We're somewhere else, try to get to index
                    redirectPath = '/index.html';
                }
                
                console.log('Redirecting to:', redirectPath);
                window.location.href = redirectPath;
            }
        } catch (error) {
            console.error('Login error:', error);
            // Show error in a more user-friendly way
            if (error.message.includes('registered as a')) {
                const role = error.message.split(' ')[5];
                alert(`Role mismatch: You are registered as a ${role}. Please select ${role} role to login.`);
            } else {
                alert(error.message || 'Login failed. Please try again.');
            }
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });

    // Prevent form submission via Enter key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            e.preventDefault();
            if (loginForm) {
                loginForm.dispatchEvent(new Event('submit', { bubbles: true }));
            }
        }
    });
});
