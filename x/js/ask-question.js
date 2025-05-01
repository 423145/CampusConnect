// Ask Question Page Functionality

const API_BASE_URL = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ask Question page loaded');

    // Check if user is logged in
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize form elements
    const questionForm = document.getElementById('ask-question-form');
    const titleInput = document.getElementById('question-title');
    const contentInput = document.getElementById('question-content');
    const questionTags = document.getElementById('question-tags');
    const questionCollege = document.getElementById('question-college');
    const previewTitle = document.querySelector('.preview-title');
    const previewContent = document.querySelector('.preview-content');
    const previewTags = document.querySelector('.preview-tags');
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);

    // Handle form submission
    questionForm.addEventListener('submit', async function(e) {
        try {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Prevent default form submission
            e.preventDefault();

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('You must be logged in to post a question');
            }

            const questionData = {
                title: titleInput.value.trim(),
                content: contentInput.value.trim(),
                tags: questionTags.value.trim(),
                college: questionCollege.value.trim()
            };

            console.log('Sending question data:', questionData);

            const response = await fetch(`${API_BASE_URL}/api/questions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(questionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to post question');
            }

            const data = await response.json();
            console.log('Question created:', data);

            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;

            // Show success message
            showNotification('Question posted successfully!', 'success');
            
            // Redirect to questions page after 2 seconds
            setTimeout(() => {
                window.location.href = 'questions.html';
            }, 2000);

        } catch (error) {
            console.error('Error posting question:', error);
            showNotification(error.message || 'Error posting question. Please try again.', 'error');
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = submitButton.dataset.originalText || 'Post Your Question';
            submitButton.disabled = false;
        }
    });

    // Live preview functionality
    function updatePreview() {
        // Update title preview
        previewTitle.textContent = titleInput.value || 'Your question title will appear here';
        
        // Update content preview
        previewContent.textContent = contentInput.value || 'Your question details will appear here';
        
        // Update tags preview
        const tags = questionTags.value.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        
        if (tags.length > 0) {
            previewTags.innerHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        } else {
            previewTags.innerHTML = '';
        }
    }

    titleInput.addEventListener('input', updatePreview);
    contentInput.addEventListener('input', updatePreview);
    questionTags.addEventListener('input', updatePreview);

    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                       type === 'error' ? 'fa-exclamation-circle' : 
                       'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});