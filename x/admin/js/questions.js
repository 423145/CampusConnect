// Q&A Management JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Q&A management script loaded")

  // Get DOM elements - Tabs
  const tabs = document.querySelectorAll(".admin-tab")
  const tabContents = document.querySelectorAll(".admin-tab-content")

  // Get DOM elements - Questions Tab
  const questionSearch = document.getElementById("question-search")
  const collegeFilter = document.getElementById("college-filter")
  const statusFilter = document.getElementById("status-filter")
  const tagFilter = document.getElementById("tag-filter")
  const addQuestionBtn = document.getElementById("add-question-btn")
  const exportQuestionsBtn = document.getElementById("export-questions-btn")
  const selectAllQuestions = document.getElementById("select-all-questions")
  const questionsTableBody = document.getElementById("questions-table-body")
  const questionsPagination = document.getElementById("questions-pagination")

  // Get DOM elements - Answers Tab
  const answerCollegeFilter = document.getElementById("answer-college-filter")
  const answerStatusFilter = document.getElementById("answer-status-filter")
  const selectAllAnswers = document.getElementById("select-all-answers")
  const answersTableBody = document.getElementById("answers-table-body")
  const answersPagination = document.getElementById("answers-pagination")

  // Get DOM elements - Tags Tab
  const addTagBtn = document.getElementById("add-tag-btn")
  const mergeTagsBtn = document.getElementById("merge-tags-btn")
  const tagsGrid = document.getElementById("tags-grid")

  // Get DOM elements - Question Modal
  const questionModal = document.getElementById("question-modal")
  const questionModalTitle = document.getElementById("question-modal-title")
  const questionForm = document.getElementById("question-form")
  const questionId = document.getElementById("question-id")
  const questionTitle = document.getElementById("question-title")
  const questionContent = document.getElementById("question-content")
  const questionCollege = document.getElementById("question-college")
  const questionTags = document.getElementById("question-tags")
  const questionAuthor = document.getElementById("question-author")
  const questionStatus = document.getElementById("question-status")
  const cancelQuestionBtn = document.getElementById("cancel-question-btn")

  // Get DOM elements - Answer Modal
  const answerModal = document.getElementById("answer-modal")
  const answerModalTitle = document.getElementById("answer-modal-title")
  const answerForm = document.getElementById("answer-form")
  const answerId = document.getElementById("answer-id")
  const answerQuestionId = document.getElementById("answer-question-id")
  const answerQuestionTitle = document.getElementById("answer-question-title")
  const answerContent = document.getElementById("answer-content")
  const answerAuthor = document.getElementById("answer-author")
  const answerStatus = document.getElementById("answer-status")
  const cancelAnswerBtn = document.getElementById("cancel-answer-btn")

  // Get DOM elements - Tag Modal
  const tagModal = document.getElementById("tag-modal")
  const tagModalTitle = document.getElementById("tag-modal-title")
  const tagForm = document.getElementById("tag-form")
  const tagId = document.getElementById("tag-id")
  const tagName = document.getElementById("tag-name")
  const tagDescription = document.getElementById("tag-description")
  const cancelTagBtn = document.getElementById("cancel-tag-btn")

  // Get DOM elements - Merge Tags Modal
  const mergeTagsModal = document.getElementById("merge-tags-modal")
  const mergeTagsForm = document.getElementById("merge-tags-form")
  const sourceTag = document.getElementById("source-tag")
  const targetTag = document.getElementById("target-tag")
  const cancelMergeBtn = document.getElementById("cancel-merge-btn")

  // Get DOM elements - Modal Close Buttons
  const modalCloseButtons = document.querySelectorAll(".admin-modal-close")

  // Get data from localStorage
  const questions = JSON.parse(localStorage.getItem("questions") || "[]")
  const colleges = JSON.parse(localStorage.getItem("colleges") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]")

  // Pagination variables
  let currentQuestionsPage = 1
  let currentAnswersPage = 1
  const itemsPerPage = 10
  let filteredQuestions = [...questions]
  let filteredAnswers = []

  // Extract all answers from questions
  questions.forEach((question) => {
    if (question.answers) {
      question.answers.forEach((answer) => {
        filteredAnswers.push({
          ...answer,
          questionId: question.id,
          questionTitle: question.title,
        })
      })
    }
  })

  // Extract all unique tags from questions
  const allTags = []
  questions.forEach((question) => {
    if (question.tags) {
      question.tags.forEach((tag) => {
        if (!allTags.some((t) => t.name === tag)) {
          allTags.push({
            name: tag,
            count: 1,
          })
        } else {
          const existingTag = allTags.find((t) => t.name === tag)
          existingTag.count++
        }
      })
    }
  })

  // Sort tags by count (most used first)
  allTags.sort((a, b) => b.count - a.count)

  // Populate dropdowns
  populateDropdowns()

  // Load initial data
  loadQuestionsTable()
  loadAnswersTable()
  loadTagsGrid()

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs and tab contents
      tabs.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      const tabName = this.dataset.tab
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })

  // Event listeners - Questions Tab
  questionSearch.addEventListener("input", () => {
    currentQuestionsPage = 1
    filterQuestions()
  })

  collegeFilter.addEventListener("change", () => {
    currentQuestionsPage = 1
    filterQuestions()
  })

  statusFilter.addEventListener("change", () => {
    currentQuestionsPage = 1
    filterQuestions()
  })

  tagFilter.addEventListener("change", () => {
    currentQuestionsPage = 1
    filterQuestions()
  })

  selectAllQuestions.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".question-checkbox")
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked
    })
  })

  addQuestionBtn.addEventListener("click", () => {
    openAddQuestionModal()
  })

  exportQuestionsBtn.addEventListener("click", () => {
    exportQuestions()
  })

  // Event listeners - Answers Tab
  answerCollegeFilter.addEventListener("change", () => {
    currentAnswersPage = 1
    filterAnswers()
  })

  answerStatusFilter.addEventListener("change", () => {
    currentAnswersPage = 1
    filterAnswers()
  })

  selectAllAnswers.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".answer-checkbox")
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked
    })
  })

  // Event listeners - Tags Tab
  addTagBtn.addEventListener("click", () => {
    openAddTagModal()
  })

  mergeTagsBtn.addEventListener("click", () => {
    openMergeTagsModal()
  })

  // Event listeners - Forms
  questionForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveQuestion()
  })

  answerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveAnswer()
  })

  tagForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveTag()
  })

  mergeTagsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    mergeTags()
  })

  // Event listeners - Cancel buttons
  cancelQuestionBtn.addEventListener("click", () => {
    closeQuestionModal()
  })

  cancelAnswerBtn.addEventListener("click", () => {
    closeAnswerModal()
  })

  cancelTagBtn.addEventListener("click", () => {
    closeTagModal()
  })

  cancelMergeBtn.addEventListener("click", () => {
    closeMergeTagsModal()
  })

  // Event listeners - Modal close buttons
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeAllModals()
    })
  })

  // Functions
  function populateDropdowns() {
    // Sort colleges by name
    const sortedColleges = [...colleges].sort((a, b) => a.name.localeCompare(b.name))

    // Populate college filters
    sortedColleges.forEach((college) => {
      // Questions tab college filter
      const option = document.createElement("option")
      option.value = college.id
      option.textContent = college.name
      collegeFilter.appendChild(option)

      // Answers tab college filter
      const answerOption = document.createElement("option")
      answerOption.value = college.id
      answerOption.textContent = college.name
      answerCollegeFilter.appendChild(answerOption)

      // Question modal college dropdown
      const questionCollegeOption = document.createElement("option")
      questionCollegeOption.value = college.id
      questionCollegeOption.textContent = college.name
      questionCollege.appendChild(questionCollegeOption)
    })

    // Sort users by name
    const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name))

    // Populate user dropdowns
    sortedUsers.forEach((user) => {
      // Question modal author dropdown
      const questionAuthorOption = document.createElement("option")
      questionAuthorOption.value = user.id
      questionAuthorOption.textContent = user.name
      questionAuthor.appendChild(questionAuthorOption)

      // Answer modal author dropdown
      const answerAuthorOption = document.createElement("option")
      answerAuthorOption.value = user.id
      answerAuthorOption.textContent = user.name
      answerAuthor.appendChild(answerAuthorOption)
    })

    // Populate tag filter
    allTags.forEach((tag) => {
      const option = document.createElement("option")
      option.value = tag.name
      option.textContent = `${tag.name} (${tag.count})`
      tagFilter.appendChild(option)

      // Also populate merge tags dropdowns
      const sourceOption = document.createElement("option")
      sourceOption.value = tag.name
      sourceOption.textContent = tag.name
      sourceTag.appendChild(sourceOption)

      const targetOption = document.createElement("option")
      targetOption.value = tag.name
      targetOption.textContent = tag.name
      targetTag.appendChild(targetOption)
    })
  }

  function filterQuestions() {
    const searchTerm = questionSearch.value.toLowerCase()
    const collegeValue = collegeFilter.value
    const statusValue = statusFilter.value
    const tagValue = tagFilter.value

    filteredQuestions = questions.filter((question) => {
      // Search filter
      const matchesSearch =
        question.title.toLowerCase().includes(searchTerm) || question.content.toLowerCase().includes(searchTerm)

      // College filter
      const matchesCollege = collegeValue === "all" || question.collegeId === Number.parseInt(collegeValue)

      // Status filter (mock data as we don't have status in our question objects)
      const questionStatus = question.status || "unresolved"
      const matchesStatus = statusValue === "all" || questionStatus === statusValue

      // Tag filter
      const matchesTag = tagValue === "all" || (question.tags && question.tags.includes(tagValue))

      return matchesSearch && matchesCollege && matchesStatus && matchesTag
    })

    loadQuestionsTable()
  }

  function filterAnswers() {
    const collegeValue = answerCollegeFilter.value
    const statusValue = answerStatusFilter.value

    // Reset filtered answers
    filteredAnswers = []

    // Extract answers that match filters
    questions.forEach((question) => {
      // Check if question matches college filter
      const matchesCollege = collegeValue === "all" || question.collegeId === Number.parseInt(collegeValue)

      if (matchesCollege && question.answers) {
        question.answers.forEach((answer) => {
          // Check if answer matches status filter
          const answerStatus = answer.status || "not-accepted"
          const matchesStatus = statusValue === "all" || answerStatus === statusValue

          if (matchesStatus) {
            filteredAnswers.push({
              ...answer,
              questionId: question.id,
              questionTitle: question.title,
            })
          }
        })
      }
    })

    loadAnswersTable()
  }

  function loadQuestionsTable() {
    // Clear table body
    questionsTableBody.innerHTML = ""

    // Calculate pagination
    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)
    const startIndex = (currentQuestionsPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex)

    // Display questions
    if (paginatedQuestions.length === 0) {
      const emptyRow = document.createElement("tr")
      emptyRow.innerHTML = `
                <td colspan="9" class="text-center">No questions found</td>
            `
      questionsTableBody.appendChild(emptyRow)
    } else {
      paginatedQuestions.forEach((question) => {
        const row = document.createElement("tr")

        // Find college name
        let collegeName = ""
        if (question.collegeId) {
          const college = colleges.find((c) => c.id === question.collegeId)
          if (college) {
            collegeName = college.name
          }
        }

        // Find author name
        let authorName = "Unknown"
        if (question.userId) {
          const author = users.find((u) => u.id === question.userId)
          if (author) {
            authorName = author.name
          }
        }

        // Count answers
        const answersCount = question.answers ? question.answers.length : 0

        // Get question status (mock data)
        const questionStatus = question.status || "unresolved"

        // Get status badge class
        let statusBadgeClass = ""
        switch (questionStatus) {
          case "resolved":
            statusBadgeClass = "status-success"
            break
          case "unresolved":
            statusBadgeClass = "status-warning"
            break
          case "flagged":
            statusBadgeClass = "status-danger"
            break
          default:
            statusBadgeClass = "status-warning"
        }

        row.innerHTML = `
                    <td>
                        <input type="checkbox" class="question-checkbox" data-id="${question.id}">
                    </td>
                    <td>
                        <a href="#" class="question-link" data-id="${question.id}">${question.title}</a>
                    </td>
                    <td>${authorName}</td>
                    <td>${collegeName}</td>
                    <td>${formatDate(question.createdAt)}</td>
                    <td>${answersCount}</td>
                    <td>${question.views || 0}</td>
                    <td><span class="status-badge ${statusBadgeClass}">${capitalizeFirstLetter(questionStatus)}</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-icon btn-view view-question-btn" data-id="${question.id}" title="View Question">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon btn-edit edit-question-btn" data-id="${question.id}" title="Edit Question">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete delete-question-btn" data-id="${question.id}" title="Delete Question">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `

        questionsTableBody.appendChild(row)
      })

      // Add event listeners to action buttons
      document.querySelectorAll(".question-link, .view-question-btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const questionId = this.dataset.id
          window.open(`../pages/question-detail.html?id=${questionId}`, "_blank")
        })
      })

      document.querySelectorAll(".edit-question-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const questionId = this.dataset.id
          openEditQuestionModal(questionId)
        })
      })

      document.querySelectorAll(".delete-question-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const questionId = this.dataset.id
          deleteQuestion(questionId)
        })
      })
    }

    // Update pagination
    updateQuestionsPagination(totalPages)
  }

  function loadAnswersTable() {
    // Clear table body
    answersTableBody.innerHTML = ""

    // Calculate pagination
    const totalPages = Math.ceil(filteredAnswers.length / itemsPerPage)
    const startIndex = (currentAnswersPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedAnswers = filteredAnswers.slice(startIndex, endIndex)

    // Display answers
    if (paginatedAnswers.length === 0) {
      const emptyRow = document.createElement("tr")
      emptyRow.innerHTML = `
                <td colspan="8" class="text-center">No answers found</td>
            `
      answersTableBody.appendChild(emptyRow)
    } else {
      paginatedAnswers.forEach((answer) => {
        const row = document.createElement("tr")

        // Find author name
        let authorName = "Unknown"
        if (answer.userId) {
          const author = users.find((u) => u.id === answer.userId)
          if (author) {
            authorName = author.name
          }
        }

        // Get answer status (mock data)
        const answerStatus = answer.status || "not-accepted"

        // Get status badge class
        let statusBadgeClass = ""
        switch (answerStatus) {
          case "accepted":
            statusBadgeClass = "status-success"
            break
          case "not-accepted":
            statusBadgeClass = "status-warning"
            break
          case "flagged":
            statusBadgeClass = "status-danger"
            break
          default:
            statusBadgeClass = "status-warning"
        }

        row.innerHTML = `
                    <td>
                        <input type="checkbox" class="answer-checkbox" data-id="${answer.id}" data-question-id="${answer.questionId}">
                    </td>
                    <td>
                        <div class="answer-excerpt">${answer.content.substring(0, 100)}${answer.content.length > 100 ? "..." : ""}</div>
                    </td>
                    <td>
                        <a href="#" class="question-link" data-id="${answer.questionId}">${answer.questionTitle}</a>
                    </td>
                    <td>${authorName}</td>
                    <td>${formatDate(answer.createdAt)}</td>
                    <td>${answer.upvotes || 0}</td>
                    <td><span class="status-badge ${statusBadgeClass}">${capitalizeFirstLetter(answerStatus)}</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-icon btn-view view-answer-btn" data-id="${answer.id}" data-question-id="${answer.questionId}" title="View Answer">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon btn-edit edit-answer-btn" data-id="${answer.id}" data-question-id="${answer.questionId}" title="Edit Answer">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete delete-answer-btn" data-id="${answer.id}" data-question-id="${answer.questionId}" title="Delete Answer">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `

        answersTableBody.appendChild(row)
      })

      // Add event listeners to action buttons
      document.querySelectorAll(".question-link").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault()
          const questionId = this.dataset.id
          window.open(`../pages/question-detail.html?id=${questionId}`, "_blank")
        })
      })

      document.querySelectorAll(".view-answer-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const questionId = this.dataset.questionId
          window.open(`../pages/question-detail.html?id=${questionId}`, "_blank")
        })
      })

      document.querySelectorAll(".edit-answer-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const answerId = this.dataset.id
          const questionId = this.dataset.questionId
          openEditAnswerModal(answerId, questionId)
        })
      })

      document.querySelectorAll(".delete-answer-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const answerId = this.dataset.id
          const questionId = this.dataset.questionId
          deleteAnswer(answerId, questionId)
        })
      })
    }

    // Update pagination
    updateAnswersPagination(totalPages)
  }

  function loadTagsGrid() {
    // Clear grid
    tagsGrid.innerHTML = ""

    // Display tags
    if (allTags.length === 0) {
      tagsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-tags"></i>
                    <h3>No tags found</h3>
                    <p>Tags will appear here when questions are tagged</p>
                </div>
            `
    } else {
      allTags.forEach((tag) => {
        const tagCard = document.createElement("div")
        tagCard.className = "tag-card"

        tagCard.innerHTML = `
                    <div class="tag-card-header">
                        <h3 class="tag-name">${tag.name}</h3>
                        <span class="tag-count">${tag.count}</span>
                    </div>
                    <div class="tag-card-actions">
                        <button class="btn-icon btn-edit edit-tag-btn" data-tag="${tag.name}" title="Edit Tag">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete delete-tag-btn" data-tag="${tag.name}" title="Delete Tag">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `

        tagsGrid.appendChild(tagCard)
      })

      // Add event listeners to action buttons
      document.querySelectorAll(".edit-tag-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const tagName = this.dataset.tag
          openEditTagModal(tagName)
        })
      })

      document.querySelectorAll(".delete-tag-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const tagName = this.dataset.tag
          deleteTag(tagName)
        })
      })
    }
  }

  function updateQuestionsPagination(totalPages) {
    questionsPagination.innerHTML = ""

    if (totalPages <= 1) {
      return
    }

    // Previous button
    const prevItem = document.createElement("div")
    prevItem.className = `page-item ${currentQuestionsPage === 1 ? "disabled" : ""}`
    prevItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentQuestionsPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        `
    questionsPagination.appendChild(prevItem)

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("div")
      pageItem.className = `page-item ${i === currentQuestionsPage ? "active" : ""}`
      pageItem.innerHTML = `
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            `
      questionsPagination.appendChild(pageItem)
    }

    // Next button
    const nextItem = document.createElement("div")
    nextItem.className = `page-item ${currentQuestionsPage === totalPages ? "disabled" : ""}`
    nextItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentQuestionsPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        `
    questionsPagination.appendChild(nextItem)

    // Add event listeners to pagination links
    document.querySelectorAll("#questions-pagination .page-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        if (this.parentElement.classList.contains("disabled")) {
          return
        }

        currentQuestionsPage = Number.parseInt(this.dataset.page)
        loadQuestionsTable()
      })
    })
  }

  function updateAnswersPagination(totalPages) {
    answersPagination.innerHTML = ""

    if (totalPages <= 1) {
      return
    }

    // Previous button
    const prevItem = document.createElement("div")
    prevItem.className = `page-item ${currentAnswersPage === 1 ? "disabled" : ""}`
    prevItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentAnswersPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        `
    answersPagination.appendChild(prevItem)

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("div")
      pageItem.className = `page-item ${i === currentAnswersPage ? "active" : ""}`
      pageItem.innerHTML = `
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            `
      answersPagination.appendChild(pageItem)
    }

    // Next button
    const nextItem = document.createElement("div")
    nextItem.className = `page-item ${currentAnswersPage === totalPages ? "disabled" : ""}`
    nextItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentAnswersPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        `
    answersPagination.appendChild(nextItem)

    // Add event listeners to pagination links
    document.querySelectorAll("#answers-pagination .page-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        if (this.parentElement.classList.contains("disabled")) {
          return
        }

        currentAnswersPage = Number.parseInt(this.dataset.page)
        loadAnswersTable()
      })
    })
  }

  function openAddQuestionModal() {
    // Set modal title
    questionModalTitle.textContent = "Add New Question"

    // Clear form
    questionForm.reset()
    questionId.value = ""

    // Open modal
    questionModal.style.display = "block"
  }

  function openEditQuestionModal(id) {
    // Find question
    const question = questions.find((q) => q.id === Number.parseInt(id))

    if (!question) {
      return
    }

    // Set modal title
    questionModalTitle.textContent = "Edit Question"

    // Fill form
    questionId.value = question.id
    questionTitle.value = question.title
    questionContent.value = question.content
    questionCollege.value = question.collegeId || ""
    questionTags.value = question.tags ? question.tags.join(", ") : ""
    questionAuthor.value = question.userId || ""
    questionStatus.value = question.status || "active"

    // Open modal
    questionModal.style.display = "block"
  }

  function openEditAnswerModal(answerId, questionId) {
    // Find question and answer
    const question = questions.find((q) => q.id === Number.parseInt(questionId))

    if (!question || !question.answers) {
      return
    }

    const answer = question.answers.find((a) => a.id === Number.parseInt(answerId))

    if (!answer) {
      return
    }

    // Set modal title
    answerModalTitle.textContent = "Edit Answer"

    // Fill form
    answerId.value = answer.id
    answerQuestionId.value = question.id
    answerQuestionTitle.value = question.title
    answerContent.value = answer.content
    answerAuthor.value = answer.userId || ""
    answerStatus.value = answer.status || "active"

    // Open modal
    answerModal.style.display = "block"
  }

  function openAddTagModal() {
    // Set modal title
    tagModalTitle.textContent = "Add New Tag"

    // Clear form
    tagForm.reset()
    tagId.value = ""

    // Open modal
    tagModal.style.display = "block"
  }

  function openEditTagModal(tagName) {
    //  Set modal title
    tagModalTitle.textContent = "Edit Tag"

    // Fill form
    tagId.value = tagName
    tagName.value = tagName
    tagDescription.value = "" // We don't have descriptions for tags yet

    // Open modal
    tagModal.style.display = "block"
  }

  function openMergeTagsModal() {
    // Clear form
    mergeTagsForm.reset()

    // Open modal
    mergeTagsModal.style.display = "block"
  }

  function closeQuestionModal() {
    questionModal.style.display = "none"
  }

  function closeAnswerModal() {
    answerModal.style.display = "none"
  }

  function closeTagModal() {
    tagModal.style.display = "none"
  }

  function closeMergeTagsModal() {
    mergeTagsModal.style.display = "none"
  }

  function closeAllModals() {
    closeQuestionModal()
    closeAnswerModal()
    closeTagModal()
    closeMergeTagsModal()
  }

  function saveQuestion() {
    // Get form values
    const id = questionId.value ? Number.parseInt(questionId.value) : null
    const title = questionTitle.value.trim()
    const content = questionContent.value.trim()
    const collegeId = questionCollege.value ? Number.parseInt(questionCollege.value) : null
    const tags = questionTags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    const userId = questionAuthor.value ? Number.parseInt(questionAuthor.value) : null
    const status = questionStatus.value

    if (id) {
      // Update existing question
      const questionIndex = questions.findIndex((q) => q.id === id)

      if (questionIndex !== -1) {
        questions[questionIndex] = {
          ...questions[questionIndex],
          title,
          content,
          collegeId,
          tags,
          userId,
          status,
          updatedAt: new Date().toISOString(),
        }

        // Save to localStorage
        localStorage.setItem("questions", JSON.stringify(questions))

        // Show success message
        alert("Question updated successfully")
      }
    } else {
      // Create new question
      const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1

      const newQuestion = {
        id: newId,
        title,
        content,
        collegeId,
        tags,
        userId,
        status,
        views: 0,
        answers: [],
        createdAt: new Date().toISOString(),
      }

      // Add to questions array
      questions.push(newQuestion)

      // Save to localStorage
      localStorage.setItem("questions", JSON.stringify(questions))

      // Show success message
      alert("Question created successfully")
    }

    // Close modal
    closeQuestionModal()

    // Refresh table
    filterQuestions()
  }

  function saveAnswer() {
    // Get form values
    const id = answerId.value ? Number.parseInt(answerId.value) : null
    const questionId = Number.parseInt(answerQuestionId.value)
    const content = answerContent.value.trim()
    const userId = answerAuthor.value ? Number.parseInt(answerAuthor.value) : null
    const status = answerStatus.value

    // Find question
    const questionIndex = questions.findIndex((q) => q.id === questionId)

    if (questionIndex === -1) {
      alert("Question not found")
      return
    }

    if (id) {
      // Update existing answer
      if (!questions[questionIndex].answers) {
        questions[questionIndex].answers = []
      }

      const answerIndex = questions[questionIndex].answers.findIndex((a) => a.id === id)

      if (answerIndex !== -1) {
        questions[questionIndex].answers[answerIndex] = {
          ...questions[questionIndex].answers[answerIndex],
          content,
          userId,
          status,
          updatedAt: new Date().toISOString(),
        }

        // Save to localStorage
        localStorage.setItem("questions", JSON.stringify(questions))

        // Show success message
        alert("Answer updated successfully")
      }
    } else {
      // Create new answer
      if (!questions[questionIndex].answers) {
        questions[questionIndex].answers = []
      }

      const newId =
        questions[questionIndex].answers.length > 0
          ? Math.max(...questions[questionIndex].answers.map((a) => a.id)) + 1
          : 1

      const newAnswer = {
        id: newId,
        content,
        userId,
        status,
        upvotes: 0,
        createdAt: new Date().toISOString(),
      }

      // Add to answers array
      questions[questionIndex].answers.push(newAnswer)

      // Save to localStorage
      localStorage.setItem("questions", JSON.stringify(questions))

      // Show success message
      alert("Answer created successfully")
    }

    // Close modal
    closeAnswerModal()

    // Refresh tables
    filterQuestions()
    filterAnswers()
  }

  function saveTag() {
    // Get form values
    const oldTagName = tagId.value
    const newTagName = tagName.value.trim()

    if (oldTagName && oldTagName !== newTagName) {
      // Rename tag in all questions
      questions.forEach((question) => {
        if (question.tags && question.tags.includes(oldTagName)) {
          const tagIndex = question.tags.indexOf(oldTagName)
          question.tags[tagIndex] = newTagName
        }
      })

      // Save to localStorage
      localStorage.setItem("questions", JSON.stringify(questions))

      // Show success message
      alert("Tag updated successfully")
    } else if (!oldTagName) {
      // This is a new tag, but we can't add it directly since tags are only added to questions
      alert("New tag created. You can now use it when creating or editing questions.")
    }

    // Close modal
    closeTagModal()

    // Refresh data
    window.location.reload()
  }

  function mergeTags() {
    // Get form values
    const sourceTagName = sourceTag.value
    const targetTagName = targetTag.value

    if (sourceTagName === targetTagName) {
      alert("Source and target tags cannot be the same")
      return
    }

    // Replace source tag with target tag in all questions
    questions.forEach((question) => {
      if (question.tags && question.tags.includes(sourceTagName)) {
        // Remove source tag
        question.tags = question.tags.filter((tag) => tag !== sourceTagName)

        // Add target tag if not already present
        if (!question.tags.includes(targetTagName)) {
          question.tags.push(targetTagName)
        }
      }
    })

    // Save to localStorage
    localStorage.setItem("questions", JSON.stringify(questions))

    // Show success message
    alert(`Tags merged successfully. All questions with the tag "${sourceTagName}" now have the tag "${targetTagName}"`)

    // Close modal
    closeMergeTagsModal()

    // Refresh data
    window.location.reload()
  }

  function deleteQuestion(id) {
    // Confirm deletion
    if (confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      // Find question index
      const questionIndex = questions.findIndex((q) => q.id === Number.parseInt(id))

      if (questionIndex !== -1) {
        // Remove question
        questions.splice(questionIndex, 1)

        // Save to localStorage
        localStorage.setItem("questions", JSON.stringify(questions))

        // Show success message
        alert("Question deleted successfully")

        // Refresh table
        filterQuestions()
      }
    }
  }

  function deleteAnswer(answerId, questionId) {
    // Confirm deletion
    if (confirm("Are you sure you want to delete this answer? This action cannot be undone.")) {
      // Find question
      const questionIndex = questions.findIndex((q) => q.id === Number.parseInt(questionId))

      if (questionIndex !== -1 && questions[questionIndex].answers) {
        // Find answer index
        const answerIndex = questions[questionIndex].answers.findIndex((a) => a.id === Number.parseInt(answerId))

        if (answerIndex !== -1) {
          // Remove answer
          questions[questionIndex].answers.splice(answerIndex, 1)

          // Save to localStorage
          localStorage.setItem("questions", JSON.stringify(questions))

          // Show success message
          alert("Answer deleted successfully")

          // Refresh tables
          filterQuestions()
          filterAnswers()
        }
      }
    }
  }

  function deleteTag(tagName) {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete the tag "${tagName}"? It will be removed from all questions.`)) {
      // Remove tag from all questions
      questions.forEach((question) => {
        if (question.tags && question.tags.includes(tagName)) {
          question.tags = question.tags.filter((tag) => tag !== tagName)
        }
      })

      // Save to localStorage
      localStorage.setItem("questions", JSON.stringify(questions))

      // Show success message
      alert("Tag deleted successfully")

      // Refresh data
      window.location.reload()
    }
  }

  function exportQuestions() {
    // Create CSV content
    let csvContent = "ID,Title,Content,College,Author,Posted,Answers,Views,Status,Tags\n"

    filteredQuestions.forEach((question) => {
      // Find college name
      let collegeName = ""
      if (question.collegeId) {
        const college = colleges.find((c) => c.id === question.collegeId)
        if (college) {
          collegeName = college.name
        }
      }

      // Find author name
      let authorName = ""
      if (question.userId) {
        const author = users.find((u) => u.id === question.userId)
        if (author) {
          authorName = author.name
        }
      }

      // Count answers
      const answersCount = question.answers ? question.answers.length : 0

      // Get question status
      const status = question.status || "unresolved"

      // Format tags
      const tags = question.tags ? question.tags.join("; ") : ""

      // Format content (remove line breaks and quotes)
      const content = question.content.replace(/\n/g, " ").replace(/"/g, '""')

      csvContent += `${question.id},"${question.title}","${content}","${collegeName}","${authorName}","${formatDate(question.createdAt)}",${answersCount},${question.views || 0},"${status}","${tags}"\n`
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "questions.csv"
    a.click()

    // Clean up
    URL.revokeObjectURL(url)
  }

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
})

// Add styles for Q&A management page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .admin-tabs {
            display: flex;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--admin-border-color);
        }
        
        .admin-tab {
            padding: 0.75rem 1.5rem;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            font-weight: 600;
            color: var(--admin-secondary);
            cursor: pointer;
            transition: var(--admin-transition);
        }
        
        .admin-tab:hover {
            color: var(--admin-primary);
        }
        
        .admin-tab.active {
            color: var(--admin-primary);
            border-bottom-color: var(--admin-primary);
        }
        
        .admin-tab-content {
            display: none;
        }
        
        .admin-tab-content.active {
            display: block;
        }
        
        .answer-excerpt {
            max-width: 300px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .tags-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .tag-card {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .tag-card-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .tag-name {
            margin: 0;
            font-size: 1rem;
        }
        
        .tag-count {
            background-color: var(--admin-light-bg);
            color: var(--admin-secondary);
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.5rem;
            border-radius: 1rem;
        }
        
        .tag-card-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status-success {
            background-color: rgba(28, 200, 138, 0.1);
            color: rgb(28, 200, 138);
        }
        
        .status-warning {
            background-color: rgba(246, 194, 62, 0.1);
            color: rgb(246, 194, 62);
        }
        
        .status-danger {
            background-color: rgba(231, 74, 59, 0.1);
            color: rgb(231, 74, 59);
        }
        
        @media (max-width: 768px) {
            .admin-tabs {
                flex-wrap: wrap;
            }
            
            .admin-tab {
                flex: 1;
                text-align: center;
                padding: 0.75rem 0.5rem;
            }
            
            .answer-excerpt {
                max-width: 150px;
            }
        }
    `
  document.head.appendChild(style)
})
