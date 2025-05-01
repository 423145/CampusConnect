// Reports & Flags Management JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Reports management script loaded")

  // Get DOM elements - Tabs
  const tabs = document.querySelectorAll(".admin-tab")
  const tabContents = document.querySelectorAll(".admin-tab-content")

  // Get DOM elements - Pending Reports Tab
  const typeFilter = document.getElementById("type-filter")
  const reasonFilter = document.getElementById("reason-filter")
  const resolveSelectedBtn = document.getElementById("resolve-selected-btn")
  const exportReportsBtn = document.getElementById("export-reports-btn")
  const selectAllPending = document.getElementById("select-all-pending")

  // Get DOM elements - Report Modal
  const reportModal = document.getElementById("report-modal")
  const reportTypeBadge = document.getElementById("report-type-badge")
  const reportStatusBadge = document.getElementById("report-status-badge")
  const reportContentTitle = document.getElementById("report-content-title")
  const reportContentBody = document.getElementById("report-content-body")
  const reportReporter = document.getElementById("report-reporter")
  const reportReason = document.getElementById("report-reason")
  const reportDate = document.getElementById("report-date")
  const reportComments = document.getElementById("report-comments")
  const resolutionInfo = document.getElementById("resolution-info")
  const reportResolver = document.getElementById("report-resolver")
  const reportAction = document.getElementById("report-action")
  const reportResolutionDate = document.getElementById("report-resolution-date")
  const reportNotes = document.getElementById("report-notes")
  const pendingActions = document.getElementById("pending-actions")
  const approveContentBtn = document.getElementById("approve-content-btn")
  const editContentBtn = document.getElementById("edit-content-btn")
  const removeContentBtn = document.getElementById("remove-content-btn")

  // Get DOM elements - Modal Close Buttons
  const modalCloseButtons = document.querySelectorAll(".admin-modal-close")

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

  // Event listeners - Pending Reports Tab
  typeFilter.addEventListener("change", () => {
    filterPendingReports()
  })

  reasonFilter.addEventListener("change", () => {
    filterPendingReports()
  })

  selectAllPending.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".report-checkbox")
    checkboxes.forEach((checkbox) => {
      checkbox.checked = this.checked
    })
  })

  resolveSelectedBtn.addEventListener("click", () => {
    resolveSelectedReports()
  })

  exportReportsBtn.addEventListener("click", () => {
    exportReports()
  })

  // Event listeners - Report Actions
  document.querySelectorAll(".view-report-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const reportId = this.dataset.id
      openReportModal(reportId)
    })
  })

  document.querySelectorAll(".resolve-report-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const reportId = this.dataset.id
      resolveReport(reportId)
    })
  })

  document.querySelectorAll(".delete-content-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const reportId = this.dataset.id
      deleteReportedContent(reportId)
    })
  })

  document.querySelectorAll(".ban-user-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const reportId = this.dataset.id
      banReportedUser(reportId)
    })
  })

  // Event listeners - Modal Actions
  approveContentBtn.addEventListener("click", () => {
    approveContent()
  })

  editContentBtn.addEventListener("click", () => {
    editContent()
  })

  removeContentBtn.addEventListener("click", () => {
    removeContent()
  })

  // Event listeners - Modal close buttons
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeReportModal()
    })
  })

  // Functions
  function filterPendingReports() {
    const typeValue = typeFilter.value
    const reasonValue = reasonFilter.value

    // Get all report rows
    const reportRows = document.querySelectorAll("#pending-reports-body tr")

    reportRows.forEach((row) => {
      const typeCell = row.querySelector("td:nth-child(3)")
      const reasonCell = row.querySelector("td:nth-child(5)")

      const typeText = typeCell.textContent.toLowerCase()
      const reasonText = reasonCell.textContent.toLowerCase()

      const matchesType = typeValue === "all" || typeText.includes(typeValue)
      const matchesReason = reasonValue === "all" || reasonText.includes(reasonValue)

      if (matchesType && matchesReason) {
        row.style.display = ""
      } else {
        row.style.display = "none"
      }
    })
  }

  function resolveSelectedReports() {
    const selectedCheckboxes = document.querySelectorAll(".report-checkbox:checked")

    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one report to resolve")
      return
    }

    if (confirm(`Are you sure you want to resolve ${selectedCheckboxes.length} selected reports?`)) {
      selectedCheckboxes.forEach((checkbox) => {
        const reportId = checkbox.dataset.id
        const row = checkbox.closest("tr")
        row.remove()
      })

      alert(`${selectedCheckboxes.length} reports have been resolved`)
    }
  }

  function exportReports() {
    alert("Reports exported successfully")
  }

  function openReportModal(reportId) {
    // In a real application, we would fetch the report details from the server
    // For this demo, we'll just show the modal with some mock data

    // Determine if this is a resolved report
    const isResolved = reportId > 5 // Mock logic: reports with ID > 5 are resolved

    if (isResolved) {
      // Show resolution info and hide pending actions
      resolutionInfo.style.display = "block"
      pendingActions.style.display = "none"
      reportStatusBadge.textContent = "Resolved"
      reportStatusBadge.className = "status-badge status-success"
    } else {
      // Hide resolution info and show pending actions
      resolutionInfo.style.display = "none"
      pendingActions.style.display = "flex"
      reportStatusBadge.textContent = "Pending"
      reportStatusBadge.className = "status-badge status-warning"
    }

    // Open modal
    reportModal.style.display = "block"
  }

  function closeReportModal() {
    reportModal.style.display = "none"
  }

  function resolveReport(reportId) {
    if (confirm("Are you sure you want to resolve this report and approve the content?")) {
      const row = document.querySelector(`.report-checkbox[data-id="${reportId}"]`).closest("tr")
      row.remove()
      alert("Report resolved successfully")
    }
  }

  function deleteReportedContent(reportId) {
    if (confirm("Are you sure you want to delete the reported content? This action cannot be undone.")) {
      const row = document.querySelector(`.report-checkbox[data-id="${reportId}"]`).closest("tr")
      row.remove()
      alert("Content deleted and report resolved successfully")
    }
  }

  function banReportedUser(reportId) {
    if (
      confirm(
        "Are you sure you want to ban this user? This action is significant and should be used only for serious violations.",
      )
    ) {
      const row = document.querySelector(`.report-checkbox[data-id="${reportId}"]`).closest("tr")
      row.remove()
      alert("User banned and report resolved successfully")
    }
  }

  function approveContent() {
    if (confirm("Are you sure you want to approve this content and resolve the report?")) {
      closeReportModal()
      alert("Content approved and report resolved successfully")
    }
  }

  function editContent() {
    if (confirm("Do you want to edit the reported content?")) {
      // In a real application, this would open a content editor
      alert("Content editing feature would open here")
    }
  }

  function removeContent() {
    if (confirm("Are you sure you want to remove this content? This action cannot be undone.")) {
      closeReportModal()
      alert("Content removed and report resolved successfully")
    }
  }
})

// Add styles for reports management page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .badge-question {
            background-color: rgba(78, 115, 223, 0.1);
            color: rgb(78, 115, 223);
        }
        
        .badge-answer {
            background-color: rgba(28, 200, 138, 0.1);
            color: rgb(28, 200, 138);
        }
        
        .badge-user {
            background-color: rgba(246, 194, 62, 0.1);
            color: rgb(246, 194, 62);
        }
        
        .badge-deleted {
            background-color: rgba(231, 74, 59, 0.1);
            color: rgb(231, 74, 59);
        }
        
        .badge-banned {
            background-color: rgba(231, 74, 59, 0.1);
            color: rgb(231, 74, 59);
        }
        
        .badge-edited {
            background-color: rgba(54, 185, 204, 0.1);
            color: rgb(54, 185, 204);
        }
        
        .btn-success {
            background-color: rgb(28, 200, 138);
            color: white;
        }
        
        .btn-warning {
            background-color: rgb(246, 194, 62);
            color: white;
        }
        
        .btn-danger {
            background-color: rgb(231, 74, 59);
            color: white;
        }
        
        .report-details {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .report-content {
            background-color: var(--admin-light-bg);
            padding: 1rem;
            border-radius: 0.35rem;
        }
        
        .report-content h3 {
            margin-top: 0;
            font-size: 1rem;
            color: var(--admin-secondary);
            margin-bottom: 0.75rem;
        }
        
        .content-preview {
            background-color: white;
            padding: 1rem;
            border-radius: 0.25rem;
            border: 1px solid var(--admin-border-color);
        }
        
        .content-preview h4 {
            margin-top: 0;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        
        .content-preview p {
            margin: 0;
            color: var(--admin-text-color);
        }
        
        .report-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        
        .info-group h4 {
            margin-top: 0;
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        
        .info-row {
            display: flex;
            margin-bottom: 0.75rem;
        }
        
        .info-label {
            font-weight: 600;
            width: 120px;
            color: var(--admin-secondary);
        }
        
        .info-value {
            flex: 1;
        }
        
        .report-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
            .report-info {
                grid-template-columns: 1fr;
            }
            
            .report-actions {
                flex-direction: column;
            }
        }
    `
  document.head.appendChild(style)
})
