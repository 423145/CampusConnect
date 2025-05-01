// Profile Initialization Module

const PROFILE_INIT = {
    // Initialize profile data
    async initializeProfile(userId) {
        try {
            const userData = await this.fetchUserData(userId);
            if (!userData) {
                throw new Error('Failed to fetch user data');
            }
            
            await this.displayUserData(userData);
            await this.initializeTabs(userData);
            
            // Show/hide edit button based on ownership
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const isOwnProfile = currentUser && (currentUser.id === userId || currentUser._id === userId);
            const editButton = document.querySelector('.edit-profile-btn');
            if (editButton) {
                editButton.style.display = isOwnProfile ? 'block' : 'none';
            }

            return userData;
        } catch (error) {
            console.error('Error in profile initialization:', error);
            throw error;
        }
    },

    // Fetch user data from API or localStorage
    async fetchUserData(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data from API');
            }

            const userData = await response.json();
            return {
                ...userData,
                stats: await this.fetchUserStats(userId)
            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },

    async fetchUserStats(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/stats`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return {
                questionsCount: 0,
                answersCount: 0,
                upvotesReceived: 0,
                reputation: 0
            };
        }
    },

    // Display user data in the profile
    async displayUserData(userData) {
        // Update profile elements
        const nameElement = document.querySelector('.profile-name');
        if (nameElement) nameElement.textContent = userData.name || 'Anonymous User';

        const emailElement = document.querySelector('.profile-email');
        if (emailElement) emailElement.textContent = userData.email || '';

        const bioElement = document.querySelector('.profile-bio');
        if (bioElement) bioElement.textContent = userData.bio || 'No bio available';

        // Role-specific information
        if (userData.role === 'verified_student') {
            const collegeElement = document.querySelector('.profile-college');
            if (collegeElement) collegeElement.textContent = userData.college || 'College not specified';

            const majorElement = document.querySelector('.profile-major');
            if (majorElement) majorElement.textContent = userData.major || 'Major not specified';

            const yearElement = document.querySelector('.profile-year');
            if (yearElement) yearElement.textContent = userData.graduationYear || 'Year not specified';

            // Show verified student badge
            const verifiedBadge = document.querySelector('.verified-badge');
            if (verifiedBadge) {
                verifiedBadge.style.display = 'inline-flex';
                verifiedBadge.innerHTML = '<i class="fas fa-check-circle"></i> Verified Student';
            }
        } else if (userData.role === 'prospective_student') {
            const interestedCollegesElement = document.querySelector('.profile-interested-colleges');
            if (interestedCollegesElement) {
                const colleges = userData.interestedColleges || [];
                interestedCollegesElement.textContent = colleges.length > 0 
                    ? `Interested in: ${colleges.join(', ')}` 
                    : 'No colleges specified';
            }
        }

        // Update avatar
        const avatarElement = document.querySelector('.profile-avatar');
        if (avatarElement) {
            avatarElement.src = userData.avatar || 'assets/default-avatar.png';
            avatarElement.alt = userData.name || 'Profile Avatar';
        }

        // Update statistics
        const statsContainer = document.querySelector('.profile-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stat">
                    <span class="stat-value">${userData.stats?.questionsCount || 0}</span>
                    <span class="stat-label">Questions</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${userData.stats?.answersCount || 0}</span>
                    <span class="stat-label">Answers</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${userData.stats?.upvotesReceived || 0}</span>
                    <span class="stat-label">Upvotes</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${userData.stats?.reputation || 0}</span>
                    <span class="stat-label">Reputation</span>
                </div>
            `;
        }

        // Initialize settings form if it exists
        const settingsForm = document.querySelector('.settings-form');
        if (settingsForm) {
            const emailInput = settingsForm.querySelector('input[name="email"]');
            const nameInput = settingsForm.querySelector('input[name="name"]');
            const bioInput = settingsForm.querySelector('textarea[name="bio"]');
            const collegeInput = settingsForm.querySelector('input[name="college"]');
            const majorInput = settingsForm.querySelector('input[name="major"]');
            const yearInput = settingsForm.querySelector('input[name="graduationYear"]');
            const interestedCollegesInput = settingsForm.querySelector('textarea[name="interestedColleges"]');

            if (emailInput) emailInput.value = userData.email || '';
            if (nameInput) nameInput.value = userData.name || '';
            if (bioInput) bioInput.value = userData.bio || '';
            
            if (userData.role === 'verified_student') {
                if (collegeInput) collegeInput.value = userData.college || '';
                if (majorInput) majorInput.value = userData.major || '';
                if (yearInput) yearInput.value = userData.graduationYear || '';
            } else if (userData.role === 'prospective_student' && interestedCollegesInput) {
                interestedCollegesInput.value = (userData.interestedColleges || []).join(', ');
            }
        }
    },

    // Configure profile sections based on user role
    configureProfileByRole(role) {
        const collegeInfoSection = document.querySelector('.settings-section:nth-child(2)');
        const interestedCollegesField = document.getElementById('interestedColleges');
        const verifiedStudentFields = document.querySelectorAll('.verified-student-field');
        const prospectiveStudentFields = document.querySelectorAll('.prospective-student-field');

        switch (role) {
            case 'verified_student':
                // Show college info section with all fields
                if (collegeInfoSection) {
                    collegeInfoSection.style.display = 'block';
                    collegeInfoSection.querySelector('h3').textContent = 'College Information';
                }
                // Show verified student specific fields
                verifiedStudentFields.forEach(field => field.style.display = 'block');
                // Hide prospective student fields
                prospectiveStudentFields.forEach(field => field.style.display = 'none');
                // Hide interested colleges field
                if (interestedCollegesField) {
                    interestedCollegesField.closest('.form-group').style.display = 'none';
                }
                break;

            case 'prospective_student':
                // Show college info section with limited fields
                if (collegeInfoSection) {
                    collegeInfoSection.style.display = 'block';
                    collegeInfoSection.querySelector('h3').textContent = 'College Preferences';
                }
                // Hide verified student specific fields
                verifiedStudentFields.forEach(field => field.style.display = 'none');
                // Show prospective student fields
                prospectiveStudentFields.forEach(field => field.style.display = 'block');
                // Show interested colleges field
                if (interestedCollegesField) {
                    interestedCollegesField.closest('.form-group').style.display = 'block';
                }
                break;

            case 'admin':
                // Hide college related sections for admin
                if (collegeInfoSection) {
                    collegeInfoSection.style.display = 'none';
                }
                // Hide both student-specific fields
                verifiedStudentFields.forEach(field => field.style.display = 'none');
                prospectiveStudentFields.forEach(field => field.style.display = 'none');
                break;

            default:
                console.warn('Unknown user role:', role);
                break;
        }
    },

    // Initialize tab switching
    async initializeTabs(userData) {
        const tabs = document.querySelectorAll('.profile-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const contentId = tab.getAttribute('data-tab');
                document.getElementById(contentId).classList.add('active');
            });
        });

        // Load initial tab content
        await this.loadTabContent(userData);
    },

    async loadTabContent(userData) {
        try {
            const [activities, questions, answers, bookmarks] = await Promise.all([
                this.fetchActivities(userData.id || userData._id),
                this.fetchQuestions(userData.id || userData._id),
                this.fetchAnswers(userData.id || userData._id),
                this.fetchBookmarks(userData.id || userData._id)
            ]);

            this.displayActivities(activities);
            this.displayQuestions(questions);
            this.displayAnswers(answers);
            this.displayBookmarks(bookmarks);
        } catch (error) {
            console.error('Error loading tab content:', error);
        }
    },

    async fetchActivities(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/activities`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error fetching activities:', error);
            return [];
        }
    },

    async fetchQuestions(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/questions`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error fetching questions:', error);
            return [];
        }
    },

    async fetchAnswers(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/answers`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error fetching answers:', error);
            return [];
        }
    },

    async fetchBookmarks(userId) {
        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}/bookmarks`);
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            return [];
        }
    },

    displayActivities(activities) {
        const container = document.querySelector('#activities .activity-list');
        if (!container) return;

        if (!activities.length) {
            container.innerHTML = '<p class="no-content">No recent activities</p>';
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <span class="activity-date">${new Date(activity.date).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    },

    displayQuestions(questions) {
        const container = document.querySelector('#questions .questions-list');
        if (!container) return;

        if (!questions.length) {
            container.innerHTML = '<p class="no-content">No questions asked yet</p>';
            return;
        }

        container.innerHTML = questions.map(question => `
            <div class="question-item">
                <h3><a href="question.html?id=${question.id}">${question.title}</a></h3>
                <p>${question.description.substring(0, 150)}...</p>
                <div class="question-meta">
                    <span>${question.votes} votes</span>
                    <span>${question.answers} answers</span>
                    <span>${new Date(question.date).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    },

    displayAnswers(answers) {
        const container = document.querySelector('#answers .answers-list');
        if (!container) return;

        if (!answers.length) {
            container.innerHTML = '<p class="no-content">No answers provided yet</p>';
            return;
        }

        container.innerHTML = answers.map(answer => `
            <div class="answer-item">
                <p>${answer.content.substring(0, 150)}...</p>
                <div class="answer-meta">
                    <span>${answer.votes} votes</span>
                    <a href="question.html?id=${answer.questionId}">View Question</a>
                    <span>${new Date(answer.date).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    },

    displayBookmarks(bookmarks) {
        const container = document.querySelector('#bookmarks .bookmarks-list');
        if (!container) return;

        if (!bookmarks.length) {
            container.innerHTML = '<p class="no-content">No bookmarks saved yet</p>';
            return;
        }

        container.innerHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item">
                <h3><a href="question.html?id=${bookmark.questionId}">${bookmark.title}</a></h3>
                <p>${bookmark.description.substring(0, 150)}...</p>
                <span class="bookmark-date">Saved on ${new Date(bookmark.savedDate).toLocaleDateString()}</span>
            </div>
        `).join('');
    },

    // Initialize settings form
    initializeSettingsForm(userData) {
        // Personal Information
        document.getElementById('fullName').value = userData.name || '';
        document.getElementById('email').value = userData.email || '';
        document.getElementById('bio').value = userData.bio || '';

        // College Information based on role
        if (userData.role === 'verified_student') {
            document.getElementById('college').value = userData.college || '';
            document.getElementById('course').value = userData.major || '';
            document.getElementById('year').value = userData.graduationYear || '';
        } else if (userData.role === 'prospective_student' && userData.interestedColleges) {
            const interestedColleges = document.getElementById('interestedColleges');
            if (interestedColleges) {
                interestedColleges.value = userData.interestedColleges.join(', ');
            }
        }

        // Notification Preferences
        if (userData.preferences?.notifications) {
            document.getElementById('emailNotifications').checked = userData.preferences.notifications.emailAnswers || false;
            document.getElementById('questionNotifications').checked = userData.preferences.notifications.emailComments || false;
            document.getElementById('commentNotifications').checked = userData.preferences.notifications.emailUpvotes || false;
            document.getElementById('upvoteNotifications').checked = userData.preferences.notifications.emailMentions || false;
        }

        // Add form submission handler
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSettingsSubmit(userData._id, userData.role);
            });
        }

        // Show/hide edit button based on ownership
        const editProfileBtn = document.getElementById('editProfileBtn');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (editProfileBtn && currentUser) {
            editProfileBtn.style.display = userData._id === currentUser._id ? 'block' : 'none';
        }
    },

    // Handle settings form submission
    async handleSettingsSubmit(userId, userRole) {
        try {
            const formData = {
                name: document.getElementById('fullName').value,
                bio: document.getElementById('bio').value,
                preferences: {
                    notifications: {
                        emailAnswers: document.getElementById('emailNotifications').checked,
                        emailComments: document.getElementById('questionNotifications').checked,
                        emailUpvotes: document.getElementById('commentNotifications').checked,
                        emailMentions: document.getElementById('upvoteNotifications').checked
                    }
                }
            };

            // Add role-specific fields
            if (userRole === 'verified_student') {
                formData.college = document.getElementById('college').value;
                formData.major = document.getElementById('course').value;
                formData.graduationYear = document.getElementById('year').value;
            } else if (userRole === 'prospective_student') {
                const interestedColleges = document.getElementById('interestedColleges');
                if (interestedColleges) {
                    formData.interestedColleges = interestedColleges.value
                        .split(',')
                        .map(college => college.trim())
                        .filter(college => college.length > 0);
                }
            }

            // Handle password change if new password is provided
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const currentPassword = document.getElementById('currentPassword').value;

            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error('New passwords do not match');
                }
                if (!currentPassword) {
                    throw new Error('Current password is required to change password');
                }
                formData.currentPassword = currentPassword;
                formData.newPassword = newPassword;
            }

            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success';
            successAlert.textContent = 'Profile updated successfully';
            document.querySelector('.profile-container').prepend(successAlert);

            // Remove success message after 3 seconds
            setTimeout(() => successAlert.remove(), 3000);

        } catch (error) {
            console.error('Error updating profile:', error);
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger';
            errorAlert.textContent = error.message || 'Failed to update profile';
            document.querySelector('.profile-container').prepend(errorAlert);
        }
    },

    // Helper function to get activity icon
    getActivityIcon(type) {
        const icons = {
            question: 'fa-question-circle',
            answer: 'fa-comment-alt',
            upvote: 'fa-arrow-up',
            bookmark: 'fa-bookmark',
            comment: 'fa-comments',
            badge: 'fa-medal'
        };
        return icons[type] || 'fa-circle';
    }
};