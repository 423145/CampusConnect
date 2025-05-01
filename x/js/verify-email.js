// Email Verification Script
document.addEventListener('DOMContentLoaded', function() {
    const verificationForm = document.getElementById('verification-form');
    const codeInputs = document.querySelectorAll('.code-input');
    const resendButton = document.getElementById('resend-code');
    const timerDisplay = document.getElementById('timer');
    const resendTimerDisplay = document.getElementById('resend-timer');

    let verificationTimer;
    let resendTimer;
    let verificationTimeLeft = 30 * 60; // 30 minutes
    let resendTimeLeft = 60; // 60 seconds

    // Initialize code inputs
    codeInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Backspace' && !input.value) {
                if (index > 0) {
                    codeInputs[index - 1].focus();
                }
                return;
            }

            if (input.value) {
                if (index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                validateCode();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value) {
                if (index > 0) {
                    codeInputs[index - 1].focus();
                }
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').slice(0, 6);
            
            pastedData.split('').forEach((char, charIndex) => {
                if (charIndex < codeInputs.length) {
                    codeInputs[charIndex].value = char;
                }
            });

            validateCode();
        });
    });

    // Start verification timer
    function startVerificationTimer() {
        verificationTimer = setInterval(() => {
            verificationTimeLeft--;
            updateTimerDisplay();

            if (verificationTimeLeft <= 0) {
                clearInterval(verificationTimer);
                expireVerification();
            }
        }, 1000);
    }

    // Start resend timer
    function startResendTimer() {
        resendButton.disabled = true;
        resendTimer = setInterval(() => {
            resendTimeLeft--;
            resendTimerDisplay.textContent = `(${resendTimeLeft}s)`;

            if (resendTimeLeft <= 0) {
                clearInterval(resendTimer);
                resendButton.disabled = false;
                resendTimerDisplay.textContent = '';
                resendTimeLeft = 60;
            }
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(verificationTimeLeft / 60);
        const seconds = verificationTimeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Validate entered code
    function validateCode() {
        const enteredCode = Array.from(codeInputs)
            .map(input => input.value)
            .join('');

        if (enteredCode.length === 6) {
            verifyCode(enteredCode);
        }
    }

    // Verify the entered code
    async function verifyCode(code) {
        try {
            const pendingVerification = JSON.parse(sessionStorage.getItem('pendingVerification'));
            if (!pendingVerification) {
                throw new Error('Verification session expired');
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === pendingVerification.email);

            if (!user) {
                throw new Error('User not found');
            }

            if (code === user.verificationCode) {
                // Update user verification status
                user.verified = true;
                user.verificationCode = null;
                localStorage.setItem('users', JSON.stringify(users));

                // Clear verification session
                sessionStorage.removeItem('pendingVerification');

                showSuccess('Email verified successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                throw new Error('Invalid verification code');
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Handle verification expiration
    function expireVerification() {
        sessionStorage.removeItem('pendingVerification');
        showError('Verification code expired. Please request a new one.');
        disableInputs();
    }

    // Disable inputs after expiration
    function disableInputs() {
        codeInputs.forEach(input => {
            input.disabled = true;
        });
        document.querySelector('.btn-verify').disabled = true;
    }

    // Show success message
    function showSuccess(message) {
        const alert = document.getElementById('verify-alert');
        alert.className = 'alert alert-success';
        alert.textContent = message;
    }

    // Show error message
    function showError(message) {
        const alert = document.getElementById('verify-alert');
        alert.className = 'alert alert-error';
        alert.textContent = message;
    }

    // Initialize page
    function initializePage() {
        const pendingVerification = JSON.parse(sessionStorage.getItem('pendingVerification'));
        if (!pendingVerification) {
            window.location.href = 'signup.html';
            return;
        }

        startVerificationTimer();
        startResendTimer();
        codeInputs[0].focus();
    }

    // Initialize the page
    initializePage();
});