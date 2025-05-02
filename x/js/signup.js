// Signup Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup page loaded');
    const signupForm = document.getElementById('signup-form');
    const roleButtons = document.querySelectorAll('.role-btn');
    let currentRole = 'prospective';

    // Populate graduation years
    const graduationYearSelect = document.getElementById('graduation-year');
    if (graduationYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year <= currentYear + 6; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            graduationYearSelect.appendChild(option);
        }
    }

    // Function to toggle form fields' required attribute
    function toggleRequiredFields(role) {
        // Disable required on all fields first
        const allInputs = document.querySelectorAll('#signup-form input, #signup-form select');
        allInputs.forEach(input => input.required = false);

        // Enable required only for visible form
        const activeForm = document.getElementById(`${role}-form`);
        if (activeForm) {
            const activeInputs = activeForm.querySelectorAll('input, select');
            activeInputs.forEach(input => {
                if (input.getAttribute('data-required') !== 'false') {
                    input.required = true;
                }
            });
        }

        // Terms checkbox should always be required
        document.getElementById('terms').required = true;
    }

    // Role selection handler
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            roleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentRole = this.dataset.role;
            console.log('Selected role:', currentRole);
            
            // Toggle form visibility
            document.getElementById('prospective-form').classList.toggle('hidden', currentRole !== 'prospective');
            document.getElementById('current-form').classList.toggle('hidden', currentRole !== 'current');

            // Toggle required fields
            toggleRequiredFields(currentRole);
        });
    });

    // Initialize required fields for default role
    toggleRequiredFields(currentRole);

    // Password visibility toggle for both password fields
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input[type="password"], input[type="text"]');
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                this.querySelector('img').src = isPassword ? '../assets/eye-slash.svg' : '../assets/eye.svg';
                this.querySelector('img').alt = isPassword ? 'Hide Password' : 'Show Password';
            }
        });
    });

    // Password strength meter logic
    function getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    }

    function updateStrengthMeter(input, meter, text) {
        const val = input.value;
        const score = getPasswordStrength(val);
        let width = '0%';
        let color = 'var(--error-color)';
        let label = 'Very Weak';
        if (score === 1) { width = '20%'; color = 'var(--error-color)'; label = 'Very Weak'; }
        else if (score === 2) { width = '40%'; color = '#f59e0b'; label = 'Weak'; }
        else if (score === 3) { width = '60%'; color = '#fbbf24'; label = 'Medium'; }
        else if (score === 4) { width = '80%'; color = 'var(--primary-color)'; label = 'Strong'; }
        else if (score === 5) { width = '100%'; color = 'var(--success-color)'; label = 'Very Strong'; }
        meter.style.width = width;
        meter.style.backgroundColor = color;
        text.textContent = 'Password Strength: ' + label;
    }

    // Attach strength meter listeners for both password fields
    [
        {input: document.getElementById('password'),
         meter: document.querySelector('#prospective-form .strength-fill'),
         text: document.querySelector('#prospective-form .strength-text')},
        {input: document.getElementById('password-current'),
         meter: document.querySelector('#current-form .strength-fill'),
         text: document.querySelector('#current-form .strength-text')}
    ].forEach(({input, meter, text}) => {
        if (input && meter && text) {
            input.addEventListener('input', function() {
                updateStrengthMeter(input, meter, text);
            });
        }
    });

    // Handle form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Get form data based on role
                const formData = {
                    name: currentRole === 'current' ? 
                        document.getElementById('name-current').value.trim() :
                        document.getElementById('name').value.trim(),
                    email: currentRole === 'current' ?
                        document.getElementById('college-email').value.trim() :
                        document.getElementById('email').value.trim(),
                    password: currentRole === 'current' ?
                        document.getElementById('password-current').value :
                        document.getElementById('password').value,
                    role: currentRole
                };

                // Add role-specific fields
                if (currentRole === 'current') {
                    formData.college = document.getElementById('college').value.trim();
                    formData.graduationYear = document.getElementById('graduation-year').value.trim();
                    formData.major = document.getElementById('major').value.trim();
                } else {
                    const collegesInput = document.getElementById('interested-colleges').value.trim();
                    formData.interestedColleges = collegesInput ? collegesInput.split(',').map(college => college.trim()) : [];
                }

                // Add email domain validation for current students
                if (currentRole === 'current') {
                    const collegeEmail = formData.email;
                    const collegeEmailPattern = /^[^@]+@[^@]+\.(edu|ac\.in)$/i;
                    if (!collegeEmailPattern.test(collegeEmail)) {
                        showAlert('Please enter a valid college email ending with .edu or .ac.in', 'danger');
                        return;
                    }
                }

                console.log('Sending signup data:', formData);
                
                // Add additional debugging
                console.log('Processing signup for ' + formData.role + ' student');
                
                // Ensure all required fields are explicitly defined and not undefined
                const payload = {
                    name: formData.name || '',
                    email: formData.email || '',
                    password: formData.password || '',
                    role: formData.role || 'prospective',
                    interestedColleges: formData.interestedColleges || [],
                    college: formData.college || '',
                    major: formData.major || '',
                    graduationYear: formData.graduationYear || ''
                };
                
                // For debugging purposes, log the exact JSON being sent
                const jsonBody = JSON.stringify(payload);
                console.log('JSON being sent:', jsonBody);
                
                const response = await fetch('http://localhost:3000/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: jsonBody
                });
                
                console.log('Response status:', response.status);

                const result = await response.json();
                console.log('Signup response:', result);
                
                // For troubleshooting
                console.log('Full response object structure:', JSON.stringify(result, null, 2));
                if (result.msg) {
                    console.log('Server returned msg field:', result.msg);
                }
                if (result.message) {
                    console.log('Server returned message field:', result.message);
                }
                
                if (response.ok) {
                    // Store token and user data directly (auto-verified)
                    if (result.token) {
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                        showAlert('Signup successful! Redirecting to the homepage...', 'success');
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 2000);
                    } else {
                        // Traditional flow with email verification
                        sessionStorage.setItem('verificationEmail', formData.email);
                        showAlert('Signup successful! Please check your email for verification code.', 'success');
                        setTimeout(() => {
                            window.location.href = 'verify-otp.html';
                        }, 2000);
                    }
                } else {
                    throw new Error(result.message || result.msg || 'Error during signup');
                }
            } catch (error) {
                console.error('Signup error:', error);
                showAlert(error.message || 'An error occurred during signup', 'danger');
            }
        });
    } else {
        console.error('Signup form not found!');
    }

    // Alert function
    function showAlert(message, type) {
        const alertDiv = document.getElementById('signup-alert');
        if (alertDiv) {
            alertDiv.textContent = message;
            alertDiv.className = `alert alert-${type}`;
            alertDiv.classList.remove('hidden');
            
            // Scroll to alert
            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.error('Alert div not found');
            alert(message); // Fallback to browser alert
        }
    }
});
  