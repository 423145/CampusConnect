// Wrap everything in an IIFE to ensure proper scoping
(function() {
    // API Configuration
    const API_BASE_URL = 'http://localhost:3000';

// Update header based on authentication status
document.addEventListener('DOMContentLoaded', function() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const headerAvatar = document.getElementById('headerAvatar');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        // Hide auth buttons and show user menu
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        
        // Update user avatar or show initials
        if (headerAvatar && currentUser.avatar) {
            headerAvatar.src = currentUser.avatar;
            headerAvatar.alt = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`.trim();
        } else if (headerAvatar) {
            // Create canvas for initial avatar
            const canvas = document.createElement('canvas');
            canvas.width = 40;
            canvas.height = 40;
            const ctx = canvas.getContext('2d');
            
            // Draw circle background
            ctx.fillStyle = '#4A90E2';
            ctx.beginPath();
            ctx.arc(20, 20, 20, 0, Math.PI * 2, true);
            ctx.fill();
            
            // Draw initial
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const initial = (currentUser.firstName || currentUser.name || 'U').charAt(0).toUpperCase();
            ctx.fillText(initial, 20, 20);
            
            // Set canvas as avatar source
            headerAvatar.src = canvas.toDataURL();
            headerAvatar.alt = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`.trim();
        }

        // Add click handler for avatar container
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar && dropdownMenu) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none';
            } else {
                dropdownMenu.style.display = 'block';
            }
        });
        }

        // Close dropdown when clicking outside
        if (userMenu && dropdownMenu) {
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });
        }

        // Handle profile link click
        const profileLinks = document.querySelectorAll('.dropdown-item');
        profileLinks.forEach(link => {
            if (link.textContent.trim() === 'My Profile') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const userId = currentUser._id || currentUser.id;
                    console.log('Navigating to profile with ID:', userId);
                    window.location.href = `pages/profile.html?id=${userId}`;
                });
            }
        });

        // Handle notifications link click
        const notificationsLink = document.querySelector('.dropdown-item[href="pages/notifications.html"]');
        if (notificationsLink) {
            notificationsLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'pages/notifications.html';
            });
        }
        
        // Handle logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            window.location.href = 'pages/login.html';
        });
        }

        // Debug: Log current user data
        console.log('Current user:', currentUser);
    } else {
        // Show auth buttons and hide user menu
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }
});

// Search functionality
const searchInput = document.querySelector('.search-container input');
const searchButton = document.querySelector('.search-container button');

if (searchInput && searchButton) {
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `pages/search-results.html?q=${encodeURIComponent(query)}`;
        }
    });

    // Allow search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}

    // Load trending questions
    async function loadTrendingQuestions() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/questions/trending`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch trending questions');
            }
        const trendingQuestions = await response.json();

            const trendingContainer = document.querySelector('.trending-questions');
            if (!trendingContainer) return;

            if (!Array.isArray(trendingQuestions) || trendingQuestions.length === 0) {
                trendingContainer.innerHTML = '<p class="no-data">No trending questions available</p>';
                return;
            }

            trendingContainer.innerHTML = trendingQuestions.map(question => `
                <div class="question-card">
                    <h3>${question.title}</h3>
                    <p>${question.content.substring(0, 100)}${question.content.length > 100 ? '...' : ''}</p>
                        <div class="question-meta">
                        <span><i class="fas fa-eye"></i> ${question.views}</span>
                        <span><i class="fas fa-thumbs-up"></i> ${question.upvotes}</span>
                        <span><i class="fas fa-user"></i> ${question.author.name}</span>
                    </div>
                    <div class="question-footer">
                        <span class="posted-time">${formatDate(question.createdAt)}</span>
                        <a href="pages/question-details.html?id=${question._id}" class="view-more">View More</a>
                    </div>
                </div>
            `).join('');
    } catch (error) {
        console.error('Error loading trending questions:', error);
            const trendingContainer = document.querySelector('.trending-questions');
            if (trendingContainer) {
                trendingContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${error.message || 'Failed to load trending questions'}</p>
                    </div>
                `;
    }
        }
    }

    // Load popular colleges
    async function loadPopularColleges() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/colleges`);
            if (!response.ok) {
                throw new Error('Failed to fetch colleges');
            }
            const colleges = await response.json();
            
            const collegesContainer = document.querySelector('.colleges-container');
            if (!collegesContainer) {
                console.error('Colleges container not found');
                return;
            }

            if (!Array.isArray(colleges) || colleges.length === 0) {
                collegesContainer.innerHTML = '<p class="no-data">No colleges available</p>';
                return;
            }

            collegesContainer.innerHTML = colleges.map(college => `
            <div class="college-card">
                    <div class="college-info">
                        <h3>${college.name || 'Unnamed College'}</h3>
                        <p class="location"><i class="fas fa-map-marker-alt"></i> ${college.location || 'Location not specified'}</p>
                        <p class="type"><i class="fas fa-university"></i> ${(college.type || 'UNKNOWN').toUpperCase()}</p>
                        <p class="email"><i class="fas fa-envelope"></i> ${college.contact?.email || 'Email not available'}</p>
                        <a href="pages/college-details.html?id=${college._id}" class="view-details">View Details</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
            console.error('Error loading colleges:', error);
            const collegesContainer = document.querySelector('.colleges-container');
            if (collegesContainer) {
                collegesContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        <p>${error.message || 'Failed to load colleges'}</p>
                    </div>
                `;
    }
        }
    }

// Format date helper function
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted on ${date.toLocaleDateString()}`;
};

// Initialize content based on page
document.addEventListener('DOMContentLoaded', () => {
    // Load trending questions on all pages
    loadTrendingQuestions();
    
    // Load colleges only on homepage
    if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
        loadPopularColleges();
    }
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .question-card, .college-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
};

// Run animation on page load
window.addEventListener('load', animateOnScroll);
})();