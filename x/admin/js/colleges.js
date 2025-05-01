// College Management JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("College management script loaded")

  // Get DOM elements
  const collegeSearch = document.getElementById("college-search")
  const rankingFilter = document.getElementById("ranking-filter")
  const locationFilter = document.getElementById("location-filter")
  const addCollegeBtn = document.getElementById("add-college-btn")
  const exportCollegesBtn = document.getElementById("export-colleges-btn")
  const collegesGrid = document.getElementById("colleges-grid")
  const collegesPagination = document.getElementById("colleges-pagination")

  // Modal elements
  const collegeModal = document.getElementById("college-modal")
  const collegeModalTitle = document.getElementById("college-modal-title")
  const collegeForm = document.getElementById("college-form")
  const collegeId = document.getElementById("college-id")
  const collegeName = document.getElementById("college-name")
  const collegeLocation = document.getElementById("college-location")
  const collegeDescription = document.getElementById("college-description")
  const collegeRanking = document.getElementById("college-ranking")
  const collegeWebsite = document.getElementById("college-website")
  const collegeLogo = document.getElementById("college-logo")
  const cancelCollegeBtn = document.getElementById("cancel-college-btn")
  const modalCloseButtons = document.querySelectorAll(".admin-modal-close")

  // View college modal elements
  const viewCollegeModal = document.getElementById("view-college-modal")
  const viewCollegeLogo = document.getElementById("view-college-logo")
  const viewCollegeName = document.getElementById("view-college-name")
  const viewCollegeLocation = document.getElementById("view-college-location")
  const viewCollegeWebsite = document.getElementById("view-college-website")
  const viewCollegeDescription = document.getElementById("view-college-description")
  const viewCollegeRanking = document.getElementById("view-college-ranking")
  const viewCollegeQuestions = document.getElementById("view-college-questions")
  const viewCollegeAnswers = document.getElementById("view-college-answers")
  const viewCollegeUsers = document.getElementById("view-college-users")
  const editCollegeBtn = document.getElementById("edit-college-btn")
  const viewCollegePageBtn = document.getElementById("view-college-page-btn")

  // Get data from localStorage
  const colleges = JSON.parse(localStorage.getItem("colleges") || "[]")
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const questions = JSON.parse(localStorage.getItem("questions") || "[]")

  // Pagination variables
  let currentPage = 1
  const itemsPerPage = 8
  let filteredColleges = [...colleges]

  // Populate location filter
  populateLocationFilter()

  // Load colleges grid
  loadCollegesGrid()

  // Event listeners
  collegeSearch.addEventListener("input", () => {
    currentPage = 1
    filterColleges()
  })

  rankingFilter.addEventListener("change", () => {
    currentPage = 1
    filterColleges()
  })

  locationFilter.addEventListener("change", () => {
    currentPage = 1
    filterColleges()
  })

  addCollegeBtn.addEventListener("click", () => {
    openAddCollegeModal()
  })

  exportCollegesBtn.addEventListener("click", () => {
    exportColleges()
  })

  collegeForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveCollege()
  })

  cancelCollegeBtn.addEventListener("click", () => {
    closeCollegeModal()
  })

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeCollegeModal()
      closeViewCollegeModal()
    })
  })

  editCollegeBtn.addEventListener("click", () => {
    const collegeId = editCollegeBtn.dataset.collegeId
    closeViewCollegeModal()
    openEditCollegeModal(collegeId)
  })

  viewCollegePageBtn.addEventListener("click", () => {
    const collegeId = viewCollegePageBtn.dataset.collegeId
    window.open(`../pages/college-detail.html?id=${collegeId}`, "_blank")
  })

  // Functions
  function populateLocationFilter() {
    // Get unique locations
    const locations = [
      ...new Set(
        colleges.map((college) => {
          // Extract state from location (e.g., "Cambridge, MA" -> "MA")
          const locationParts = college.location.split(",")
          return locationParts.length > 1 ? locationParts[1].trim() : college.location.trim()
        }),
      ),
    ]

    // Sort locations alphabetically
    locations.sort()

    // Populate location filter
    locations.forEach((location) => {
      const option = document.createElement("option")
      option.value = location
      option.textContent = location
      locationFilter.appendChild(option)
    })
  }

  function filterColleges() {
    const searchTerm = collegeSearch.value.toLowerCase()
    const rankingValue = rankingFilter.value
    const locationValue = locationFilter.value

    filteredColleges = colleges.filter((college) => {
      // Search filter
      const matchesSearch =
        college.name.toLowerCase().includes(searchTerm) ||
        college.location.toLowerCase().includes(searchTerm) ||
        (college.description && college.description.toLowerCase().includes(searchTerm))

      // Ranking filter
      let matchesRanking = true
      if (rankingValue !== "all") {
        const ranking = college.ranking || Number.POSITIVE_INFINITY

        switch (rankingValue) {
          case "top10":
            matchesRanking = ranking <= 10
            break
          case "top50":
            matchesRanking = ranking <= 50
            break
          case "top100":
            matchesRanking = ranking <= 100
            break
        }
      }

      // Location filter
      let matchesLocation = true
      if (locationValue !== "all") {
        const locationParts = college.location.split(",")
        const state = locationParts.length > 1 ? locationParts[1].trim() : college.location.trim()
        matchesLocation = state === locationValue
      }

      return matchesSearch && matchesRanking && matchesLocation
    })

    loadCollegesGrid()
  }

  function loadCollegesGrid() {
    // Clear grid
    collegesGrid.innerHTML = ""

    // Calculate pagination
    const totalPages = Math.ceil(filteredColleges.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedColleges = filteredColleges.slice(startIndex, endIndex)

    // Display colleges
    if (paginatedColleges.length === 0) {
      collegesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-university"></i>
                    <h3>No colleges found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `
    } else {
      paginatedColleges.forEach((college) => {
        // Count questions for this college
        const collegeQuestions = questions.filter((q) => q.collegeId === college.id).length

        // Count users for this college
        const collegeUsers = users.filter((u) => u.college === college.name).length

        const collegeCard = document.createElement("div")
        collegeCard.className = "college-card"

        collegeCard.innerHTML = `
                    <div class="college-card-header">
                        <div class="college-logo">
                            ${
                              college.logo
                                ? `<img src="${college.logo}" alt="${college.name}">`
                                : `<span>${college.name.charAt(0)}</span>`
                            }
                        </div>
                        <div class="college-ranking">
                            ${college.ranking ? `<span class="ranking-badge">#${college.ranking}</span>` : ""}
                        </div>
                    </div>
                    <div class="college-card-body">
                        <h3 class="college-name">${college.name}</h3>
                        <p class="college-location"><i class="fas fa-map-marker-alt"></i> ${college.location}</p>
                        <p class="college-description">${college.description ? college.description.substring(0, 100) + (college.description.length > 100 ? "..." : "") : "No description available"}</p>
                    </div>
                    <div class="college-card-footer">
                        <div class="college-stats">
                            <div class="stat">
                                <i class="fas fa-question-circle"></i>
                                <span>${collegeQuestions}</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-users"></i>
                                <span>${collegeUsers}</span>
                            </div>
                        </div>
                        <div class="college-actions">
                            <button class="btn-icon btn-view view-college-btn" data-id="${college.id}" title="View College">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-icon btn-edit edit-college-btn" data-id="${college.id}" title="Edit College">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon btn-delete delete-college-btn" data-id="${college.id}" title="Delete College">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                `

        collegesGrid.appendChild(collegeCard)
      })

      // Add event listeners to action buttons
      document.querySelectorAll(".view-college-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const collegeId = Number.parseInt(this.dataset.id)
          openViewCollegeModal(collegeId)
        })
      })

      document.querySelectorAll(".edit-college-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const collegeId = Number.parseInt(this.dataset.id)
          openEditCollegeModal(collegeId)
        })
      })

      document.querySelectorAll(".delete-college-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const collegeId = Number.parseInt(this.dataset.id)
          deleteCollege(collegeId)
        })
      })
    }

    // Update pagination
    updatePagination(totalPages)
  }

  function updatePagination(totalPages) {
    collegesPagination.innerHTML = ""

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
    collegesPagination.appendChild(prevItem)

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("div")
      pageItem.className = `page-item ${i === currentPage ? "active" : ""}`
      pageItem.innerHTML = `
                <a href="#" class="page-link" data-page="${i}">${i}</a>
            `
      collegesPagination.appendChild(pageItem)
    }

    // Next button
    const nextItem = document.createElement("div")
    nextItem.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
    nextItem.innerHTML = `
            <a href="#" class="page-link" data-page="${currentPage + 1}">
                <i class="fas fa-chevron-right"></i>
            </a>
        `
    collegesPagination.appendChild(nextItem)

    // Add event listeners to pagination links
    document.querySelectorAll(".page-link").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()

        if (this.parentElement.classList.contains("disabled")) {
          return
        }

        currentPage = Number.parseInt(this.dataset.page)
        loadCollegesGrid()
      })
    })
  }

  function openAddCollegeModal() {
    // Set modal title
    collegeModalTitle.textContent = "Add New College"

    // Clear form
    collegeForm.reset()
    collegeId.value = ""

    // Open modal
    collegeModal.style.display = "block"
  }

  function openEditCollegeModal(id) {
    // Find college
    const college = colleges.find((c) => c.id === id)

    if (!college) {
      return
    }

    // Set modal title
    collegeModalTitle.textContent = "Edit College"

    // Fill form
    collegeId.value = college.id
    collegeName.value = college.name
    collegeLocation.value = college.location
    collegeDescription.value = college.description || ""
    collegeRanking.value = college.ranking || ""
    collegeWebsite.value = college.website || ""

    // Open modal
    collegeModal.style.display = "block"
  }

  function openViewCollegeModal(id) {
    // Find college
    const college = colleges.find((c) => c.id === id)

    if (!college) {
      return
    }

    // Count questions for this college
    const collegeQuestions = questions.filter((q) => q.collegeId === college.id)

    // Count answers for this college
    let answersCount = 0
    collegeQuestions.forEach((question) => {
      if (question.answers) {
        answersCount += question.answers.length
      }
    })

    // Count users for this college
    const collegeUsers = users.filter((u) => u.college === college.name).length

    // Update view modal
    if (college.logo) {
      viewCollegeLogo.innerHTML = `<img src="${college.logo}" alt="${college.name}">`
    } else {
      viewCollegeLogo.innerHTML = `<span>${college.name.charAt(0)}</span>`
    }

    viewCollegeName.textContent = college.name
    viewCollegeLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${college.location}`

    if (college.website) {
      viewCollegeWebsite.innerHTML = `<i class="fas fa-globe"></i> <a href="${college.website}" target="_blank">${college.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>`
      viewCollegeWebsite.style.display = "block"
    } else {
      viewCollegeWebsite.style.display = "none"
    }

    viewCollegeDescription.textContent = college.description || "No description available"

    if (college.ranking) {
      viewCollegeRanking.innerHTML = `<span class="ranking-badge">#${college.ranking}</span>`
    } else {
      viewCollegeRanking.textContent = "Not ranked"
    }

    viewCollegeQuestions.textContent = collegeQuestions.length
    viewCollegeAnswers.textContent = answersCount
    viewCollegeUsers.textContent = collegeUsers

    // Set college ID for action buttons
    editCollegeBtn.dataset.collegeId = college.id
    viewCollegePageBtn.dataset.collegeId = college.id

    // Open modal
    viewCollegeModal.style.display = "block"
  }

  function closeCollegeModal() {
    collegeModal.style.display = "none"
  }

  function closeViewCollegeModal() {
    viewCollegeModal.style.display = "none"
  }

  function saveCollege() {
    // Get form values
    const id = collegeId.value ? Number.parseInt(collegeId.value) : null
    const name = collegeName.value.trim()
    const location = collegeLocation.value.trim()
    const description = collegeDescription.value.trim()
    const ranking = collegeRanking.value ? Number.parseInt(collegeRanking.value) : null
    const website = collegeWebsite.value.trim()

    // Handle logo upload
    const logo = null

    if (id) {
      // Update existing college
      const collegeIndex = colleges.findIndex((c) => c.id === id)

      if (collegeIndex !== -1) {
        // Keep existing logo if no new one is provided
        const existingLogo = colleges[collegeIndex].logo

        // Process logo if a file is selected
        if (collegeLogo.files.length > 0) {
          const reader = new FileReader()
          reader.onload = (e) => {
            colleges[collegeIndex].logo = e.target.result
            localStorage.setItem("colleges", JSON.stringify(colleges))
            filterColleges()
          }
          reader.readAsDataURL(collegeLogo.files[0])
        }

        colleges[collegeIndex] = {
          ...colleges[collegeIndex],
          name,
          location,
          description,
          ranking,
          website,
          logo: collegeLogo.files.length > 0 ? null : existingLogo, // Will be updated in the FileReader callback
        }

        // Save to localStorage
        localStorage.setItem("colleges", JSON.stringify(colleges))

        // Show success message
        showToast("College updated successfully")

        // Close modal
        closeCollegeModal()

        // Refresh grid
        filterColleges()
      }
    } else {
      // Create new college
      const newId = colleges.length > 0 ? Math.max(...colleges.map((c) => c.id)) + 1 : 1

      // Process logo if a file is selected
      if (collegeLogo.files.length > 0) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newCollege = {
            id: newId,
            name,
            location,
            description,
            ranking,
            website,
            logo: e.target.result,
          }

          // Add to colleges array
          colleges.push(newCollege)

          // Save to localStorage
          localStorage.setItem("colleges", JSON.stringify(colleges))

          // Refresh grid
          filterColleges()
        }
        reader.readAsDataURL(collegeLogo.files[0])
      } else {
        const newCollege = {
          id: newId,
          name,
          location,
          description,
          ranking,
          website,
          logo: null,
        }

        // Add to colleges array
        colleges.push(newCollege)

        // Save to localStorage
        localStorage.setItem("colleges", JSON.stringify(colleges))
      }

      // Show success message
      showToast("College created successfully")

      // Close modal
      closeCollegeModal()

      // Refresh grid
      filterColleges()
    }
  }

  function deleteCollege(id) {
    // Confirm deletion
    showConfirmDialog("Are you sure you want to delete this college?", () => {
      // Find college index
      const collegeIndex = colleges.findIndex((c) => c.id === id)

      if (collegeIndex !== -1) {
        // Check if college is referenced by users or questions
        const collegeName = colleges[collegeIndex].name
        const usersWithCollege = users.filter((u) => u.college === collegeName).length
        const questionsWithCollege = questions.filter((q) => q.collegeId === id).length

        if (usersWithCollege > 0 || questionsWithCollege > 0) {
          showConfirmDialog(
            `This college is referenced by ${usersWithCollege} users and ${questionsWithCollege} questions. Deleting it may cause issues. Are you sure you want to proceed?`,
            () => {
              // Remove college
              colleges.splice(collegeIndex, 1)

              // Save to localStorage
              localStorage.setItem("colleges", JSON.stringify(colleges))

              // Show success message
              showToast("College deleted successfully")

              // Refresh grid
              filterColleges()
            },
          )
        } else {
          // Remove college
          colleges.splice(collegeIndex, 1)

          // Save to localStorage
          localStorage.setItem("colleges", JSON.stringify(colleges))

          // Show success message
          showToast("College deleted successfully")

          // Refresh grid
          filterColleges()
        }
      }
    })
  }

  function exportColleges() {
    // Create CSV content
    let csvContent = "ID,Name,Location,Ranking,Website,Description\n"

    filteredColleges.forEach((college) => {
      const description = college.description ? college.description.replace(/"/g, '""') : ""
      const website = college.website || ""
      const ranking = college.ranking || ""

      csvContent += `${college.id},"${college.name}","${college.location}","${ranking}","${website}","${description}"\n`
    })

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "colleges.csv"
    a.click()

    // Clean up
    URL.revokeObjectURL(url)

    // Show success message
    showToast("Colleges exported successfully")
  }

  // Mock showToast function
  function showToast(message) {
    console.log("Toast:", message)
  }

  // Mock showConfirmDialog function
  function showConfirmDialog(message, callback) {
    console.log("Confirm:", message)
    const confirmed = confirm(message)
    if (confirmed && callback) {
      callback()
    }
  }
})

// Add styles for college management page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .colleges-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .college-card {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            overflow: hidden;
            transition: var(--admin-transition);
        }
        
        .college-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.15);
        }
        
        .college-card-header {
            padding: 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--admin-border-color);
        }
        
        .college-logo {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 0.5rem;
            background-color: var(--admin-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            overflow: hidden;
        }
        
        .college-logo img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .ranking-badge {
            background-color: var(--admin-warning);
            color: white;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
        }
        
        .college-card-body {
            padding: 1.25rem;
        }
        
        .college-name {
            margin: 0 0 0.5rem;
            font-size: 1.25rem;
        }
        
        .college-location {
            color: var(--admin-secondary);
            margin: 0 0 0.75rem;
            font-size: 0.9rem;
        }
        
        .college-location i {
            margin-right: 0.25rem;
        }
        
        .college-description {
            margin: 0;
            font-size: 0.9rem;
            color: var(--admin-text-color);
            line-height: 1.5;
        }
        
        .college-card-footer {
            padding: 1rem 1.25rem;
            border-top: 1px solid var(--admin-border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .college-stats {
            display: flex;
            gap: 1rem;
        }
        
        .college-stats .stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--admin-secondary);
            font-size: 0.85rem;
        }
        
        .college-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        /* College Profile Styles */
        .college-profile-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .college-profile .college-logo {
            width: 5rem;
            height: 5rem;
        }
        
        .college-info h3 {
            margin: 0 0 0.5rem;
            font-size: 1.5rem;
        }
        
        .college-info p {
            margin: 0 0 0.25rem;
            color: var(--admin-secondary);
        }
        
        .college-info a {
            color: var(--admin-primary);
            text-decoration: none;
        }
        
        .college-profile-details {
            margin-bottom: 1.5rem;
        }
        
        .college-stats {
            display: flex;
            gap: 2rem;
        }
        
        .college-stats .stat {
            text-align: center;
        }
        
        .college-stats .stat span {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--admin-primary);
            margin-bottom: 0.25rem;
        }
        
        .college-stats .stat label {
            font-size: 0.85rem;
            color: var(--admin-secondary);
        }
        
        .college-profile-actions {
            display: flex;
            gap: 1rem;
        }
        
        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
        }
        
        .empty-state i {
            font-size: 3rem;
            color: var(--admin-secondary);
            margin-bottom: 1rem;
        }
        
        .empty-state h3 {
            margin: 0 0 0.5rem;
            font-size: 1.25rem;
        }
        
        .empty-state p {
            margin: 0;
            color: var(--admin-secondary);
        }
        
        @media (max-width: 768px) {
            .college-profile-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .college-stats {
                flex-direction: column;
                gap: 1rem;
            }
            
            .college-profile-actions {
                flex-direction: column;
            }
        }
    `
  document.head.appendChild(style)
})
