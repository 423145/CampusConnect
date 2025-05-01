document.addEventListener('DOMContentLoaded', function() {
    const verifyForm = document.getElementById('verify-form');
    const otpInputs = document.querySelectorAll('.otp-input');
    const resendButton = document.getElementById('resend-btn');
    const timerElement = document.getElementById('timer');
    const alertContainer = document.getElementById('alert-container');
    const emailDisplay = document.getElementById('email-display');
    
    // Get email from session storage
    const email = sessionStorage.getItem('verificationEmail');
    console.log('Retrieved email from session:', email);

    if (!email) {
        showAlert('No email found for verification. Please sign up again.', 'danger');
        setTimeout(() => {
            window.location.href = 'signup.html';
        }, 2000);
        return;
    }

    // Display masked email
    emailDisplay.textContent = maskEmail(email);

    let timeLeft = 300; // 5 minutes
    let resendTimeLeft = 60; // 1 minute

    // Initialize timers
    startTimer();
    startResendTimer();

    // Handle OTP input
    otpInputs.forEach((input, index) => {
        // Allow only numbers
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            
            // Move to next input if value is entered
            if (e.target.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        // Handle keyup
        input.addEventListener('keyup', (e) => {
            const currentInput = e.target;
            const nextInput = otpInputs[index + 1];
            const prevInput = otpInputs[index - 1];

            // Clear value and move to previous input on backspace
            if (e.key === 'Backspace') {
                currentInput.value = '';
                if (prevInput) {
                    prevInput.focus();
                }
                return;
            }

            // Move to next input if value is entered
            if (currentInput.value && nextInput) {
                nextInput.focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            if (/^\d+$/.test(pastedData)) {
                pastedData.split('').forEach((digit, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = digit;
                    }
                });
                if (isOTPComplete()) {
                    verifyOTP();
                }
            }
        });
    });

    // Handle form submission
    verifyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (isOTPComplete()) {
            await verifyOTP();
        } else {
            showAlert('Please enter the complete verification code', 'danger');
        }
    });

    // Handle resend button click
    resendButton.addEventListener('click', async function() {
        try {
            // Disable the button immediately
            resendButton.disabled = true;
            resendButton.textContent = 'Sending...';

            console.log('Attempting to resend OTP for email:', email);
            const response = await fetch('http://localhost:3000/api/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            console.log('Resend OTP response status:', response.status);
            const data = await response.json();
            console.log('Resend OTP response data:', data);

            if (response.ok) {
                showAlert('New verification code sent! Please check your email.', 'success');
                // Reset timers
                timeLeft = 300; // Reset main timer to 5 minutes
                resendTimeLeft = 60;
                startTimer();
                startResendTimer();                // Clear previous OTP inputs
                otpInputs.forEach(input => {
                    input.value = '';
                    input.disabled = false;
                });
                otpInputs[0].focus();
            } else {
                throw new Error(data.message || 'Failed to send new verification code');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            showAlert(error.message || 'Error sending new verification code. Please try again.', 'danger');
            // Re-enable the button on error
            resendButton.disabled = false;
            resendButton.textContent = 'Resend Code';
        }
    });

    // Helper functions
    async function verifyOTP() {
        try {
            const otp = getOTPValue();
            console.log('Starting OTP verification with:', { email, otp });

            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Verifying...';

            // Log the request details
            const requestData = { email, otp };
            console.log('Sending verification request with data:', requestData);

            const response = await fetch('http://localhost:3000/api/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });

            console.log('Server response status:', response.status);
            const data = await response.json();
            console.log('Server response data:', data);

            if (!response.ok) {
                throw new Error(data.message || `Server error: ${response.status}`);
            }

            showAlert('Email verified successfully! Redirecting to login...', 'success');
            sessionStorage.removeItem('verificationEmail');
            
            // Add a small delay before redirect
            setTimeout(() => {
                console.log('Redirecting to login page...');
                try {
                    window.location.href = '../pages/login.html';
                } catch (error) {
                    console.error('Redirect error:', error);
                    // Fallback redirect
                    window.location.replace('../pages/login.html');
                }
            }, 2000);
        } catch (error) {
            console.error('Verification error details:', {
                message: error.message,
                stack: error.stack,
                error: error
            });
            showAlert(error.message || 'Error during verification. Please try again.', 'danger');
            
            // Clear OTP fields on error
            otpInputs.forEach(input => {
                input.value = '';
            });
            otpInputs[0].focus();
        } finally {
            const submitButton = document.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Verify Email';
        }
    }

    function getOTPValue() {
        return Array.from(otpInputs).map(input => input.value).join('');
    }

    function isOTPComplete() {
        return Array.from(otpInputs).every(input => input.value.length === 1);
    }

    function startTimer() {
        const timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                expireOTP();
            }
        }, 1000);
    }

    function startResendTimer() {
        resendButton.disabled = true;
        const timer = setInterval(() => {
            resendTimeLeft--;
            if (resendTimeLeft <= 0) {
                clearInterval(timer);
                resendButton.disabled = false;
                resendButton.textContent = 'Resend Code';
            } else {
                resendButton.textContent = `Resend Code (${resendTimeLeft}s)`;
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function expireOTP() {
        showAlert('Verification code expired. Please request a new one.', 'danger');
        otpInputs.forEach(input => {
            input.disabled = true;
        });
        verifyForm.querySelector('button[type="submit"]').disabled = true;
    }

    function showAlert(message, type) {
        if (alertContainer) {
            alertContainer.textContent = message;
            alertContainer.className = `alert alert-${type}`;
            alertContainer.classList.remove('hidden');
            alertContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.error('Alert container not found');
            alert(message);
        }
    }

    function maskEmail(email) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.charAt(0) + 
            '*'.repeat(username.length - 2) + 
            username.charAt(username.length - 1);
        return `${maskedUsername}@${domain}`;
    }
}); 