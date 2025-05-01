// Admin Profile JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin profile script loaded")

  // Get DOM elements - Tabs
  const profileTabs = document.querySelectorAll(".profile-tab")
  const profileTabContents = document.querySelectorAll(".profile-tab-content")

  // Get DOM elements - Edit Buttons
  const editSectionButtons = document.querySelectorAll(".edit-section-btn")
  const cancelEditButtons = document.querySelectorAll(".cancel-edit-btn")

  // Get DOM elements - Forms
  const personalInfoForm = document.getElementById("personal-info-form")
  const notificationPrefsForm = document.getElementById("notification-prefs-form")
  const changePasswordForm = document.getElementById("change-password-form")

  // Get DOM elements - Security Tab
  const disable2faBtn = document.getElementById("disable-2fa-btn")
  const viewRecoveryCodesBtn = document.getElementById("view-recovery-codes-btn")
  const generateRecoveryCodesBtn = document.getElementById("generate-recovery-codes-btn")
  const logoutAllBtn = document.getElementById("logout-all-btn")

  // Get DOM elements - Activity Tab
  const activityFilter = document.getElementById("activity-filter")
  const loadMoreActivityBtn = document.getElementById("load-more-activity")

  // Get DOM elements - Recovery Codes Modal
  const recoveryCodesModal = document.getElementById("recovery-codes-modal")
  const downloadCodesBtn = document.getElementById("download-codes-btn")
  const copyCodesBtn = document.getElementById("copy-codes-btn")
  const printCodesBtn = document.getElementById("print-codes-btn")
  const modalCloseButtons = document.querySelectorAll(".admin-modal-close")

  // Get DOM elements - Avatar
  const changeAvatarBtn = document.querySelector(".change-avatar-btn")

  // Tab switching
  profileTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // Remove active class from all tabs and tab contents
      profileTabs.forEach((t) => t.classList.remove("active"))
      profileTabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      this.classList.add("active")
      const tabName = this.dataset.tab
      document.getElementById(`${tabName}-tab`).classList.add("active")
    })
  })

  // Edit section
  editSectionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const section = this.dataset.section
      enableFormEditing(section)
    })
  })

  // Cancel edit
  cancelEditButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const section = this.dataset.section
      disableFormEditing(section)
    })
  })

  // Form submissions
  personalInfoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    savePersonalInfo()
  })

  notificationPrefsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveNotificationPrefs()
  })

  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault()
    changePassword()
  })

  // Security tab actions
  disable2faBtn.addEventListener("click", () => {
    disable2fa()
  })

  viewRecoveryCodesBtn.addEventListener("click", () => {
    openRecoveryCodesModal()
  })

  generateRecoveryCodesBtn.addEventListener("click", () => {
    generateRecoveryCodes()
  })

  logoutAllBtn.addEventListener("click", () => {
    logoutAllSessions()
  })

  // Activity tab actions
  activityFilter.addEventListener("change", () => {
    filterActivity()
  })

  loadMoreActivityBtn.addEventListener("click", () => {
    loadMoreActivity()
  })

  // Recovery codes modal actions
  downloadCodesBtn.addEventListener("click", () => {
    downloadRecoveryCodes()
  })

  copyCodesBtn.addEventListener("click", () => {
    copyRecoveryCodes()
  })

  printCodesBtn.addEventListener("click", () => {
    printRecoveryCodes()
  })

  // Modal close buttons
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeAllModals()
    })
  })

  // Avatar change
  changeAvatarBtn.addEventListener("click", () => {
    changeAvatar()
  })

  // Functions
  function enableFormEditing(section) {
    let form, formActions, formInputs, editButton

    if (section === "personal") {
      form = personalInfoForm
      editButton = document.querySelector(`.edit-section-btn[data-section="personal"]`)
    } else if (section === "notifications") {
      form = notificationPrefsForm
      editButton = document.querySelector(`.edit-section-btn[data-section="notifications"]`)
    }

    formActions = form.querySelector(".form-actions")
    formInputs = form.querySelectorAll("input, textarea, select")

    // Enable form inputs
    formInputs.forEach((input) => {
      input.disabled = false
    })

    // Show form actions
    formActions.style.display = "flex"

    // Hide edit button
    editButton.style.display = "none"
  }

  function disableFormEditing(section) {
    let form, formActions, formInputs, editButton

    if (section === "personal") {
      form = personalInfoForm
      editButton = document.querySelector(`.edit-section-btn[data-section="personal"]`)
    } else if (section === "notifications") {
      form = notificationPrefsForm
      editButton = document.querySelector(`.edit-section-btn[data-section="notifications"]`)
    }

    formActions = form.querySelector(".form-actions")
    formInputs = form.querySelectorAll("input, textarea, select")

    // Disable form inputs
    formInputs.forEach((input) => {
      input.disabled = true
    })

    // Hide form actions
    formActions.style.display = "none"

    // Show edit button
    editButton.style.display = "block"

    // Reset form to original values
    form.reset()
  }

  function savePersonalInfo() {
    // In a real application, we would send an API request to save the personal info
    // For this demo, we'll just show a success message and disable editing
    showToast("Personal information updated successfully")
    disableFormEditing("personal")
  }

  function saveNotificationPrefs() {
    showToast("Notification preferences updated successfully")
    disableFormEditing("notifications")
  }

  function changePassword() {
    const currentPassword = document.getElementById("current-password").value
    const newPassword = document.getElementById("new-password").value
    const confirmPassword = document.getElementById("confirm-password").value

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match")
      return
    }

    // In a real application, we would send an API request to change the password
    // For this demo, we'll just show a success message and reset the form
    showToast("Password changed successfully")
    changePasswordForm.reset()
  }

  function disable2fa() {
    if (
      confirm("Are you sure you want to disable two-factor authentication? This will make your account less secure.")
    ) {
      // In a real application, we would send an API request to disable 2FA
      // For this demo, we'll just show a success message
      showToast("Two-factor authentication disabled")

      // Update UI to show 2FA is disabled
      const twoFactorStatus = document.querySelector(".two-factor-status")
      twoFactorStatus.innerHTML = `
                <div class="status-icon disabled">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="status-info">
                    <h3>Two-Factor Authentication is Disabled</h3>
                    <p>Your account is not protected with two-factor authentication.</p>
                </div>
                <div class="status-action">
                    <button class="btn btn-primary" id="enable-2fa-btn">Enable</button>
                </div>
            `

      // Hide recovery codes section
      document.querySelector(".recovery-codes").style.display = "none"

      // Add event listener to new enable button
      document.getElementById("enable-2fa-btn").addEventListener("click", () => {
        enable2fa()
      })
    }
  }

  function enable2fa() {
    // In a real application, this would open a 2FA setup flow
    // For this demo, we'll just show a success message
    showToast("Two-factor authentication enabled")

    // Update UI to show 2FA is enabled
    const twoFactorStatus = document.querySelector(".two-factor-status")
    twoFactorStatus.innerHTML = `
            <div class="status-icon enabled">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div class="status-info">
                <h3>Two-Factor Authentication is Enabled</h3>
                <p>Your account is currently protected with two-factor authentication.</p>
            </div>
            <div class="status-action">
                <button class="btn btn-danger" id="disable-2fa-btn">Disable</button>
            </div>
        `

    // Show recovery codes section
    document.querySelector(".recovery-codes").style.display = "block"

    // Add event listener to new disable button
    document.getElementById("disable-2fa-btn").addEventListener("click", () => {
      disable2fa()
    })
  }

  function openRecoveryCodesModal() {
    recoveryCodesModal.style.display = "block"
  }

  function generateRecoveryCodes() {
    if (confirm("Are you sure you want to generate new recovery codes? This will invalidate your existing codes.")) {
      // In a real application, we would send an API request to generate new codes
      // For this demo, we'll just show a success message and open the modal
      showToast("New recovery codes generated")
      openRecoveryCodesModal()
    }
  }

  function logoutAllSessions() {
    if (confirm("Are you sure you want to log out of all other sessions?")) {
      // In a real application, we would send an API request to log out all sessions
      // For this demo, we'll just show a success message
      showToast("Logged out of all other sessions")

      // Remove all session items except the current one
      const sessionItems = document.querySelectorAll(".session-item:not(.current)")
      sessionItems.forEach((item) => {
        item.remove()
      })
    }
  }

  function filterActivity() {
    const filterValue = activityFilter.value
    const timelineItems = document.querySelectorAll(".timeline-item")

    timelineItems.forEach((item) => {
      if (filterValue === "all") {
        item.style.display = "flex"
      } else {
        const iconClass = item.querySelector(".timeline-icon").classList
        if (iconClass.contains(`${filterValue}-icon`)) {
          item.style.display = "flex"
        } else {
          item.style.display = "none"
        }
      }
    })
  }

  function loadMoreActivity() {
    // In a real application, we would load more activity items from the server
    // For this demo, we'll just add some mock items
    const activityTimeline = document.querySelector(".activity-timeline")

    const newItems = [
      {
        type: "settings",
        icon: "fas fa-cog",
        title: "Updated email settings",
        description: "Changed SMTP configuration",
        time: "April 8, 2023",
      },
      {
        type: "content",
        icon: "fas fa-edit",
        title: "Edited question",
        description: 'Edited question "What are the admission requirements for Harvard?"',
        time: "April 7, 2023",
      },
      {
        type: "login",
        icon: "fas fa-sign-in-alt",
        title: "Logged in to admin dashboard",
        description: "Chrome on Windows • New York, USA",
        time: "April 6, 2023",
      },
    ]

    newItems.forEach((item) => {
      const timelineItem = document.createElement("div")
      timelineItem.className = "timeline-item"
      timelineItem.innerHTML = `
                <div class="timeline-icon ${item.type}-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <span class="timeline-time">${item.time}</span>
                </div>
            `
      activityTimeline.appendChild(timelineItem)
    })

    // Apply current filter to new items
    filterActivity()

    // Hide load more button after loading all items
    loadMoreActivityBtn.style.display = "none"
  }

  function downloadRecoveryCodes() {
    // In a real application, we would generate a file with the recovery codes
    // For this demo, we'll just show a success message
    showToast("Recovery codes downloaded")
  }

  function copyRecoveryCodes() {
    // Get all recovery codes
    const codes = Array.from(document.querySelectorAll(".recovery-codes-list code")).map((code) => code.textContent)
    const codesText = codes.join("\n")

    // Copy to clipboard
    navigator.clipboard
      .writeText(codesText)
      .then(() => {
        showToast("Recovery codes copied to clipboard")
      })
      .catch((err) => {
        console.error("Could not copy text: ", err)
        alert("Failed to copy recovery codes")
      })
  }

  function printRecoveryCodes() {
    // In a real application, we would open a print dialog with the recovery codes
    // For this demo, we'll just show a success message
    showToast("Print dialog opened")
  }

  function closeAllModals() {
    recoveryCodesModal.style.display = "none"
  }

  function changeAvatar() {
    // In a real application, this would open a file picker
    // For this demo, we'll just show a success message
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // In a real application, we would upload the file to the server
        // For this demo, we'll just show a success message
        showToast("Profile picture updated")
      }
    }
    input.click()
  }

  function showToast(message) {
    alert(message) // Replace with a more sophisticated toast notification
  }
})

// Add styles for profile page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .breadcrumbs {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .breadcrumbs a {
            color: var(--admin-secondary);
            text-decoration: none;
        }
        
        .breadcrumbs a:hover {
            color: var(--admin-primary);
        }
        
        .breadcrumbs i {
            font-size: 0.7rem;
            color: var(--admin-secondary);
        }
        
        .profile-container {
            max-width: 900px;
            margin: 0 auto;
        }
        
        .profile-header {
            display: flex;
            align-items: center;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .profile-avatar-container {
            position: relative;
        }
        
        .profile-avatar {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background-color: var(--admin-primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: 600;
        }
        
        .change-avatar-btn {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: var(--admin-light);
            border: 2px solid white;
            color: var(--admin-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--admin-transition);
        }
        
        .change-avatar-btn:hover {
            background-color: var(--admin-primary);
            color: white;
        }
        
        .profile-info {
            flex: 1;
        }
        
        .profile-info h1 {
            margin: 0 0 0.5rem;
            font-size: 1.75rem;
        }
        
        .profile-role {
            color: var(--admin-primary);
            font-weight: 600;
            margin: 0 0 0.25rem;
        }
        
        .profile-email {
            color: var(--admin-secondary);
            margin: 0 0 0.25rem;
        }
        
        .profile-joined {
            color: var(--admin-secondary);
            font-size: 0.9rem;
            margin: 0;
        }
        
        .profile-tabs {
            display: flex;
            border-bottom: 1px solid var(--admin-border-color);
            margin-bottom: 1.5rem;
        }
        
        .profile-tab {
            padding: 1rem 1.5rem;
            background: none;
            border: none;
            border-bottom: 2px solid transparent;
            font-weight: 600;
            color: var(--admin-secondary);
            cursor: pointer;
            transition: var(--admin-transition);
        }
        
        .profile-tab:hover {
            color: var(--admin-primary);
        }
        
        .profile-tab.active {
            color: var(--admin-primary);
            border-bottom-color: var(--admin-primary);
        }
        
        .profile-tab-content {
            display: none;
        }
        
        .profile-tab-content.active {
            display: block;
        }
        
        .profile-section {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .section-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--admin-border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .section-header h2 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--admin-dark);
        }
        
        .section-content {
            padding: 1.5rem;
        }
        
        .form-row {
            display: flex;
            gap: 1.5rem;
        }
        
        .form-group.half {
            flex: 1;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .two-factor-status {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem;
            background-color: var(--admin-light);
            border-radius: 0.35rem;
            margin-bottom: 1.5rem;
        }
        
        .status-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .status-icon.enabled {
            background-color: rgba(28, 200, 138, 0.1);
            color: rgb(28, 200, 138);
        }
        
        .status-icon.disabled {
            background-color: rgba(231, 74, 59, 0.1);
            color: rgb(231, 74, 59);
        }
        
        .status-info {
            flex: 1;
        }
        
        .status-info h3 {
            margin: 0 0 0.25rem;
            font-size: 1.1rem;
        }
        
        .status-info p {
            margin: 0;
            color: var(--admin-secondary);
        }
        
        .recovery-codes {
            margin-top: 1.5rem;
        }
        
        .recovery-codes h3 {
            margin: 0 0 0.5rem;
            font-size: 1.1rem;
        }
        
        .recovery-codes p {
            margin: 0 0 1rem;
            color: var(--admin-secondary);
        }
        
        .recovery-codes-actions {
            display: flex;
            gap: 1rem;
        }
        
        .sessions-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .session-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid var(--admin-border-color);
            border-radius: 0.35rem;
        }
        
        .session-item.current {
            background-color: rgba(78, 115, 223, 0.05);
            border-color: rgba(78, 115, 223, 0.2);
        }
        
        .session-device {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .session-device i {
            font-size: 1.5rem;
            color: var(--admin-primary);
        }
        
        .session-info h3 {
            margin: 0 0 0.25rem;
            font-size: 1rem;
        }
        
        .session-info p {
            margin: 0 0 0.25rem;
            color: var(--admin-secondary);
        }
        
        .session-time {
            font-size: 0.85rem;
            color: var(--admin-secondary);
        }
        
        .current-label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--admin-primary);
        }
        
        .sessions-actions {
            margin-top: 1.5rem;
            display: flex;
            justify-content: flex-end;
        }
        
        .activity-timeline {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .timeline-item {
            display: flex;
            gap: 1rem;
        }
        
        .timeline-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            flex-shrink: 0;
        }
        
        .login-icon {
            background-color: rgba(78, 115, 223, 0.1);
            color: rgb(78, 115, 223);
        }
        
        .user-icon {
            background-color: rgba(28, 200, 138, 0.1);
            color: rgb(28, 200, 138);
        }
        
        .content-icon {
            background-color: rgba(246, 194, 62, 0.1);
            color: rgb(246, 194, 62);
        }
        
        .settings-icon {
            background-color: rgba(54, 185, 204, 0.1);
            color: rgb(54, 185, 204);
        }
        
        .timeline-content {
            flex: 1;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--admin-border-color);
        }
        
        .timeline-item:last-child .timeline-content {
            border-bottom: none;
            padding-bottom: 0;
        }
        
        .timeline-content h3 {
            margin: 0 0 0.25rem;
            font-size: 1rem;
        }
        
        .timeline-content p {
            margin: 0 0 0.25rem;
            color: var(--admin-secondary);
        }
        
        .timeline-time {
            font-size: 0.85rem;
            color: var(--admin-secondary);
        }
        
        .activity-load-more {
            margin-top: 1.5rem;
            display: flex;
            justify-content: center;
        }
        
        .recovery-codes-modal .admin-modal-content {
            max-width: 600px;
        }
        
        .recovery-codes-warning {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background-color: rgba(246, 194, 62, 0.1);
            border-radius: 0.35rem;
            margin-bottom: 1.5rem;
        }
        
        .recovery-codes-warning i {
            font-size: 1.5rem;
            color: rgb(246, 194, 62);
        }
        
        .recovery-codes-warning p {
            margin: 0;
            color: var(--admin-dark);
        }
        
        .recovery-codes-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1.5rem;
            padding: 1.5rem;
            background-color: var(--admin-light);
            border-radius: 0.35rem;
        }
        
        .recovery-codes-list code {
            font-family: monospace;
            font-size: 1.1rem;
            color: var(--admin-dark);
        }
        
        .recovery-codes-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
        }
        
        @media (max-width: 768px) {
            .profile-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .profile-tabs {
                flex-wrap: wrap;
            }
            
            .profile-tab {
                flex: 1;
                padding: 1rem 0.5rem;
                text-align: center;
            }
            
            .form-row {
                flex-direction: column;
                gap: 1rem;
            }
            
            .two-factor-status {
                flex-direction: column;
                text-align: center;
            }
            
            .recovery-codes-actions {
                flex-direction: column;
            }
            
            .recovery-codes-list {
                grid-template-columns: 1fr;
            }
        }
    `
  document.head.appendChild(style)
})
