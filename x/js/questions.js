// Questions Page Functionality
const API_BASE_URL = 'http://localhost:3000';
console.log('API base URL:', API_BASE_URL);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Questions page loaded');

    // Get DOM elements
    const questionsList = document.getElementById('questions-list');
    const questionsCount = document.getElementById('questions-count');

    // ===== AUTHENTICATION STATUS =====
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userMenu').style.display = 'flex';
        
        // Get user info
        fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(user => {
            if (user.avatar) {
                document.getElementById('headerAvatar').src = user.avatar;
            }
        })
        .catch(error => console.error('Error fetching user:', error));
    } else {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userMenu').style.display = 'none';
    }

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '../index.html';
    });

    // ===== QUESTIONS FUNCTIONALITY =====
    // Format date function
    function formatDate(date) {
        const d = new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return 'just now';
        } else if (diffMin < 60) {
            return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        } else if (diffHour < 24) {
            return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
        } else if (diffDay < 7) {
            return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
        } else {
            return d.toLocaleDateString();
        }
    }

    // ===== FETCH & DISPLAY QUESTIONS =====
    // Fetch questions from server
    async function fetchQuestions() {
        try {
            questionsList.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Loading questions...</p>
                </div>
            `;

            console.log('Fetching questions from:', `${API_BASE_URL}/api/questions`);
            
            // Add more detailed request configuration
            const response = await fetch(`${API_BASE_URL}/api/questions?sort=createdAt&order=desc`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // Include credentials to handle potential CORS issues
                credentials: 'same-origin'
            });
            
            console.log('Response received:', response);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Server error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Questions data:', data);
            
            return data;
        } catch (error) {
            console.error('Error fetching questions:', error);
            console.error('Error details:', error.stack);
            
            questionsList.innerHTML = `
                <div class="error-message" style="color: red; padding: 20px; text-align: center;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading questions: ${error.message}</p>
                    <p>Make sure your server is running at ${API_BASE_URL}</p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
            return null;
        }
    }

    // Display questions
    function displayQuestions(data) {
        if (!data || !data.questions || data.questions.length === 0) {
            questionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-question-circle"></i>
                    <h3>No questions found</h3>
                    <p>Be the first to ask a question!</p>
                    <a href="ask-question.html" class="btn btn-primary">Ask a Question</a>
                </div>
            `;
            if (questionsCount) questionsCount.textContent = '0';
            return;
        }
        
        // Update question count
        if (questionsCount) questionsCount.textContent = data.total || data.questions.length;
        
        // Clear questions list
        questionsList.innerHTML = '';
        
        // Loop through questions and display them
        data.questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item';
            
            // Handle missing data safely
            const title = question.title || 'Untitled Question';
            const content = question.content || 'No content';
            const id = question._id || '';
            const createdAt = question.createdAt ? formatDate(question.createdAt) : 'Unknown date';
            const tags = Array.isArray(question.tags) ? question.tags : [];
            const votes = question.votes || 0;
            const views = question.views || 0;
            const answers = question.answers ? question.answers.length : 0;
            
            // Handle author information
            let authorName = 'Anonymous';
            let authorId = '';
            if (question.author) {
                if (typeof question.author === 'object') {
                    authorName = question.author.name || 'Anonymous';
                    authorId = question.author._id;
                } else {
                    authorId = question.author;
                }
            }
            
            questionElement.innerHTML = `
                <div class="question-stats">
                    <div class="stat">
                        <div class="stat-number">${votes}</div>
                        <div class="stat-label">votes</div>
                    </div>
                    <div class="stat">
                        <div class="stat-number">${views}</div>
                        <div class="stat-label">views</div>
                    </div>
                </div>
                <div class="question-content">
                    <h3 class="question-title">
                        <a href="question-detail.html?id=${id}">${title}</a>
                    </h3>
                    <p class="question-excerpt">${content.substring(0, 200)}${content.length > 200 ? '...' : ''}</p>
                    <div class="question-meta">
                        <div class="question-tags">
                            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="question-info">
                            <span class="question-author">
                                <a href="profile.html?id=${authorId}">${authorName}</a>
                            </span>
                            <span class="question-time">${createdAt}</span>
                        </div>
                    </div>
                </div>
            `;
            
            questionsList.appendChild(questionElement);
        });
    }

    // Load questions function
    async function loadQuestions() {
        const data = await fetchQuestions();
        if (data) {
            displayQuestions(data);
        }
    }

    // Initialize the page
    loadQuestions();
});