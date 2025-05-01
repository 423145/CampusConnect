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
  
    // Load top contributors for sidebar
    loadTopContributors()
  
    // Add event listeners
    setupEventListeners(questionId)
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
  
  // Function to load question details
  function loadQuestionDetails(questionId) {
    // In a real application, this would be an API call
    // For now, we'll simulate with mock data
    const mockQuestions = JSON.parse(localStorage.getItem("questions")) || []
    const question = mockQuestions.find((q) => q.id === Number.parseInt(questionId) || q.id === questionId)
  
    if (!question) {
      document.getElementById("question-title").textContent = "Question not found"
      return
    }
  
    // Update page title
    document.title = `${question.title} - College Q&A`
  
    // Update breadcrumbs
    document.getElementById("question-title-breadcrumb").textContent = question.title
    document.getElementById("college-questions-link").href = `questions.html?college=${question.collegeId}`
  
    // Update question header
    document.getElementById("question-title").textContent = question.title
    document.getElementById("question-date").textContent = `Asked on: ${formatDate(question.createdAt)}`
    document.getElementById("question-views").innerHTML = `<i class="fas fa-eye"></i> ${question.views} views`
  
    // Update question tags
    const tagsContainer = document.getElementById("question-tags")
    tagsContainer.innerHTML = ""
  
    question.tags.forEach((tag) => {
      const tagElement = document.createElement("span")
      tagElement.className = "tag"
      tagElement.textContent = tag
      tagsContainer.appendChild(tagElement)
    })
  
    // Update question content
    document.getElementById("question-text").innerHTML = question.content
    document.getElementById("question-vote-count").textContent = question.votes
  
    // Check if question is bookmarked by current user
    const currentUser = getCurrentUser()
    const bookmarkBtn = document.getElementById("bookmark-btn")
  
    if (currentUser && currentUser.bookmarks && currentUser.bookmarks.includes(question.id)) {
      bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked'
      bookmarkBtn.classList.add("active")
    }
  
    // Check if user has voted on this question
    if (currentUser && question.userVotes) {
      if (question.userVotes[currentUser.id] === 1) {
        document.getElementById("upvote-question").classList.add("active")
      } else if (question.userVotes[currentUser.id] === -1) {
        document.getElementById("downvote-question").classList.add("active")
      }
    }
  
    // Update author information
    const mockUsers = JSON.parse(localStorage.getItem("users")) || []
    const author = mockUsers.find((u) => u.id === question.authorId)
  
    if (author) {
      const authorAvatar = document.getElementById("question-author-avatar")
      authorAvatar.innerHTML = ""
      authorAvatar.appendChild(createAvatarElement(author))
  
      document.getElementById("question-author-name").textContent = author.name
      document.getElementById("question-author-college").textContent = author.college || ""
      document.getElementById("question-time").textContent = `asked ${timeAgo(question.createdAt)}`
    }
  
    // Load comments for the question
    loadQuestionComments(question)
  
    // Update college info in sidebar
    const mockColleges = JSON.parse(localStorage.getItem("colleges")) || []
    const college = mockColleges.find((c) => c.id === question.collegeId)
  
    if (college) {
      document.getElementById("sidebar-college-name").textContent = college.name
      document.getElementById("sidebar-college-description").textContent =
        college.description || "A place for students to ask and answer questions."
      document.getElementById("sidebar-college-questions").href = `questions.html?college=${college.id}`
    }
  
    // Increment view count (in a real app, this would be an API call)
    question.views = (question.views || 0) + 1
    localStorage.setItem("questions", JSON.stringify(mockQuestions))
  
    if (question.user) {
      // Avatar
      const avatarDiv = document.getElementById('question-author-avatar');
      avatarDiv.innerHTML = `<img src="${question.user.avatar || '../assets/default-avatar.jpg'}" alt="${question.user.name}" style="width:40px;height:40px;border-radius:50%;">`;

      // Name
      const nameLink = document.getElementById('question-author-name');
      nameLink.textContent = question.user.name;
      nameLink.href = `profile.html?id=${question.user.id}`; // If you have a profile page

      // Role
      document.getElementById('question-author-role').textContent = question.user.role || '';
    } else {
      // Fallback if user info is missing
      document.getElementById('question-author-name').textContent = 'Unknown';
      document.getElementById('question-author-role').textContent = '';
    }
  }
  
  // Function to load question comments
  function loadQuestionComments(question) {
    const commentsContainer = document.getElementById("question-comments-list")
    commentsContainer.innerHTML = ""
  
    const mockUsers = JSON.parse(localStorage.getItem("users")) || []
  
    if (!question.comments || question.comments.length === 0) {
      const noComments = document.createElement("p")
      noComments.className = "no-comments"
      noComments.textContent = "No comments yet."
      commentsContainer.appendChild(noComments)
      return
    }
  
    question.comments.forEach((comment) => {
      const commentElement = document.createElement("div")
      commentElement.className = "comment"
  
      const commentText = document.createElement("div")
      commentText.className = "comment-text"
      commentText.textContent = comment.text
  
      const commentMeta = document.createElement("div")
      commentMeta.className = "comment-meta"
  
      const author = mockUsers.find((u) => u.id === comment.authorId)
      const authorName = author ? author.name : "Anonymous"
  
      const commentAuthor = document.createElement("span")
      commentAuthor.className = "comment-author"
      commentAuthor.textContent = authorName
  
      const commentTime = document.createElement("span")
      commentTime.className = "comment-time"
      commentTime.textContent = timeAgo(comment.createdAt)
  
      commentMeta.appendChild(commentAuthor)
      commentMeta.appendChild(commentTime)
  
      commentElement.appendChild(commentText)
      commentElement.appendChild(commentMeta)
  
      commentsContainer.appendChild(commentElement)
    })
  }
  
  // Function to load answers
  function loadAnswers(questionId) {
    const answersContainer = document.getElementById("answers-container")
    answersContainer.innerHTML = ""
  
    // In a real application, this would be an API call
    // For now, we'll simulate with mock data
    const mockAnswers = JSON.parse(localStorage.getItem("answers")) || []
    const questionAnswers = mockAnswers.filter(
      (a) => a.questionId === Number.parseInt(questionId) || a.questionId === questionId,
    )
  
    // Update answer count
    const answersCount = document.getElementById("answers-count")
    answersCount.textContent = `${questionAnswers.length} Answer${questionAnswers.length !== 1 ? "s" : ""}`
  
    if (questionAnswers.length === 0) {
      const noAnswers = document.createElement("div")
      noAnswers.className = "no-answers"
      noAnswers.textContent = "No answers yet. Be the first to answer!"
      answersContainer.appendChild(noAnswers)
      return
    }
  
    const mockUsers = JSON.parse(localStorage.getItem("users")) || []
    const currentUser = getCurrentUser()
  
    // Sort answers based on selected option
    const sortSelect = document.getElementById("sort-by")
    const sortValue = sortSelect.value
  
    questionAnswers.sort((a, b) => {
      switch (sortValue) {
        case "votes":
          return b.votes - a.votes
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return b.votes - a.votes
      }
    })
  
    questionAnswers.forEach((answer) => {
      const template = document.getElementById("answer-template")
      const answerElement = document.importNode(template.content, true)
  
      // Set answer content
      answerElement.querySelector(".answer-text").innerHTML = answer.content
      answerElement.querySelector(".vote-count").textContent = answer.votes || 0
  
      // Set author information
      const author = mockUsers.find((u) => u.id === answer.authorId)
  
      if (author) {
        const authorAvatar = answerElement.querySelector(".author-avatar")
        authorAvatar.appendChild(createAvatarElement(author))
  
        answerElement.querySelector(".author-name").textContent = author.name
        answerElement.querySelector(".author-college").textContent = author.college || ""
        answerElement.querySelector(".answered-time").textContent = `answered ${timeAgo(answer.createdAt)}`
      }
  
      // Check if user has voted on this answer
      if (currentUser && answer.userVotes) {
        if (answer.userVotes[currentUser.id] === 1) {
          answerElement.querySelector(".upvote-answer").classList.add("active")
        } else if (answer.userVotes[currentUser.id] === -1) {
          answerElement.querySelector(".downvote-answer").classList.add("active")
        }
      }
  
      // Add data attributes for vote buttons
      const upvoteBtn = answerElement.querySelector(".upvote-answer")
      const downvoteBtn = answerElement.querySelector(".downvote-answer")
      upvoteBtn.dataset.answerId = answer.id
      downvoteBtn.dataset.answerId = answer.id
  
      // Add event listeners for votes
      upvoteBtn.addEventListener("click", () => {
        voteAnswer(answer.id, 1)
      })
  
      downvoteBtn.addEventListener("click", () => {
        voteAnswer(answer.id, -1)
      })
  
      // Add report button event listener
      const reportBtn = answerElement.querySelector(".report-answer-btn")
      reportBtn.dataset.answerId = answer.id
      reportBtn.addEventListener("click", () => {
        openReportModal("answer", answer.id)
      })
  
      // Load answer comments
      const commentsContainer = answerElement.querySelector(".comments-list")
      loadAnswerComments(answer, commentsContainer)
  
      // Add comment button event listener
      const commentBtn = answerElement.querySelector(".add-answer-comment")
      const commentText = answerElement.querySelector(".comment-text")
      commentBtn.dataset.answerId = answer.id
      commentBtn.addEventListener("click", () => {
        addComment("answer", answer.id, commentText.value)
        commentText.value = ""
      })
  
      answersContainer.appendChild(answerElement)
    })
  }
  
  // Function to load answer comments
  function loadAnswerComments(answer, container) {
    container.innerHTML = ""
  
    const mockUsers = JSON.parse(localStorage.getItem("users")) || []
  
    if (!answer.comments || answer.comments.length === 0) {
      const noComments = document.createElement("p")
      noComments.className = "no-comments"
      noComments.textContent = "No comments yet."
      container.appendChild(noComments)
      return
    }
  
    answer.comments.forEach((comment) => {
      const commentElement = document.createElement("div")
      commentElement.className = "comment"
  
      const commentText = document.createElement("div")
      commentText.className = "comment-text"
      commentText.textContent = comment.text
  
      const commentMeta = document.createElement("div")
      commentMeta.className = "comment-meta"
  
      const author = mockUsers.find((u) => u.id === comment.authorId)
      const authorName = author ? author.name : "Anonymous"
  
      const commentAuthor = document.createElement("span")
      commentAuthor.className = "comment-author"
      commentAuthor.textContent = authorName
  
      const commentTime = document.createElement("span")
      commentTime.className = "comment-time"
      commentTime.textContent = timeAgo(comment.createdAt)
  
      commentMeta.appendChild(commentAuthor)
      commentMeta.appendChild(commentTime)
  
      commentElement.appendChild(commentText)
      commentElement.appendChild(commentMeta)
  
      container.appendChild(commentElement)
    })
  }
  
  // Function to load related questions
  function loadRelatedQuestions(questionId) {
    const relatedQuestionsContainer = document.getElementById("related-questions-list")
    relatedQuestionsContainer.innerHTML = ""
  
    // In a real application, this would be an API call to get related questions
    // For now, we'll simulate with mock data
    const mockQuestions = JSON.parse(localStorage.getItem("questions")) || []
    const currentQuestion = mockQuestions.find((q) => q.id === Number.parseInt(questionId) || q.id === questionId)
  
    if (!currentQuestion) return
  
    // Get questions from the same college or with similar tags
    const relatedQuestions = mockQuestions.filter((q) => {
      if (q.id === Number.parseInt(questionId) || q.id === questionId) return false // Exclude current question
  
      // Check if same college
      if (q.collegeId === currentQuestion.collegeId) return true
  
      // Check if has common tags
      const commonTags = q.tags.filter((tag) => currentQuestion.tags.includes(tag))
      return commonTags.length > 0
    })
  
    // Sort by most recent and limit to 5
    const recentRelated = relatedQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  
    if (recentRelated.length === 0) {
      const noRelated = document.createElement("li")
      noRelated.textContent = "No related questions found."
      relatedQuestionsContainer.appendChild(noRelated)
      return
    }
  
    recentRelated.forEach((question) => {
      const listItem = document.createElement("li")
  
      const link = document.createElement("a")
      link.href = `question-detail.html?id=${question.id}`
      link.textContent = question.title
  
      listItem.appendChild(link)
      relatedQuestionsContainer.appendChild(listItem)
    })
  }
  
  // Function to load hot questions for sidebar
  function loadHotQuestions() {
    const hotQuestionsContainer = document.getElementById("hot-questions-list")
    hotQuestionsContainer.innerHTML = ""
  
    // In a real application, this would be an API call to get hot questions
    // For now, we'll simulate with mock data
    const mockQuestions = JSON.parse(localStorage.getItem("questions")) || []
  
    // Sort by most votes and views, limit to 5
    const hotQuestions = mockQuestions
      .sort((a, b) => {
        const aScore = (a.votes || 0) + (a.views || 0) / 10
        const bScore = (b.votes || 0) + (b.views || 0) / 10
        return bScore - aScore
      })
      .slice(0, 5)
  
    if (hotQuestions.length === 0) {
      const noHot = document.createElement("li")
      noHot.textContent = "No hot questions found."
      hotQuestionsContainer.appendChild(noHot)
      return
    }
  
    hotQuestions.forEach((question) => {
      const listItem = document.createElement("li")
  
      const link = document.createElement("a")
      link.href = `question-detail.html?id=${question.id}`
      link.textContent = question.title
  
      const stats = document.createElement("div")
      stats.className = "question-stats"
  
      const votes = document.createElement("span")
      votes.innerHTML = `<i class="fas fa-arrow-up"></i> ${question.votes || 0} votes`
  
      const answers = document.createElement("span")
      const answerCount = getAnswerCount(question.id)
      answers.innerHTML = `<i class="fas fa-comment"></i> ${answerCount} answers`
  
      stats.appendChild(votes)
      stats.appendChild(answers)
  
      listItem.appendChild(link)
      listItem.appendChild(stats)
      hotQuestionsContainer.appendChild(listItem)
    })
  }
  
  // Function to get answer count for a question
  function getAnswerCount(questionId) {
    const mockAnswers = JSON.parse(localStorage.getItem("answers")) || []
    return mockAnswers.filter((a) => a.questionId === Number.parseInt(questionId) || a.questionId === questionId).length
  }
  
  // Function to load top contributors for sidebar
  function loadTopContributors() {
    const contributorsContainer = document.getElementById("top-contributors-list")
    contributorsContainer.innerHTML = ""
  
    // In a real application, this would be an API call to get top contributors
    // For now, we'll simulate with mock data
    const mockUsers = JSON.parse(localStorage.getItem("users")) || []
    const mockAnswers = JSON.parse(localStorage.getItem("answers")) || []
  
    // Calculate user contributions (based on answers and votes)
    const userContributions = {}
  
    mockAnswers.forEach((answer) => {
      if (!userContributions[answer.authorId]) {
        userContributions[answer.authorId] = {
          answers: 0,
          votes: 0,
        }
      }
  
      userContributions[answer.authorId].answers++
      userContributions[answer.authorId].votes += answer.votes || 0
    })
  
    // Sort users by contribution score
    const topContributors = mockUsers
      .filter((user) => userContributions[user.id])
      .sort((a, b) => {
        const aScore = userContributions[a.id].answers * 2 + userContributions[a.id].votes
        const bScore = userContributions[b.id].answers * 2 + userContributions[b.id].votes
        return bScore - aScore
      })
      .slice(0, 5)
  
    if (topContributors.length === 0) {
      const noContributors = document.createElement("li")
      noContributors.textContent = "No contributors found."
      contributorsContainer.appendChild(noContributors)
      return
    }
  
    topContributors.forEach((user) => {
      const listItem = document.createElement("li")
  
      const contributor = document.createElement("div")
      contributor.className = "contributor"
  
      const avatar = createAvatarElement(user)
  
      const details = document.createElement("div")
      details.className = "contributor-details"
  
      const name = document.createElement("div")
      name.className = "contributor-name"
      name.textContent = user.name
  
      const stats = document.createElement("div")
      stats.className = "contributor-stats"
      stats.textContent = `${userContributions[user.id].answers} answers, ${userContributions[user.id].votes} votes`
  
      details.appendChild(name)
      details.appendChild(stats)
  
      contributor.appendChild(avatar)
      contributor.appendChild(details)
  
      listItem.appendChild(contributor)
      contributorsContainer.appendChild(listItem)
    })
  }
  
  // Function to setup event listeners
  function setupEventListeners(questionId) {
    // Vote buttons for question
    document.getElementById("upvote-question").addEventListener("click", () => {
      voteQuestion(questionId, 1)
    })
  
    document.getElementById("downvote-question").addEventListener("click", () => {
      voteQuestion(questionId, -1)
    })
  
    // Bookmark button
    document.getElementById("bookmark-btn").addEventListener("click", () => {
      toggleBookmark(questionId)
    })
  
    // Share button
    document.getElementById("share-btn").addEventListener("click", () => {
      openShareModal(questionId)
    })
  
    // Report button
    document.getElementById("report-btn").addEventListener("click", () => {
      openReportModal("question", questionId)
    })
  
    // Add comment to question
    document.getElementById("add-question-comment").addEventListener("click", () => {
      const commentText = document.getElementById("question-comment-text").value
      addComment("question", questionId, commentText)
      document.getElementById("question-comment-text").value = ""
    })
  
    // Post answer button
    document.getElementById("post-answer-btn").addEventListener("click", () => {
      postAnswer(questionId)
    })
  
    // Sort answers select
    document.getElementById("sort-by").addEventListener("change", () => {
      loadAnswers(questionId)
    })
  
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
    document.getElementById("copy-link-btn").addEventListener("click", () => {
      const shareLink = document.getElementById("share-link")
      shareLink.select()
      document.execCommand("copy")
      alert("Link copied to clipboard!")
    })
  
    // Report form submission
    document.getElementById("report-form").addEventListener("submit", (e) => {
      e.preventDefault()
      submitReport()
    })
  }
  
  // Function to vote on question
  function voteQuestion(questionId, voteType) {
    const currentUser = getCurrentUser()
  
    if (!currentUser) {
      alert("Please log in to vote")
      return
    }
  
    // In a real application, this would be an API call
    // For now, we'll simulate with localStorage
    const mockQuestions = JSON.parse(localStorage.getItem("questions")) || []
    const questionIndex = mockQuestions.findIndex((q) => q.id === Number.parseInt(questionId) || q.id === questionId)
  
    if (questionIndex === -1) return
  
    const question = mockQuestions[questionIndex]
  
    // Initialize userVotes if it doesn't exist
    if (!question.userVotes) {
      question.userVotes = {}
    }
  
    const currentVote = question.userVotes[currentUser.id] || 0
    let voteChange = 0
  
    if (currentVote === voteType) {
      // User is canceling their vote
      question.userVotes[currentUser.id] = 0
      voteChange = -voteType
    } else {
      // User is changing their vote or voting for the first time
      voteChange = voteType - currentVote
      question.userVotes[currentUser.id] = voteType
    }
  
    // Update vote count
    question.votes = (question.votes || 0) + voteChange
  
    // Save to localStorage
    localStorage.setItem("questions", JSON.stringify(mockQuestions))
  
    // Update UI
    document.getElementById("question-vote-count").textContent = question.votes
  
    const upvoteBtn = document.getElementById("upvote-question")
    const downvoteBtn = document.getElementById("downvote-question")
  
    upvoteBtn.classList.remove("active")
    downvoteBtn.classList.remove("active")
  
    if (question.userVotes[currentUser.id] === 1) {
      upvoteBtn.classList.add("active")
    } else if (question.userVotes[currentUser.id] === -1) {
      downvoteBtn.classList.add("active")
    }
  }
  
  // Function to vote on answer
  function voteAnswer(answerId, voteType) {
    const currentUser = getCurrentUser()
  
    if (!currentUser) {
      alert("Please log in to vote")
      return
    }
  
    // In a real application, this would be an API call
    // For now, we'll simulate with localStorage
    const mockAnswers = JSON.parse(localStorage.getItem("answers")) || []
    const answerIndex = mockAnswers.findIndex((a) => a.id === Number.parseInt(answerId) || a.id === answerId)
  
    if (answerIndex === -1) return
  
    const answer = mockAnswers[answerIndex]
  
    // Initialize userVotes if it doesn't exist
    if (!answer.userVotes) {
      answer.userVotes = {}
    }
  
    const currentVote = answer.userVotes[currentUser.id] || 0
    let voteChange = 0
  
    if (currentVote === voteType) {
      // User is canceling their vote
      answer.userVotes[currentUser.id] = 0
      voteChange = -voteType
    } else {
      // User is changing their vote or voting for the first time
      voteChange = voteType - currentVote
      answer.userVotes[currentUser.id] = voteType
    }
  
    // Update vote count
    answer.votes = (answer.votes || 0) + voteChange
  
    // Save to localStorage
    localStorage.setItem("answers", JSON.stringify(mockAnswers))
  
    // Update UI - find the specific answer in the DOM and update it
    const answersContainer = document.getElementById("answers-container")
    const answerElements = answersContainer.querySelectorAll(".answer")
  
    answerElements.forEach((element) => {
      const upvoteBtn = element.querySelector(".upvote-answer")
      const downvoteBtn = element.querySelector(".downvote-answer")
  
      if (upvoteBtn.dataset.answerId === answerId.toString()) {
        element.querySelector(".vote-count").textContent = answer.votes
  
        upvoteBtn.classList.remove("active")
        downvoteBtn.classList.remove("active")
  
        if (answer.userVotes[currentUser.id] === 1) {
          upvoteBtn.classList.add("active")
        } else if (answer.userVotes[currentUser.id] === -1) {
          downvoteBtn.classList.add("active")
        }
      }
    })
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
  