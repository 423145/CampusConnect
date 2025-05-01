document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in
    const currentUser = getCurrentUser()
  
    // Get question ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const questionId = urlParams.get("id")
  
    if (!questionId) {
      window.location.href = "questions.html"
      return
    }
  
    // Show/hide answer form based on login status
    if (currentUser) {
      document.getElementById("login-prompt").style.display = "none"
      document.getElementById("answer-form").style.display = "block"
    } else {
      document.getElementById("login-prompt").style.display = "block"
      document.getElementById("answer-form").style.display = "none"
    }
  
    // Load question data
    loadQuestionDetails(questionId)
  
    // Load answers
    loadAnswers(questionId)
  
    // Load related questions
    loadRelatedQuestions(questionId)
  
    // Load hot questions for sidebar
    loadHotQuestions()
  
    // Add event listeners
    setupEventListeners(questionId)
  
    // Fetch and display the report count for the question
    updateQuestionReportCount(questionId)
  })
  
  // Function to get current user from localStorage
  function getCurrentUser() {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  
  // Function to format date
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  // Function to calculate time ago
  function timeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    const diffMonth = Math.floor(diffDay / 30)
    const diffYear = Math.floor(diffMonth / 12)
  
    if (diffYear > 0) {
      return `${diffYear} year${diffYear > 1 ? "s" : ""} ago`
    } else if (diffMonth > 0) {
      return `${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`
    } else if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`
    } else {
      return "just now"
    }
  }
  
  // Function to create avatar element
  function createAvatarElement(user) {
    const avatarDiv = document.createElement("div")
    avatarDiv.className = "author-avatar"
  
    if (user.profilePicture) {
      const img = document.createElement("img")
      img.src = user.profilePicture
      img.alt = user.name
      avatarDiv.appendChild(img)
    } else {
      avatarDiv.textContent = user.name.charAt(0).toUpperCase()
    }
  
    return avatarDiv
  }
  
  // Function to load question details from backend
  async function loadQuestionDetails(questionId) {
    let question = null;
    try {
      const response = await fetch(`http://localhost:3000/api/questions/${questionId}`);
      if (!response.ok) {
        document.getElementById("question-title").textContent = "Question not found";
        return;
      }
      question = await response.json();
    } catch (error) {
      console.error('Error fetching question:', error);
      document.getElementById("question-title").textContent = "Error loading question";
      return;
    }
    // Now update the UI, but catch any DOM errors separately
    try {
      document.title = `${question.title} - College Q&A`;
      document.getElementById("question-title-breadcrumb").textContent = question.title;
      document.getElementById("question-title").textContent = question.title;
      document.getElementById("question-date").textContent = `Asked on: ${formatDate(question.createdAt)}`;
      document.getElementById("question-views").innerHTML = `<i class=\"fas fa-eye\"></i> ${question.views} views`;
      // Update question tags
      const tagsContainer = document.getElementById("question-tags");
      tagsContainer.innerHTML = "";
      (question.tags || []).forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
      // Update question content
      document.getElementById("question-text").innerHTML = question.content;
      document.getElementById("question-vote-count").textContent = question.upvotes || 0;
      // Author info
      const nameLink = document.getElementById('question-author-name');
      if (question.author && question.author.name) {
        nameLink.textContent = question.author.name;
        nameLink.href = `profile.html?id=${question.author._id}`;
      } else {
        nameLink.textContent = 'User';
        nameLink.removeAttribute('href');
      }
      const avatarDiv = document.getElementById('question-author-avatar');
      if (question.author && question.author.avatar) {
        avatarDiv.innerHTML = `<img src="${question.author.avatar}" alt="${question.author.name || 'User'}" style="width:40px;height:40px;border-radius:50%;">`;
      } else {
        avatarDiv.innerHTML = `<img src="../assets/default-avatar.jpg" alt="User" style="width:40px;height:40px;border-radius:50%;">`;
      }
      // Remove or update author role/college if needed
      const roleDiv = document.getElementById('question-author-role');
      if (roleDiv) roleDiv.textContent = question.author && question.author.role ? question.author.role : '';
      const collegeDiv = document.getElementById('question-author-college');
      if (collegeDiv) collegeDiv.textContent = question.college || '';
      // Load comments for this question
      loadQuestionComments(questionId);
    } catch (error) {
      console.error('Error updating question UI:', error);
      // Do not overwrite the title if the data loaded
    }
  }
  
  // Function to load answers from backend
  async function loadAnswers(questionId) {
    const answersContainer = document.getElementById("answers-container");
    answersContainer.innerHTML = "";
    try {
      const response = await fetch(`http://localhost:3000/api/questions/${questionId}/answers`);
      if (!response.ok) {
        answersContainer.innerHTML = '<div class="no-answers">Error loading answers.</div>';
        return;
      }
      const answers = await response.json();
      const answersCount = document.getElementById("answers-count");
      answersCount.textContent = `${answers.length} Answer${answers.length !== 1 ? "s" : ""}`;
      if (answers.length === 0) {
        const noAnswers = document.createElement("div");
        noAnswers.className = "no-answers";
        noAnswers.textContent = "No answers yet. Be the first to answer!";
        answersContainer.appendChild(noAnswers);
        return;
      }
      answers.forEach((answer) => {
        const template = document.getElementById("answer-template");
        const answerElement = document.importNode(template.content, true);
        answerElement.querySelector(".answer-text").innerHTML = answer.content;
        const voteCountSpan = answerElement.querySelector(".vote-count");
        voteCountSpan.textContent = answer.upvotes || 0;
        if (answer.author) {
          const authorAvatar = answerElement.querySelector(".author-avatar");
          authorAvatar.innerHTML = `<img src="${answer.author.avatar || '../assets/default-avatar.jpg'}" alt="${answer.author.name || 'User'}" style="width:32px;height:32px;border-radius:50%;">`;
          answerElement.querySelector(".author-name").textContent = answer.author.name || 'User';
          answerElement.querySelector(".answered-time").textContent = `answered ${timeAgo(answer.createdAt)}`;
        }
        // Voting for answers
        const upvoteBtn = answerElement.querySelector('.upvote-answer-btn');
        const downvoteBtn = answerElement.querySelector('.downvote-answer-btn');
        upvoteBtn.addEventListener('click', () => voteAnswer(answer._id, 1, voteCountSpan));
        downvoteBtn.addEventListener('click', () => voteAnswer(answer._id, -1, voteCountSpan));
        // Comment section for this answer
        const commentsListDiv = answerElement.querySelector('.answer-comments-list');
        loadAnswerComments(answer._id, commentsListDiv);
        // Post comment for this answer
        const commentBtn = answerElement.querySelector('.add-answer-comment');
        const commentTextarea = answerElement.querySelector('.answer-comment-text');
        commentBtn.addEventListener('click', () => {
          postAnswerComment(answer._id, commentTextarea, commentsListDiv);
        });
        answersContainer.appendChild(answerElement);
      });
    } catch (error) {
      answersContainer.innerHTML = '<div class="no-answers">Error loading answers.</div>';
    }
  }
  
  // Function to load question comments
  async function loadQuestionComments(questionId) {
    const commentsContainer = document.getElementById('question-comments-list');
    commentsContainer.innerHTML = '';
    try {
      const response = await fetch(`http://localhost:3000/api/questions/${questionId}/comments`);
      if (!response.ok) {
        commentsContainer.innerHTML = '<div class="no-comments">Error loading comments.</div>';
        return;
      }
      const comments = await response.json();
      if (comments.length === 0) {
        commentsContainer.innerHTML = '<div class="no-comments">No comments yet.</div>';
        return;
      }
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `<span class="comment-author">${comment.author?.name || 'User'}</span>: <span class="comment-content">${comment.content}</span> <span class="comment-time">${timeAgo(comment.createdAt)}</span>`;
        commentsContainer.appendChild(commentDiv);
      });
    } catch (error) {
      commentsContainer.innerHTML = '<div class="no-comments">Error loading comments.</div>';
    }
  }
  
  // Function to load related questions
  async function loadRelatedQuestions(questionId) {
    const relatedQuestionsContainer = document.getElementById("related-questions-list");
    relatedQuestionsContainer.innerHTML = "";
    try {
      // Fetch the current question to get its tags
      const questionRes = await fetch(`http://localhost:3000/api/questions/${questionId}`);
      if (!questionRes.ok) return;
      const question = await questionRes.json();
      const tags = question.tags || [];
      if (tags.length === 0) {
        const noRelated = document.createElement("li");
        noRelated.textContent = "No related questions found.";
        relatedQuestionsContainer.appendChild(noRelated);
        return;
      }
      // Use only the first tag for related questions
      const tag = encodeURIComponent(tags[0]);
      const relatedRes = await fetch(`http://localhost:3000/api/questions?tags=${tag}`);
      if (!relatedRes.ok) return;
      const data = await relatedRes.json();
      // Filter out the current question and ensure tag matches exactly (case-insensitive, trimmed)
      const normalizedTag = tags[0].trim().toLowerCase();
      const relatedQuestions = (data.questions || []).filter(q => {
        // Exclude the current question
        if (q._id && q._id.toString() === questionId.toString()) return false;
        // Ensure the tag matches exactly (case-insensitive, trimmed)
        return (q.tags || []).some(t => t.trim().toLowerCase() === normalizedTag);
      });
      if (relatedQuestions.length === 0) {
        const noRelated = document.createElement("li");
        noRelated.textContent = "No related questions found.";
        relatedQuestionsContainer.appendChild(noRelated);
        return;
      }
      relatedQuestions.forEach((q) => {
        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `question-detail.html?id=${q._id}`;
        link.textContent = q.title;
        listItem.appendChild(link);
        relatedQuestionsContainer.appendChild(listItem);
      });
    } catch (error) {
      const noRelated = document.createElement("li");
      noRelated.textContent = "No related questions found.";
      relatedQuestionsContainer.appendChild(noRelated);
    }
  }
  
  // Function to load hot questions for sidebar
  async function loadHotQuestions() {
    const hotQuestionsContainer = document.getElementById("hot-questions-list");
    hotQuestionsContainer.innerHTML = "";

    try {
      const response = await fetch("http://localhost:3000/api/questions/trending");
      if (!response.ok) throw new Error("Failed to fetch hot questions");
      const hotQuestions = await response.json();

      if (!hotQuestions || hotQuestions.length === 0) {
        const noHot = document.createElement("li");
        noHot.textContent = "No hot questions found.";
        hotQuestionsContainer.appendChild(noHot);
        return;
      }

      hotQuestions.forEach((question) => {
        const listItem = document.createElement("li");

        const link = document.createElement("a");
        link.href = `question-detail.html?id=${question.id || question._id}`;
        link.textContent = question.title;

        const stats = document.createElement("div");
        stats.className = "question-stats";

        const votes = document.createElement("span");
        votes.innerHTML = `<i class=\"fas fa-arrow-up\"></i> ${question.upvotes || 0} votes`;

        const answers = document.createElement("span");
        // Use answers.length if answers is an array, otherwise fallback to 0 or answers count
        let answerCount = 0;
        if (Array.isArray(question.answers)) {
          answerCount = question.answers.length;
        } else if (typeof question.answers === 'number') {
          answerCount = question.answers;
        }
        answers.innerHTML = `<i class=\"fas fa-comment\"></i> ${answerCount} answers`;

        stats.appendChild(votes);
        stats.appendChild(answers);

        listItem.appendChild(link);
        listItem.appendChild(stats);
        hotQuestionsContainer.appendChild(listItem);
      });
    } catch (error) {
      const noHot = document.createElement("li");
      noHot.textContent = "No hot questions found.";
      hotQuestionsContainer.appendChild(noHot);
    }
  }
  
  // Function to get answer count for a question
  function getAnswerCount(questionId) {
    const mockAnswers = JSON.parse(localStorage.getItem("answers")) || []
    return mockAnswers.filter((a) => a.questionId === Number.parseInt(questionId) || a.questionId === questionId).length
  }
  
  // Function to setup event listeners
  function setupEventListeners(questionId) {
    // Vote buttons for question
    const upvoteBtn = document.getElementById("upvote-question")
    if (upvoteBtn) {
      upvoteBtn.addEventListener("click", () => {
        voteQuestion(questionId, 1)
      })
    }
  
    const downvoteBtn = document.getElementById("downvote-question")
    if (downvoteBtn) {
      downvoteBtn.addEventListener("click", () => {
        voteQuestion(questionId, -1)
      })
    }
  
    // Bookmark button
    const bookmarkBtn = document.getElementById("bookmark-btn")
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        toggleBookmark(questionId)
      })
    }
  
    // Share button
    const shareBtn = document.getElementById("share-btn")
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        openShareModal(questionId)
      })
    }
  
    // Report button
    const reportBtn = document.getElementById("report-btn")
    if (reportBtn) {
      reportBtn.addEventListener("click", () => {
        openReportModal("question", questionId)
      })
    }
  
    // Add comment to question
    const addQuestionCommentBtn = document.getElementById('add-question-comment');
    if (addQuestionCommentBtn) {
      addQuestionCommentBtn.addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const questionId = urlParams.get('id');
        postQuestionComment(questionId);
      });
    }
  
    // Post answer button
    const postAnswerBtn = document.getElementById("post-answer-btn")
    if (postAnswerBtn) {
      postAnswerBtn.addEventListener("click", () => {
        postAnswer(questionId)
      })
    }
  
    // Sort answers select
    const sortBy = document.getElementById("sort-by")
    if (sortBy) {
      sortBy.addEventListener("change", () => {
        loadAnswers(questionId)
      })
    }
  
    // Close modals when clicking on X or outside
    const modals = document.querySelectorAll(".modal")
    const closeButtons = document.querySelectorAll(".close-modal")
  
    closeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        modals.forEach((modal) => {
          modal.style.display = "none"
        })
      })
    })
  
    window.addEventListener("click", (event) => {
      modals.forEach((modal) => {
        if (event.target === modal) {
          modal.style.display = "none"
        }
      })
    })
  
    // Copy link button in share modal
    const copyLinkBtn = document.getElementById("copy-link-btn")
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        const shareLink = document.getElementById("share-link")
        shareLink.select()
        document.execCommand("copy")
        alert("Link copied to clipboard!")
      })
    }
  
    // Report form submission
    const reportForm = document.getElementById("report-form")
    if (reportForm) {
      reportForm.addEventListener("submit", (e) => {
        e.preventDefault()
        submitReport()
      })
    }
  }
  
  // Function to vote on question
  async function voteQuestion(questionId, voteType) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("Please log in to vote");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to vote');
      return;
    }
    let url = '';
    if (voteType === 1) {
      url = `http://localhost:3000/api/questions/${questionId}/upvote`;
    } else if (voteType === -1) {
      url = `http://localhost:3000/api/questions/${questionId}/downvote`;
    } else {
      return;
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || 'Error voting on question.');
        return;
      }
      const data = await res.json();
      document.getElementById("question-vote-count").textContent = data.upvotes;
    } catch (error) {
      alert('Error voting on question.');
    }
  }
  
  // Function to vote on an answer
  async function voteAnswer(answerId, voteType, voteCountSpan) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert("Please log in to vote");
      return;
    }
    let url = '';
    if (voteType === 1) {
      url = `http://localhost:3000/api/answers/${answerId}/upvote`;
    } else if (voteType === -1) {
      url = `http://localhost:3000/api/answers/${answerId}/downvote`;
    } else {
      return;
    }
    try {
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) throw new Error('Vote failed');
      const data = await res.json();
      if (voteCountSpan) voteCountSpan.textContent = data.upvotes;
    } catch (error) {
      alert('Error voting on answer.');
    }
  }
  
  // Function to toggle bookmark
  function toggleBookmark(questionId) {
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
          alert('Please log in to bookmark this question');
          return;
      }
      
      // Initialize bookmarks array if it doesn't exist
      if (!currentUser.bookmarks) {
          currentUser.bookmarks = [];
      }
      
      const bookmarkIndex = currentUser.bookmarks.indexOf(questionId);
      const bookmarkBtn = document.getElementById('bookmark-btn');
      
      if (bookmarkIndex === -1) {
          // Add bookmark
          currentUser.bookmarks.push(questionId);
          bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked'
          bookmarkBtn.classList.add("active")
      } else {
          // Remove bookmark
          currentUser.bookmarks.splice(bookmarkIndex, 1);
          bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmark'
          bookmarkBtn.classList.remove("active")
      }
      
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }
  
  // Function to post an answer to the backend
  async function postAnswer(questionId) {
    const answerInput = document.getElementById('answer-text');
    const answerContent = answerInput ? answerInput.value.trim() : '';
    if (!answerContent) {
      alert('Please enter your answer.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post an answer.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: answerContent })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post answer');
      }

      // Clear the input and reload answers
      if (answerInput) answerInput.value = '';
      loadAnswers(questionId);
      alert('Your answer has been posted!');
    } catch (error) {
      alert(error.message || 'Error posting answer.');
    }
  }
  
  // --- COMMENT FUNCTIONALITY ---

  // Load comments for an answer
  async function loadAnswerComments(answerId, commentsListDiv) {
    commentsListDiv.innerHTML = '';
    try {
      const response = await fetch(`http://localhost:3000/api/answers/${answerId}/comments`);
      if (!response.ok) {
        commentsListDiv.innerHTML = '<div class="no-comments">Error loading comments.</div>';
        return;
      }
      const comments = await response.json();
      if (comments.length === 0) {
        commentsListDiv.innerHTML = '<div class="no-comments">No comments yet.</div>';
        return;
      }
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = `<span class="comment-author">${comment.author?.name || 'User'}</span>: <span class="comment-content">${comment.content}</span> <span class="comment-time">${timeAgo(comment.createdAt)}</span>`;
        commentsListDiv.appendChild(commentDiv);
      });
    } catch (error) {
      commentsListDiv.innerHTML = '<div class="no-comments">Error loading comments.</div>';
    }
  }

  // Post a comment to an answer
  async function postAnswerComment(answerId, textarea, commentsListDiv) {
    const content = textarea.value.trim();
    if (!content) {
      alert('Please enter a comment.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to comment.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/answers/${answerId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (!response.ok) {
        alert('Error posting comment.');
        return;
      }
      textarea.value = '';
      loadAnswerComments(answerId, commentsListDiv);
    } catch (error) {
      alert('Error posting comment.');
    }
  }

  // Post a comment to a question
  async function postQuestionComment(questionId) {
    const textarea = document.getElementById('question-comment-text');
    const content = textarea.value.trim();
    if (!content) {
      alert('Please enter a comment.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to comment.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/questions/${questionId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      if (!response.ok) {
        alert('Error posting comment.');
        return;
      }
      textarea.value = '';
      loadQuestionComments(questionId);
    } catch (error) {
      alert('Error posting comment.');
    }
  }
  
  function openReportModal(type, id) {
    const modal = document.getElementById('report-modal');
    if (modal) {
      modal.style.display = 'block';
      modal.dataset.reportType = type;
      modal.dataset.reportId = id;
    }
  }
  
  // Fetch and display the report count for the question
  async function updateQuestionReportCount(questionId) {
    try {
      const res = await fetch(`http://localhost:3000/api/questions/${questionId}/report-count`);
      if (!res.ok) return;
      const data = await res.json();
      const reportBtn = document.getElementById('report-btn');
      if (reportBtn) {
        let countSpan = reportBtn.querySelector('.report-count');
        if (!countSpan) {
          countSpan = document.createElement('span');
          countSpan.className = 'report-count';
          reportBtn.appendChild(countSpan);
        }
        countSpan.textContent = ` (${data.count})`;
      }
    } catch (error) {
      // Ignore errors
    }
  }

  // Submit a report for the question
  async function submitReport() {
    const modal = document.getElementById('report-modal');
    const type = modal.dataset.reportType;
    const id = modal.dataset.reportId;
    const reason = document.getElementById('report-reason').value;
    const description = document.getElementById('report-description').value;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to report.');
      return;
    }
    if (!reason) {
      alert('Please select a reason.');
      return;
    }
    let url = '';
    if (type === 'question') {
      url = `http://localhost:3000/api/questions/${id}/report`;
    } else if (type === 'answer') {
      url = `http://localhost:3000/api/answers/${id}/report`;
    } else {
      alert('Invalid report type.');
      return;
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason, description })
      });
      if (!res.ok) {
        alert('Error submitting report.');
        return;
      }
      alert('Report submitted successfully!');
      modal.style.display = 'none';
      // Update report count if it's a question
      if (type === 'question') updateQuestionReportCount(id);
    } catch (error) {
      alert('Error submitting report.');
    }
  }
  