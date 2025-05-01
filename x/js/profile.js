export default class Profile {
    constructor() {
        this.loadingState = document.getElementById('loadingState');
        this.errorState = document.getElementById('errorState');
        this.profileContent = document.getElementById('profileContent');
        this.errorMessage = document.getElementById('errorMessage');
        this.editModal = document.getElementById('editProfileModal');
        this.editForm = document.getElementById('editProfileForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Edit profile button
        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => this.showEditModal());
        }

        // Close modal button
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideEditModal());
        }

        // Cancel button
        const cancelBtn = document.querySelector('.cancel-edit');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideEditModal());
        }

        // Bio character count
        const bioTextarea = document.getElementById('editBio');
        if (bioTextarea) {
            bioTextarea.addEventListener('input', () => this.updateCharCount(bioTextarea));
        }

        // Avatar upload
        const uploadBtn = document.getElementById('uploadAvatarBtn');
        const avatarInput = document.getElementById('editAvatar');
        const removeAvatarBtn = document.getElementById('removeAvatarBtn');

        if (uploadBtn && avatarInput) {
            uploadBtn.addEventListener('click', () => avatarInput.click());
            avatarInput.addEventListener('change', (e) => this.handleAvatarChange(e));
        }

        if (removeAvatarBtn) {
            removeAvatarBtn.addEventListener('click', () => this.removeAvatar());
        }

        // Edit form submission
        if (this.editForm) {
            this.editForm.addEventListener('submit', (e) => this.handleProfileUpdate(e));
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.hideEditModal();
            }
        });

        // Graduation year validation
        const gradYearInput = document.getElementById('editGradYear');
        if (gradYearInput) {
            gradYearInput.addEventListener('input', () => this.validateGradYear(gradYearInput));
        }
    }

    async initialize() {
        try {
            // Check if user is logged in
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!token || !user) {
                // If not logged in and no user ID in URL, redirect to login
                const urlParams = new URLSearchParams(window.location.search);
                const userId = urlParams.get('id');
                
                if (!userId) {
                    window.location.href = '/login.html';
                    return;
                }
            }

            // Get user ID from URL or current user
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('id') || user?.id || user?._id;

            console.log('User from localStorage:', user);
            console.log('User ID being used:', userId);

            if (!userId) {
                throw new Error('No user ID available');
            }

            // Show loading state
            this.showLoading();

            // Load user data
            const userData = await this.loadUserData(userId);
            
            if (!userData) {
                throw new Error('Failed to load user data');
            }

            // Store user data
            this.userData = userData;

            // Update profile UI
            this.updateProfileUI(userData);

            // Load and display user's questions
            await this.loadUserQuestions(userId);

            // Hide loading state and show profile
            this.showProfile();
        } catch (error) {
            console.error('Profile initialization error:', error);
            
            // Handle specific error cases
            if (error.message === 'No token provided' || error.message === 'Invalid token') {
                // Clear invalid token and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
            } else {
                this.showError(error.message);
            }
        }
    }

    showLoading() {
        this.loadingState?.classList.remove('hidden');
        this.errorState?.classList.add('hidden');
        this.profileContent?.classList.add('hidden');
    }

    showError(message) {
        this.loadingState?.classList.add('hidden');
        this.errorState?.classList.remove('hidden');
        this.profileContent?.classList.add('hidden');
        if (this.errorMessage) {
            this.errorMessage.textContent = message || 'An error occurred while loading the profile.';
        }
    }

    showProfile() {
        this.loadingState?.classList.add('hidden');
        this.errorState?.classList.add('hidden');
        this.profileContent?.classList.remove('hidden');
    }

    async loadUserData(userId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to load user data');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error loading user data:', error);
            throw error;
        }
    }

    async loadUserQuestions(userId) {
        try {
            const token = localStorage.getItem('token');
            const userEmail = this.userData.email;
            
            // Fetch questions by both userId and email
            const response = await fetch(`/api/questions/user?userId=${userId}&email=${encodeURIComponent(userEmail)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // If we get a 404, just treat it as no questions yet
            if (response.status === 404) {
                console.log('No questions found for user');
                const questionsContainer = document.getElementById('userQuestions');
                if (questionsContainer) {
                    questionsContainer.innerHTML = `
                        <div class="no-questions-container">
                            <i class="fas fa-question-circle"></i>
                            <p class="no-questions-message">No questions asked yet</p>
                            <a href="/pages/ask-question.html" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Ask a Question
                            </a>
                        </div>
                    `;
                }
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to load user questions');
            }

            const questions = await response.json();
            console.log('Fetched questions:', questions);
            
            // Display questions or show "no questions" message
            const questionsContainer = document.getElementById('userQuestions');
            if (questionsContainer) {
                if (!questions || questions.length === 0) {
                    console.log('No questions found, showing message');
                    questionsContainer.innerHTML = `
                        <div class="no-questions-container">
                            <i class="fas fa-question-circle"></i>
                            <p class="no-questions-message">No questions asked yet</p>
                            <a href="/pages/ask-question.html" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Ask a Question
                            </a>
                        </div>
                    `;
                } else {
                    console.log('Questions found, displaying them');
                    this.displayQuestions(questions);
                }
            } else {
                console.log('Questions container not found');
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            const questionsContainer = document.getElementById('userQuestions');
            if (questionsContainer) {
                questionsContainer.innerHTML = `
                    <div class="no-questions-container">
                        <i class="fas fa-question-circle"></i>
                        <p class="no-questions-message">No questions asked yet</p>
                        <a href="/pages/ask-question.html" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Ask a Question
                        </a>
                    </div>
                `;
            }
        }
    }

    displayQuestions(questions) {
        const container = document.getElementById('userQuestions');
        if (!container) return;

        if (!questions || questions.length === 0) {
            container.innerHTML = `
                <div class="no-questions-container">
                    <i class="fas fa-question-circle"></i>
                    <p class="no-questions-message">No questions asked yet</p>
                    <a href="/pages/ask-question.html" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Ask a Question
                    </a>
                </div>
            `;
            return;
        }

        const questionsHTML = questions.map(question => `
            <div class="question-item">
                <h3>
                    <a href="/pages/question.html?id=${question._id}">
                        ${this.escapeHtml(question.title)}
                    </a>
                </h3>
                <p>${this.escapeHtml(question.content.substring(0, 200))}${question.content.length > 200 ? '...' : ''}</p>
                <div class="question-meta">
                    <span>
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(question.createdAt)}
                    </span>
                    <span>
                        <i class="fas fa-comment"></i>
                        ${question.answers?.length || 0} answers
                    </span>
                    <span>
                        <i class="fas fa-thumbs-up"></i>
                        ${question.upvotes || 0} upvotes
                    </span>
                </div>
            </div>
        `).join('');

        container.innerHTML = questionsHTML;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    updateProfileUI(userData) {
        console.log('Updating profile UI with data:', userData);

        // Helper function to safely update element text content
        const setElementText = (id, value, defaultValue = 'N/A') => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || defaultValue;
                console.log(`Updated ${id} with value:`, value || defaultValue);
            } else {
                console.log(`Element ${id} not found`);
            }
        };

        // Helper function to safely update element src attribute
        const setElementSrc = (id, value, defaultValue) => {
            const element = document.getElementById(id);
            if (element) {
                element.src = value || defaultValue;
                console.log(`Updated ${id} src with:`, value || defaultValue);
            } else {
                console.log(`Element ${id} not found`);
            }
        };

        // Show/hide edit button based on profile ownership
        const editBtn = document.getElementById('editProfileBtn');
        const currentUser = AdminAuth.getCurrentUser();
        
        if (editBtn && currentUser) {
            const isOwnProfile = currentUser.id === userData._id;
            editBtn.style.display = isOwnProfile ? 'inline-flex' : 'none';
        }

        // Update profile information
        setElementText('userName', userData.name);
        setElementText('userRole', this.formatRole(userData.role));
        setElementText('userEmail', userData.email);
        setElementText('userBio', userData.bio, 'No bio added yet.');
        setElementText('userCollege', userData.college, 'Not specified');
        setElementText('userMajor', userData.major, 'Not specified');
        setElementText('userGradYear', userData.graduationYear, 'Not specified');

        // Update avatar
        setElementSrc('userAvatar', userData.avatar, '../assets/default-avatar.png');

        // Handle interested colleges for prospective students
        const interestedCollegesContainer = document.getElementById('interestedCollegesContainer');
        if (interestedCollegesContainer) {
            if (userData.role === 'prospective_student' && userData.interestedColleges?.length) {
                interestedCollegesContainer.style.display = 'block';
                setElementText('userInterestedColleges', userData.interestedColleges.join(', '));
            } else {
                interestedCollegesContainer.style.display = 'none';
            }
        }

        // Update stats if available
        setElementText('questionsCount', userData.stats?.questions || '0');
        setElementText('answersCount', userData.stats?.answers || '0');
        setElementText('upvotesCount', userData.stats?.upvotes || '0');
        setElementText('reputationPoints', userData.stats?.reputation || '0');
    }

    showEditModal() {
        if (!this.editModal || !this.userData) return;

        // Populate form with current data
        const bio = document.getElementById('editBio');
        const college = document.getElementById('editCollege');
        const major = document.getElementById('editMajor');
        const gradYear = document.getElementById('editGradYear');
        const avatarPreview = document.getElementById('avatarPreview');

        // Set current values
        if (bio) bio.value = this.userData.bio || '';
        if (college) college.value = this.userData.college || '';
        if (major) major.value = this.userData.major || '';
        if (gradYear) gradYear.value = this.userData.graduationYear || '';
        if (avatarPreview) avatarPreview.src = this.userData.avatar || '../assets/default-avatar.png';

        // Update character count
        if (bio) this.updateCharCount(bio);

        // Show modal
        this.editModal.classList.remove('hidden');
        this.editModal.classList.add('show');
        
        // Store current scroll position
        this.scrollPosition = window.pageYOffset;
        
        // Add class to body instead of setting overflow directly
        document.body.classList.add('modal-open');
    }

    hideEditModal() {
        if (!this.editModal) return;

        // Hide modal
        this.editModal.classList.remove('show');
        this.editModal.classList.add('hidden');
        
        // Remove class from body
        document.body.classList.remove('modal-open');
        
        // Restore scroll position
        window.scrollTo(0, this.scrollPosition || 0);

        // Reset form
        if (this.editForm) {
            this.editForm.reset();
            this.avatarFile = null;
        }
    }

    updateCharCount(textarea) {
        const charCount = document.getElementById('bioCharCount');
        if (charCount) {
            const length = textarea.value.length;
            charCount.textContent = length;
            
            // Update color based on length
            if (length > 450) {
                charCount.style.color = '#dc3545';
            } else if (length > 400) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = '#6c757d';
            }
        }
    }

    validateGradYear(input) {
        const year = parseInt(input.value);
        const currentYear = new Date().getFullYear();
        
        if (year < currentYear) {
            input.setCustomValidity('Graduation year must be in the future');
        } else if (year > currentYear + 6) {
            input.setCustomValidity('Graduation year must be within 6 years');
        } else {
            input.setCustomValidity('');
        }
    }

    async handleAvatarChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            this.showNotification('error', 'Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('error', 'Image size should be less than 5MB');
            return;
        }

        try {
            // Show preview
            const preview = document.getElementById('avatarPreview');
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (preview) {
                    preview.src = e.target.result;
                }
            };
            
            reader.readAsDataURL(file);

            // Store the file for form submission
            this.avatarFile = file;
        } catch (error) {
            console.error('Error handling avatar:', error);
            this.showNotification('error', 'Failed to process image');
        }
    }

    removeAvatar() {
        const preview = document.getElementById('avatarPreview');
        if (preview) {
            preview.src = '../assets/default-avatar.png';
        }
        this.avatarFile = null;
        
        // Reset file input
        const avatarInput = document.getElementById('editAvatar');
        if (avatarInput) {
            avatarInput.value = '';
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Show loading state
            const submitButton = e.target.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            
            // Get form data
            const jsonData = {
                bio: document.getElementById('editBio').value.trim(),
                college: document.getElementById('editCollege').value.trim(),
                major: document.getElementById('editMajor').value.trim(),
                graduationYear: document.getElementById('editGradYear').value.trim()
            };

            // Ensure we have the complete user ID
            const userId = this.userData._id;
            console.log('Current user data:', this.userData);
            console.log('Sending update with data:', jsonData);

            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            // Log response for debugging
            console.log('Server response status:', response.status);
            const responseText = await response.text();
            console.log('Raw server response:', responseText);

            // Try to parse the response
            let updatedUser;
            try {
                updatedUser = JSON.parse(responseText);
                console.log('Parsed server response:', updatedUser);
            } catch (e) {
                console.error('Failed to parse server response:', e);
                throw new Error('Invalid server response');
            }

            if (!response.ok) {
                throw new Error(updatedUser.message || 'Failed to update profile');
            }

            // Update local user data
            this.userData = updatedUser;
            
            // Update UI
            console.log('Updating UI with new data:', updatedUser);
            this.updateProfileUI(updatedUser);
            
            // Hide modal
            this.hideEditModal();

            // Show success message
            this.showNotification('success', 'Profile updated successfully');

        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('error', error.message || 'Failed to update profile');
        } finally {
            // Reset submit button state
            const submitButton = e.target.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            }
        }
    }

    showNotification(type, message) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    formatRole(role) {
        if (!role) return 'Student';
        
        switch (role) {
            case 'current_student':
                return 'Current Student';
            case 'prospective_student':
                return 'Prospective Student';
            case 'admin':
                return 'Administrator';
            default:
                return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}