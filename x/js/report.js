// Report Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html?redirect=report.html' + window.location.search;
        return;
    }
    
    // Get elements
    const reportContent = document.getElementById('reportContent');
    const reportForm = document.getElementById('reportForm');
    const reportSuccess = document.getElementById('reportSuccess');
    const cancelReport = document.getElementById('cancelReport');
    const returnButton = document.getElementById('returnButton');
    
    // Get content ID and type from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');
    const contentType = urlParams.get('type');
    const returnUrl = urlParams.get('return') || '../index.html';
    
    // Set return URL for cancel button
    cancelReport.href = returnUrl;
    returnButton.href = returnUrl;
    
    // Load content to be reported
    loadReportContent(contentId, contentType);
    
    // Handle form submission
    reportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const reportReason = document.getElementById('reportReason').value;
        const reportDetails = document.getElementById('reportDetails').value;
        const blockUser = document.getElementById('blockUser').checked;
        
        // Create report object
        const report = {
            id: Date.now(),
            contentId,
            contentType,
            reason: reportReason,
            details: reportDetails,
            reportedBy: currentUser.id,
            reportedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        // Save report to localStorage
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        reports.push(report);
        localStorage.setItem('reports', JSON.stringify(reports));
        
        // Block user if requested
        if (blockUser && contentType === 'user') {
            const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '{}');
            
            if (!blockedUsers[currentUser.id]) {
                blockedUsers[currentUser.id] = [];
            }
            
            if (!blockedUsers[currentUser.id].includes(contentId)) {
                blockedUsers[currentUser.id].push(contentId);
                localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
            }
        }
        
        // Show success message
        reportForm.style.display = 'none';
        reportSuccess.style.display = 'block';
    });
    
    // Function to load content to be reported
    function loadReportContent(id, type) {
        if (!id || !type) {
            reportContent.innerHTML = '<p>No content specified for reporting.</p>';
            return;
        }
        
        switch (type) {
            case 'question':
                loadQuestionContent(id);
                break;
            case 'answer':
                loadAnswerContent(id);
                break;
            case 'comment':
                loadCommentContent(id);
                break;
            case 'user':
                loadUserContent(id);
                break;
            default:
                reportContent.innerHTML = '<p>Invalid content type specified.</p>';
        }
    }
    
    // Function to load question content
    function loadQuestionContent(id) {
        // Get questions from localStorage
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        const question = questions.find(q => q.id == id);
        
        if (!question) {
            reportContent.innerHTML = '<p>Question not found.</p>';
            return;
        }
        
        // Get user info
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === question.userId) || {
            name: 'Anonymous User'
        };
        
        // Render question content
        reportContent.innerHTML = `
            <div class="content-type">Question</div>
            <h2 class="content-title">${question.title}</h2>
            <p class="content-text">${question.content}</p>
            <div class="content-meta">
                <span>Posted by ${user.name}</span>
                <span>${formatDate(question.createdAt)}</span>
            </div>
        `;
    }
    
    // Function to load answer content
    function loadAnswerContent(id) {
        // Get questions from localStorage
        const questions = JSON.parse(localStorage.getItem('questions') || '[]');
        let answer = null;
        let question = null;
        
        // Find the answer and its parent question
        for (const q of questions) {
            if (q.answers) {
                const foundAnswer = q.answers.find(a => a.id == id);
                if (foundAnswer) {
                    answer = foundAnswer;
                    question = q;
                    break;
                }
            }
        }
        
        if (!answer || !question) {
            reportContent.innerHTML = '<p>Answer not found.</p>';
            return;
        }
        
        // Get user info
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === answer.userId) || {
            name: 'Anonymous User'
        };
        
        // Render answer content
        reportContent.innerHTML = `
            <div class="content-type">Answer</div>
            <h2 class="content-title">Answer to: ${question.title}</h2>
            <p class="content-text">${answer.content}</p>
            <div class="content-meta">
                <span>Posted by ${user.name}</span>
                <span>${formatDate(answer.createdAt)}</span>
            </div>
        `;
    }
    
    // Function to load comment content
    function loadCommentContent(id) {
        // Get comments from localStorage
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        const comment = comments.find(c => c.id == id);
        
        if (!comment) {
            reportContent.innerHTML = '<p>Comment not found.</p>';
            return;
        }
        
        // Get user info
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id === comment.userId) || {
            name: 'Anonymous User'
        };
        
        // Render comment content
        reportContent.innerHTML = `
            <div class="content-type">Comment</div>
            <p class="content-text">${comment.content}</p>
            <div class="content-meta">
                <span>Posted by ${user.name}</span>
                <span>${formatDate(comment.createdAt)}</span>
            </div>
        `;
    }
    
    // Function to load user content
    function loadUserContent(id) {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id == id);
        
        if (!user) {
            reportContent.innerHTML = '<p>User not found.</p>';
            return;
        }
        
        // Render user content
        reportContent.innerHTML = `
            <div class="content-type">User</div>
            <h2 class="content-title">${user.name}</h2>
            <p class="content-text">${user.bio || 'No bio available.'}</p>
            <div class="content-meta">
                <span>Member since ${formatDate(user.createdAt)}</span>
                <span>Role: ${user.role}</span>
            </div>
        `;
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
});