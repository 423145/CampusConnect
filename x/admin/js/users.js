// User Management JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("User management script loaded")

  // Get DOM elements
  const userSearch = document.getElementById("user-search")
  const roleFilter = document.getElementById("role-filter")
  const collegeFilter = document.getElementById("college-filter")
  const statusFilter = document.getElementById("status-filter")
  const addUserBtn = document.getElementById("add-user-btn")
  const exportUsersBtn = document.getElementById("export-users-btn")
  const selectAllUsers = document.getElementById("select-all-users")
  const usersTableBody = document.getElementById("users-table-body")
  const usersPagination = document.getElementById("users-pagination")

  // Modal elements
  const userModal = document.getElementById("user-modal")
  const userModalTitle = document.getElementById("user-modal-title")
  const userForm = document.getElementById("user-form")
  const userId = document.getElementById("user-id")
  const userName = document.getElementById("user-name")
  const userEmail = document.getElementById("user-email")
  const userPassword = document.getElementById("user-password")
  const userRole = document.getElementById("user-role")
  const userCollege = document.getElementById("user-college")
  const collegeGroup = document.getElementById("college-group")
  const userBio = document.getElementById("user-bio")
  const userStatus = document.getElementById("user-status")
  const cancelUserBtn = document.getElementById("cancel-user-btn")
  const modalCloseButtons = document.querySelectorAll(".admin-modal-close")

  // View user modal elements
  const viewUserModal = document.getElementById("view-user-modal")
  const viewUserAvatar = document.getElementById("view-user-avatar")
  const viewUserName = document.getElementById("view-user-name")
  const viewUserRole = document.getElementById("view-user-role")
  const viewUserEmail = document.getElementById("view-user-email")
  const viewUserCollege = document.getElementById("view-user-college")
  const viewUserBio = document.getElementById("view-user-bio")
  const viewUserStatus = document.getElementById("view-user-status")
  const viewUserJoined = document.getElementById("view-user-joined")
  const viewUserQuestions = document.getElementById("view-user-questions")
  const viewUserAnswers = document.getElementById("view-user-answers")
  const viewUserUpvotes = document.getElementById("view-user-upvotes")
  const editUserBtn = document.getElementById("edit-user-btn")
  const viewProfileBtn = document.getElementById("view-profile-btn")

  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const colleges = JSON.parse(localStorage.getItem("colleges") || "[]")
  const questions = JSON.parse(localStorage.getItem("questions") || "[]")

  // Pagination variables
  let currentPage = 1
  const itemsPerPage = 10
  let filteredUsers = [...users]

  // Declare helper functions
  function formatDate(dateString) {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  function showToast(message) {
    alert(message) // Replace with a more sophisticated toast notification
  }

  function showConfirmDialog(message, callback) {
    if (confirm(message)) {
      callback()
    }
  }

  // Populate college filters
  populateCollegeDropdowns()

  // Load users table
  loadUsersTable()

  // Event listeners
  userSearch.addEventListener("input", () => {
    currentPage = 1
    filterUsers()
  })

  roleFilter.addEventListener("change", () => {
    currentPage = 1
    filterUsers()
  })

  collegeFilter.addEventListener("change", () => {
    currentPage = 1
    filterUsers()
  })

  statusFilter.addEventListener("change", () => {
    currentPage = 1
    filterUsers()
  })

  selectAllUsers.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".user-checkbox")
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked
    })
  })

  addUserBtn.addEventListener("click", () => {
    openAddUserModal()
  })

  exportUsersBtn.addEventListener("click", () => {
    exportUsers()
  })

  userRole.addEventListener("change", () => {
    toggleCollegeField()
  })

  userForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveUser()
  })

  cancelUserBtn.addEventListener("click", () => {
    closeUserModal()
  })

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeUserModal()
      closeViewUserModal()
    })
  })

  editUserBtn.addEventListener("click", () => {
    const userId = editUserBtn.dataset.userId
    closeViewUserModal()
    openEditUserModal(userId)
  })

  viewProfileBtn.addEventListener("click", () => {
    const userId = viewProfileBtn.dataset.userId
    window.open(`../pages/profile.html?id=${userId}`, "_blank")
  })

  // Functions
  function populateCollegeDropdowns() {
    // Sort colleges by name
    const sortedColleges = [...colleges].sort((a, b) => a.name.localeCompare(b.name))

    // Populate college filter
    sortedColleges.forEach((college) => {
      const option = document.createElement("option")
      option.value = college.name
      option.textContent = college.name
      collegeFilter.appendChild(option)

      // Also populate the college dropdown in the user form
      const formOption = document.createElement("option")
      formOption.value = college.name
      formOption.textContent = college.name
      userCollege.appendChild(formOption)
    })
  }

  function filterUsers() {
    const searchTerm = userSearch.value.toLowerCase()
    const roleValue = roleFilter.value
    const collegeValue = collegeFilter.value
    const statusValue = statusFilter.value

    filteredUsers = users.filter((user) => {
      // Search filter
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)

      // Role filter
      const matchesRole = roleValue === "all" || user.role === roleValue

      // College filter
      const matchesCollege =
        collegeValue === "all" || (collegeValue === "" && !user.college) || user.college === collegeValue

      // Status filter (mock data as we don't have status in our user objects)
      const userStatus = user.status || "active" // Default to active
      const matchesStatus = statusValue === "all" || userStatus === statusValue

      return matchesSearch && matchesRole && matchesCollege && matchesStatus
    })

    loadUsersTable()
  }

  function loadUsersTable() {
    // Clear table body
    usersTableBody.innerHTML = ""

    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    // Display users
    if (paginatedUsers.length === 0) {
      const emptyRow = document.createElement("tr")
      emptyRow.innerHTML = `
                <td colspan="8" class="text-center">No users found</td>
            `
      usersTableBody.appendChild(emptyRow)
    } else {
      paginatedUsers.forEach((user) => {
        const row = document.createElement("tr")

        // Get user status (mock data)
        const userStatus = user.status || "active"

        // Get status badge class
        let statusBadgeClass = ""
        switch (userStatus) {
          case "active":
            statusBadgeClass = "status-active"
            break
          case "inactive":
            statusBadgeClass = "status-inactive"
            break
          case "pending":
            statusBadgeClass = "status-pending"
            break
          default:
            statusBadgeClass = "status-active"
        }

        row.innerHTML = `
                    <td>
                        <input type="checkbox" class="user-checkbox" data-id="${user.id}">
                    </td>
                    <td>
                        <div class="user-name-cell">
                            <div class="user-avatar-small">
                                ${
                                  user.avatar
                                    ? `<img src="${user.avatar}" alt="${user.name}">`
                                    : `<span>${getInitials(user.name)}</span>`
                                }
                            </div>
                            <span>${user.name}</span>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td>${capitalizeFirstLetter(user.role)}</td>
                    <td>${user.college || "-"}</td>
                    <td>${formatDate(user.createdAt)}</td>
                    <td><span class="status-badge ${statusBadgeClass}">${capitalizeFirstLetter(userStatus)}</span></td>
                    <td>
                        <div class="actions">
                            <button class="btn-icon btn-view view-user-btn" data-id="${user.id}" title="View User">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon btn-edit edit-user-btn" data-id="${user.id}" title="Edit User">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete delete-user-btn" data-id="${user.id}" title="Delete User">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `

        usersTableBody.appendChild(row)
      })

      // Add event listeners to action buttons
      document.querySelectorAll(".view-user-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const userId = this.dataset.id
          openViewUserModal(userId)
        })
      })

      document.querySelectorAll(".edit-user-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const userId = this.dataset.id
          openEditUserModal(userId)
        })
      })

      document.querySelectorAll(".delete-user-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const userId = this.dataset.id
          deleteUser(userId)
        })
      })
    }

    // Update pagination
    updatePagination(totalPages)
  }

  function updatePagination(totalPages) {
    usersPagination.innerHTML = ""

    if (totalPages <= 1) {
      return
    }

    // Previous button
    const prevItem = document.createElement("div")
    prevItem.className = `page-item ${currentPage === 1 ? "disabled" : ""}`
    prevItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i>
            </a>
        `
    usersPagination.appendChild(prevItem)

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("div")
      pageItem.className = `page-item ${i === currentPage ? "active" : ""}`
      pageItem.innerHTML = `
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            `
      usersPagination.appendChild(pageItem)
    }

    // Next button
    const nextItem = document.createElement("div")
    nextItem.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
    nextItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        `
    usersPagination.appendChild(nextItem)

    // Add event listeners to pagination links
    document.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        if (this.parentElement.classList.contains("disabled")) {
          return
        }

        currentPage = Number.parseInt(this.dataset.page)
        loadUsersTable()
      })
    })
  }

  function openAddUserModal() {
    // Set modal title
    userModalTitle.textContent = "Add New User"

    // Clear form
    userForm.reset()
    userId.value = ""

    // Show password field
    userPassword.required = true
    userPassword.parentElement.style.display = "block"

    // Hide college field initially
    collegeGroup.style.display = "none"

    // Open modal
    userModal.style.display = "block"
  }

  function openEditUserModal(id) {
    // Find user
    const user = users.find((u) => u.id === Number.parseInt(id))

    if (!user) {
      return
    }

    // Set modal title
    userModalTitle.textContent = "Edit User"

    // Fill form
    userId.value = user.id
    userName.value = user.name
    userEmail.value = user.email
    userPassword.value = ""
    userRole.value = user.role
    userCollege.value = user.college || ""
    userBio.value = user.bio || ""
    userStatus.value = user.status || "active"

    // Password is optional when editing
    userPassword.required = false
    userPassword.parentElement.style.display = "block"

    // Show/hide college field based on role
    toggleCollegeField()

    // Open modal
    userModal.style.display = "block"
  }

  function openViewUserModal(id) {
    // Find user
    const user = users.find((u) => u.id === Number.parseInt(id))

    if (!user) {
      return
    }

    // Count user questions
    const userQuestions = questions.filter((q) => q.userId === user.id).length

    // Count user answers
    let userAnswersCount = 0
    let userUpvotesCount = 0

    questions.forEach((question) => {
      if (question.answers) {
        const userAnswers = question.answers.filter((a) => a.userId === user.id)
        userAnswersCount += userAnswers.length

        // Count upvotes
        userAnswers.forEach((answer) => {
          userUpvotesCount += answer.upvotes || 0
        })
      }
    })

    // Update view modal
    if (user.avatar) {
      viewUserAvatar.innerHTML = `<img src="${user.avatar}" alt="${user.name}">`
    } else {
      viewUserAvatar.innerHTML = `<span>${getInitials(user.name)}</span>`
    }

    viewUserName.textContent = user.name
    viewUserRole.textContent = capitalizeFirstLetter(user.role)
    viewUserEmail.textContent = user.email
    viewUserCollege.textContent = user.college || "No college specified"
    viewUserBio.textContent = user.bio || "No bio provided"

    // Set status badge
    const userStatus = user.status || "active"
    let statusBadgeClass = ""

    switch (userStatus) {
      case "active":
        statusBadgeClass = "status-active"
        break
      case "inactive":
        statusBadgeClass = "status-inactive"
        break
      case "pending":
        statusBadgeClass = "status-pending"
        break
      default:
        statusBadgeClass = "status-active"
    }

    viewUserStatus.innerHTML = `<span class="status-badge ${statusBadgeClass}">${capitalizeFirstLetter(userStatus)}</span>`
    viewUserJoined.textContent = formatDate(user.createdAt)
    viewUserQuestions.textContent = userQuestions
    viewUserAnswers.textContent = userAnswersCount
    viewUserUpvotes.textContent = userUpvotesCount

    // Set user ID for action buttons
    editUserBtn.dataset.userId = user.id
    viewProfileBtn.dataset.userId = user.id

    // Open modal
    viewUserModal.style.display = "block"
  }

  function closeUserModal() {
    userModal.style.display = "none"
  }

  function closeViewUserModal() {
    viewUserModal.style.display = "none"
  }

  function toggleCollegeField() {
    const role = userRole.value

    if (role === "current student" || role === "alumni" || role === "faculty") {
      collegeGroup.style.display = "block"
      userCollege.required = true
    } else {
      collegeGroup.style.display = "none"
      userCollege.required = false
      userCollege.value = ""
    }
  }

  function saveUser() {
    // Get form values
    const id = userId.value ? Number.parseInt(userId.value) : null
    const name = userName.value.trim()
    const email = userEmail.value.trim()
    const password = userPassword.value
    const role = userRole.value
    const college = userCollege.value
    const bio = userBio.value.trim()
    const status = userStatus.value

    // Validate email uniqueness
    const emailExists = users.some((u) => u.email === email && u.id !== id)

    if (emailExists) {
      alert("Email already in use")
      return
    }

    if (id) {
      // Update existing user
      const userIndex = users.findIndex((u) => u.id === id)

      if (userIndex !== -1) {
        // Keep existing password if not provided
        const existingPassword = users[userIndex].password

        users[userIndex] = {
          ...users[userIndex],
          name,
          email,
          password: password || existingPassword,
          role,
          college: college || null,
          bio,
          status,
          updatedAt: new Date().toISOString(),
        }

        // Save to localStorage
        localStorage.setItem("users", JSON.stringify(users))

        // Show success message
        showToast("User updated successfully")
      }
    } else {
      // Create new user
      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

      const newUser = {
        id: newId,
        name,
        email,
        password,
        role,
        college: college || null,
        bio,
        avatar: null,
        status,
        createdAt: new Date().toISOString(),
      }

      // Add to users array
      users.push(newUser)

      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(users))

      // Show success message
      showToast("User created successfully")
    }

    // Close modal
    closeUserModal()

    // Refresh table
    filterUsers()
  }

  function deleteUser(id) {
    // Confirm deletion
    showConfirmDialog("Are you sure you want to delete this user?", () => {
      // Find user index
      const userIndex = users.findIndex((u) => u.id === Number.parseInt(id))

      if (userIndex !== -1) {
        // Remove user
        users.splice(userIndex, 1)

        // Save to localStorage
        localStorage.setItem("users", JSON.stringify(users))

        // Show success message
        showToast("User deleted successfully")

        // Refresh table
        filterUsers()
      }
    })
  }

  function exportUsers() {
    // Create CSV content
    let csvContent = "ID,Name,Email,Role,College,Joined,Status\n"

    filteredUsers.forEach((user) => {
      const status = user.status || "active"
      const college = user.college || ""
      const joined = formatDate(user.createdAt)

      csvContent += `${user.id},"${user.name}","${user.email}","${user.role}","${college}","${joined}","${status}"\n`
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()

    // Clean up
    URL.revokeObjectURL(url)

    // Show success message
    showToast("Users exported successfully")
  }

  // Helper function to get initials from name
  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
})

// Add styles for user management page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .admin-tools {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.5rem;
        }
        
        .admin-filters {
            display: flex;
            gap: 1rem;
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .filter-group label {
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .admin-actions {
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
        }
        
        .admin-table-container {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            overflow: hidden;
            margin-bottom: 1.5rem;
        }
        
        .user-name-cell {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .user-avatar-small {
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            background-color: var(--admin-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 600;
            overflow: hidden;
        }
        
        .user-avatar-small img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        /* Modal Styles */
        .admin-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            overflow: auto;
        }
        
        .admin-modal-content {
            background-color: white;
            margin: 2rem auto;
            width: 90%;
            max-width: 600px;
            border-radius: 0.35rem;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .admin-modal-header {
            padding: 1.25rem;
            border-bottom: 1px solid var(--admin-border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .admin-modal-header h2 {
            margin: 0;
            font-size: 1.25rem;
        }
        
        .admin-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--admin-secondary);
            transition: var(--admin-transition);
        }
        
        .admin-modal-close:hover {
            color: var(--admin-danger);
        }
        
        .admin-modal-body {
            padding: 1.25rem;
        }
        
        /* User Profile Styles */
        .user-profile-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .user-profile .user-avatar {
            width: 5rem;
            height: 5rem;
            border-radius: 50%;
            background-color: var(--admin-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 600;
            overflow: hidden;
        }
        
        .user-profile .user-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .user-info h3 {
            margin: 0 0 0.5rem;
            font-size: 1.5rem;
        }
        
        .user-info p {
            margin: 0 0 0.25rem;
            color: var(--admin-secondary);
        }
        
        .user-profile-details {
            margin-bottom: 1.5rem;
        }
        
        .detail-group {
            margin-bottom: 1.25rem;
        }
        
        .detail-group h4 {
            margin: 0 0 0.5rem;
            font-size: 0.9rem;
            color: var(--admin-secondary);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-group p {
            margin: 0;
            font-size: 1rem;
        }
        
        .user-stats {
            display: flex;
            gap: 2rem;
        }
        
        .user-stats .stat {
            text-align: center;
        }
        
        .user-stats .stat span {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--admin-primary);
            margin-bottom: 0.25rem;
        }
        
        .user-stats .stat label {
            font-size: 0.85rem;
            color: var(--admin-secondary);
        }
        
        .user-profile-actions {
            display: flex;
            gap: 1rem;
        }
        
        @media (max-width: 768px) {
            .admin-tools {
                flex-direction: column;
                gap: 1rem;
            }
            
            .admin-filters {
                flex-direction: column;
            }
            
            .admin-table {
                display: block;
                overflow-x: auto;
            }
            
            .user-profile-header {
                flex-direction: column;
                align-items: flex-start;
                text-align: center;
            }
            
            .user-profile .user-avatar {
                margin: 0 auto 1rem;
            }
            
            .user-stats {
                flex-direction: column;
                gap: 1rem;
            }
            
            .user-profile-actions {
                flex-direction: column;
            }
        }
    `
  document.head.appendChild(style)
})
