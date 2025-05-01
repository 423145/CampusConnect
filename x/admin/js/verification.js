// User Verification JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("User verification script loaded")

  // Get DOM elements - Tabs
  const tabs = document.querySelectorAll(".admin-tab")
  const tabContents = document.querySelectorAll(".admin-tab-content")

  // Get DOM elements - Filters
  const roleFilter = document.getElementById("role-filter")
  const collegeFilter = document.getElementById("college-filter")
  const approvedRoleFilter = document.getElementById("approved-role-filter")
  const approvedCollegeFilter = document.getElementById("approved-college-filter")
  const rejectedRoleFilter = document.getElementById("rejected-role-filter")
  const rejectedCollegeFilter = document.getElementById("rejected-college-filter")

  // Get DOM elements - Request Info Modal
  const requestInfoModal = document.getElementById("request-info-modal")
  const requestInfoForm = document.getElementById("request-info-form")
  const requestVerificationId = document.getElementById("request-verification-id")
  const requestMessage = document.getElementById("request-message")
  const cancelRequestBtn = document.getElementById("cancel-request-btn")

  // Get DOM elements - Reject Modal
  const rejectModal = document.getElementById("reject-modal")
  const rejectForm = document.getElementById("reject-form")
  const rejectVerificationId = document.getElementById("reject-verification-id")
  const rejectionReason = document.getElementById("rejection-reason")
  const rejectionMessage = document.getElementById("rejection-message")
  const cancelRejectBtn = document.getElementById("cancel-reject-btn")

  // Get DOM elements - Modal Close Buttons
  const modalCloseButtons = document.querySelectorAll(".admin-modal-close")

  // Get data from localStorage
  const colleges = JSON.parse(localStorage.getItem("colleges") || "[]")

  // Populate college filters
  populateCollegeFilters()

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

  // Event listeners - Filters
  roleFilter.addEventListener("change", () => {
    filterVerificationRequests("pending")
  })

  collegeFilter.addEventListener("change", () => {
    filterVerificationRequests("pending")
  })

  approvedRoleFilter.addEventListener("change", () => {
    filterVerificationRequests("approved")
  })

  approvedCollegeFilter.addEventListener("change", () => {
    filterVerificationRequests("approved")
  })

  rejectedRoleFilter.addEventListener("change", () => {
    filterVerificationRequests("rejected")
  })

  rejectedCollegeFilter.addEventListener("change", () => {
    filterVerificationRequests("rejected")
  })

  // Event listeners - Verification Actions
  document.querySelectorAll(".approve-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const verificationId = this.dataset.id
      approveVerification(verificationId)
    })
  })

  document.querySelectorAll(".reject-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const verificationId = this.dataset.id
      openRejectModal(verificationId)
    })
  })

  document.querySelectorAll(".request-more-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const verificationId = this.dataset.id
      openRequestInfoModal(verificationId)
    })
  })

  document.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const verificationId = this.dataset.id
      viewVerificationDetails(verificationId)
    })
  })

  document.querySelectorAll(".revoke-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const verificationId = this.dataset.id
      revokeVerification(verificationId)
    })
  })

  document.querySelectorAll(".reconsider-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const verificationId = this.dataset.id
      reconsiderVerification(verificationId)
    })
  })

  // Event listeners - Forms
  requestInfoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    sendInfoRequest()
  })

  rejectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    rejectVerification()
  })

  // Event listeners - Cancel buttons
  cancelRequestBtn.addEventListener("click", () => {
    closeRequestInfoModal()
  })

  cancelRejectBtn.addEventListener("click", () => {
    closeRejectModal()
  })

  // Event listeners - Modal close buttons
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeAllModals()
    })
  })

  // Functions
  function populateCollegeFilters() {
    // Sort colleges by name
    const sortedColleges = [...colleges].sort((a, b) => a.name.localeCompare(b.name))

    // Populate college filters
    sortedColleges.forEach((college) => {
      // Pending tab college filter
      const option = document.createElement("option")
      option.value = college.id
      option.textContent = college.name
      collegeFilter.appendChild(option)

      // Approved tab college filter
      const approvedOption = document.createElement("option")
      approvedOption.value = college.id
      approvedOption.textContent = college.name
      approvedCollegeFilter.appendChild(approvedOption)

      // Rejected tab college filter
      const rejectedOption = document.createElement("option")
      rejectedOption.value = college.id
      rejectedOption.textContent = college.name
      rejectedCollegeFilter.appendChild(rejectedOption)
    })
  }

  function filterVerificationRequests(tabName) {
    let filter, collegeFilterEl, roleFilterEl

    // Set filter elements based on tab
    if (tabName === "pending") {
      collegeFilterEl = collegeFilter
      roleFilterEl = roleFilter
      filter = document.querySelectorAll("#pending-requests .verification-card")
    } else if (tabName === "approved") {
      collegeFilterEl = approvedCollegeFilter
      roleFilterEl = approvedRoleFilter
      filter = document.querySelectorAll("#approved-requests .verification-card")
    } else if (tabName === "rejected") {
      collegeFilterEl = rejectedCollegeFilter
      roleFilterEl = rejectedRoleFilter
      filter = document.querySelectorAll("#rejected-requests .verification-card")
    }

    const collegeValue = collegeFilterEl.value
    const roleValue = roleFilterEl.value

    filter.forEach((card) => {
      const roleElement = card.querySelector(".user-info p")
      const collegeElement = card.querySelector(".detail-value:nth-of-type(2)")

      const role = roleElement.textContent.toLowerCase()
      const college = collegeElement.textContent

      // Find college ID
      let collegeId = "all"
      if (collegeValue !== "all") {
        const collegeObj = colleges.find((c) => c.name === college)
        if (collegeObj) {
          collegeId = collegeObj.id.toString()
        }
      }

      const matchesRole = roleValue === "all" || role === roleValue.toLowerCase()
      const matchesCollege = collegeValue === "all" || collegeValue === collegeId

      if (matchesRole && matchesCollege) {
        card.style.display = ""
      } else {
        card.style.display = "none"
      }
    })
  }

  function approveVerification(verificationId) {
    if (confirm("Are you sure you want to approve this verification request?")) {
      // In a real application, we would send an API request to approve the verification
      // For this demo, we'll just remove the card from the pending tab
      const card = document.querySelector(`.approve-btn[data-id="${verificationId}"]`).closest(".verification-card")
      card.remove()

      // Show success message
      alert("Verification request approved successfully")
    }
  }

  function openRejectModal(verificationId) {
    // Set verification ID
    rejectVerificationId.value = verificationId

    // Set default rejection message
    rejectionMessage.value =
      "We are unable to verify your credentials based on the documents provided. Please ensure all documents are clear, valid, and match the information in your profile."

    // Open modal
    rejectModal.style.display = "block"
  }

  function openRequestInfoModal(verificationId) {
    // Set verification ID
    requestVerificationId.value = verificationId

    // Set default request message
    requestMessage.value =
      "We need additional information to verify your credentials. Please provide the following documents to complete the verification process."

    // Reset checkboxes
    document.querySelectorAll('input[name="required-docs"]').forEach((checkbox) => {
      checkbox.checked = false
    })

    // Open modal
    requestInfoModal.style.display = "block"
  }

  function viewVerificationDetails(verificationId) {
    // In a real application, we would fetch the verification details from the server
    // For this demo, we'll just show an alert
    alert(`Viewing details for verification request #${verificationId}`)
  }

  function revokeVerification(verificationId) {
    if (
      confirm(
        "Are you sure you want to revoke this verification? The user will need to submit a new verification request.",
      )
    ) {
      // In a real application, we would send an API request to revoke the verification
      // For this demo, we'll just remove the card from the approved tab
      const card = document.querySelector(`.revoke-btn[data-id="${verificationId}"]`).closest(".verification-card")
      card.remove()

      // Show success message
      alert("Verification has been revoked successfully")
    }
  }

  function reconsiderVerification(verificationId) {
    if (confirm("Are you sure you want to reconsider this verification request?")) {
      // In a real application, we would send an API request to reconsider the verification
      // For this demo, we'll just remove the card from the rejected tab
      const card = document.querySelector(`.reconsider-btn[data-id="${verificationId}"]`).closest(".verification-card")
      card.remove()

      // Show success message
      alert("Verification request has been moved back to pending for reconsideration")
    }
  }

  function sendInfoRequest() {
    const verificationId = requestVerificationId.value
    const message = requestMessage.value

    // Get selected required documents
    const requiredDocs = []
    document.querySelectorAll('input[name="required-docs"]:checked').forEach((checkbox) => {
      requiredDocs.push(checkbox.value)
    })

    if (requiredDocs.length === 0) {
      alert("Please select at least one required document")
      return
    }

    // In a real application, we would send an API request with the message and required documents
    // For this demo, we'll just show a success message
    alert("Request for additional information sent successfully")

    // Close modal
    closeRequestInfoModal()
  }

  function rejectVerification() {
    const verificationId = rejectVerificationId.value
    const reason = rejectionReason.value
    const message = rejectionMessage.value

    if (!reason) {
      alert("Please select a reason for rejection")
      return
    }

    // In a real application, we would send an API request with the reason and message
    // For this demo, we'll just remove the card from the pending tab
    const card = document.querySelector(`.reject-btn[data-id="${verificationId}"]`).closest(".verification-card")
    card.remove()

    // Show success message
    alert("Verification request rejected successfully")

    // Close modal
    closeRejectModal()
  }

  function closeRequestInfoModal() {
    requestInfoModal.style.display = "none"
  }

  function closeRejectModal() {
    rejectModal.style.display = "none"
  }

  function closeAllModals() {
    closeRequestInfoModal()
    closeRejectModal()
  }
})

// Add styles for verification management page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .verification-requests {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }
        
        .verification-card {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            overflow: hidden;
        }
        
        .verification-header {
            padding: 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--admin-border-color);
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .user-avatar {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            background-color: var(--admin-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }
        
        .user-info h3 {
            margin: 0 0 0.25rem;
            font-size: 1.1rem;
        }
        
        .user-info p {
            margin: 0;
            color: var(--admin-secondary);
            font-size: 0.9rem;
        }
        
        .verification-details {
            padding: 1.25rem;
            border-bottom: 1px solid var(--admin-border-color);
        }
        
        .detail-row {
            display: flex;
            margin-bottom: 0.75rem;
        }
        
        .detail-row:last-child {
            margin-bottom: 0;
        }
        
        .detail-label {
            width: 140px;
            font-weight: 600;
            color: var(--admin-secondary);
        }
        
        .detail-value {
            flex: 1;
        }
        
        .verification-documents {
            padding: 1.25rem;
            border-bottom: 1px solid var(--admin-border-color);
        }
        
        .verification-documents h4 {
            margin: 0 0 1rem;
            font-size: 0.9rem;
            color: var(--admin-secondary);
            text-transform: uppercase;
        }
        
        .document-list {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .document-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--admin-primary);
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .document-link:hover {
            text-decoration: underline;
        }
        
        .verification-actions {
            padding: 1.25rem;
            display: flex;
            gap: 0.75rem;
        }
        
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .verification-requests {
                grid-template-columns: 1fr;
            }
            
            .verification-actions {
                flex-direction: column;
            }
        }
    `
  document.head.appendChild(style)
})
