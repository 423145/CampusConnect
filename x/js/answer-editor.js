document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const replyBtn = document.getElementById('replyBtn');
    const shareBtn = document.getElementById('shareBtn');
    
    // Initialize SimpleMDE
    const simplemde = new SimpleMDE({
        element: document.getElementById('answerEditor'),
        spellChecker: true,
        autosave: {
            enabled: true,
            uniqueId: 'answerDraft',
            delay: 1000,
        },
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ]
    });

    // Get question ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('id');

    // Load question details
    loadQuestionDetails(questionId);

    // Preview button functionality
    const previewBtn = document.getElementById('previewBtn');
    const answerEditor = document.querySelector('.answer-editor');
    const answerPreview = document.querySelector('.answer-preview');
    const previewContent = document.getElementById('previewContent');
    const editAnswerBtn = document.getElementById('editAnswer');

    previewBtn.addEventListener('click', function() {
        const markdown = simplemde.value();
        previewContent.innerHTML = simplemde.markdown(markdown);
        answerEditor.style.display = 'none';
        answerPreview.style.display = 'block';
    });

    editAnswerBtn.addEventListener('click', function() {
        answerEditor.style.display = 'block';
        answerPreview.style.display = 'none';
    });

    // Handle reply button click
    replyBtn.addEventListener('click', function() {
        // Scroll to answer editor
        const answerEditor = document.querySelector('.answer-editor');
        answerEditor.scrollIntoView({ behavior: 'smooth' });
        // Focus on the editor
        simplemde.codemirror.focus();
    });

    // Handle share button click
    shareBtn.addEventListener('click', function() {
        // Get current URL
        const url = window.location.href;
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        // Select and copy the URL
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        // Show feedback
        alert('Link copied to clipboard!');
    });

    // Submit answer
    const submitBtn = document.getElementById('submitAnswer');
    submitBtn.addEventListener('click', submitAnswer);

    async function loadQuestionDetails(questionId) {
        try {
            // Fetch question details from your backend
            const response = await fetch(`/api/questions/${questionId}`);
            const question = await response.json();

            // Update the UI with question details
            document.getElementById('questionTitle').textContent = question.title;
            document.getElementById('questionCollege').textContent = question.college;
            document.getElementById('questionTime').textContent = formatDate(question.createdAt);
            document.getElementById('questionContent').textContent = question.content;
        } catch (error) {
            console.error('Error loading question details:', error);
            // Handle error (show error message to user)
        }
    }

    async function submitAnswer() {
        const content = simplemde.value();
        if (!content.trim()) {
            alert('Please write an answer before submitting.');
            return;
        }

        try {
            const response = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    questionId: questionId
                })
            });

            if (response.ok) {
                // Redirect to question detail page after successful submission
                window.location.href = `question-detail.html?id=${questionId}`;
            } else {
                throw new Error('Failed to submit answer');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer. Please try again.');
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
})