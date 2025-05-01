// Settings JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Settings script loaded")

  // Get DOM elements - Tabs
  const tabs = document.querySelectorAll(".admin-tab")
  const tabContents = document.querySelectorAll(".admin-tab-content")

  // Get DOM elements - Forms
  const siteSettingsForm = document.getElementById("site-settings-form")
  const contentSettingsForm = document.getElementById("content-settings-form")
  const authSettingsForm = document.getElementById("auth-settings-form")
  const apiSecurityForm = document.getElementById("api-security-form")
  const emailSettingsForm = document.getElementById("email-settings-form")
  const notificationSettingsForm = document.getElementById("notification-settings-form")
  const socialIntegrationsForm = document.getElementById("social-integrations-form")
  const analyticsIntegrationsForm = document.getElementById("analytics-integrations-form")

  // Get DOM elements - Buttons
  const regenerateApiKeyBtn = document.getElementById("regenerate-api-key")
  const testEmailBtn = document.getElementById("test-email-btn")
  const editTemplateButtons = document.querySelectorAll(".edit-template-btn")

  // Get DOM elements - Template Modal
  const templateModal = document.getElementById("template-modal")
  const templateModalTitle = document.getElementById("template-modal-title")
  const templateForm = document.getElementById("template-form")
  const templateId = document.getElementById("template-id")
  const templateSubject = document.getElementById("template-subject")
  const templateContent = document.getElementById("template-content")
  const cancelTemplateBtn = document.getElementById("cancel-template-btn")
  const saveTemplateBtn = document.getElementById("save-template-btn")

  // Get DOM elements - Integration Toggles
  const integrationToggles = document.querySelectorAll(".integration-toggle input[type='checkbox']")

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

  // Event listeners - Forms
  siteSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveSiteSettings()
  })

  contentSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveContentSettings()
  })

  authSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveAuthSettings()
  })

  apiSecurityForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveApiSecuritySettings()
  })

  emailSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveEmailSettings()
  })

  notificationSettingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveNotificationSettings()
  })

  socialIntegrationsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveSocialIntegrations()
  })

  analyticsIntegrationsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveAnalyticsIntegrations()
  })

  // Event listeners - Buttons
  regenerateApiKeyBtn.addEventListener("click", () => {
    regenerateApiKey()
  })

  testEmailBtn.addEventListener("click", () => {
    sendTestEmail()
  })

  editTemplateButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const templateName = this.dataset.template
      openTemplateModal(templateName)
    })
  })

  // Event listeners - Template Modal
  templateForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveEmailTemplate()
  })

  cancelTemplateBtn.addEventListener("click", () => {
    closeTemplateModal()
  })

  // Event listeners - Integration Toggles
  integrationToggles.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const integrationItem = this.closest(".integration-item")
      const integrationDetails = integrationItem.querySelector(".integration-details")

      if (this.checked) {
        integrationDetails.style.display = "block"
      } else {
        integrationDetails.style.display = "none"
      }
    })
  })

  // Event listeners - Modal close buttons
  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeAllModals()
    })
  })

  // Functions
  function saveSiteSettings() {
    // In a real application, we would send an API request to save the settings
    // For this demo, we'll just show a success message
    showToast("Site settings saved successfully")
  }

  function saveContentSettings() {
    showToast("Content settings saved successfully")
  }

  function saveAuthSettings() {
    showToast("Authentication settings saved successfully")
  }

  function saveApiSecuritySettings() {
    showToast("API security settings saved successfully")
  }

  function saveEmailSettings() {
    showToast("Email settings saved successfully")
  }

  function saveNotificationSettings() {
    showToast("Notification settings saved successfully")
  }

  function saveSocialIntegrations() {
    showToast("Social media integrations saved successfully")
  }

  function saveAnalyticsIntegrations() {
    showToast("Analytics integrations saved successfully")
  }

  function regenerateApiKey() {
    if (
      confirm(
        "Are you sure you want to regenerate the API key? This will invalidate the current key and may break existing integrations.",
      )
    ) {
      // Generate a new random API key
      const apiKeyInput = document.getElementById("api-key")
      const newKey = "sk_live_" + generateRandomString(30)
      apiKeyInput.value = newKey

      showToast("API key regenerated successfully")
    }
  }

  function sendTestEmail() {
    const emailFrom = document.getElementById("email-from").value
    const emailFromName = document.getElementById("email-from-name").value

    if (!emailFrom || !emailFromName) {
      alert("Please fill in the From Email and From Name fields")
      return
    }

    // In a real application, we would send an API request to send a test email
    // For this demo, we'll just show a success message
    showToast("Test email sent successfully")
  }

  function openTemplateModal(templateName) {
    // Set template ID
    templateId.value = templateName

    // Set modal title based on template name
    let title = "Edit Email Template"
    let subject = ""
    let content = ""

    switch (templateName) {
      case "welcome":
        title = "Edit Welcome Email Template"
        subject = "Welcome to CampusConnect!"
        content = `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to CampusConnect</title>
</head>
<body>
    <h1>Welcome to CampusConnect, {{name}}!</h1>
    <p>Thank you for joining our community of college students and faculty.</p>
    <p>With CampusConnect, you can:</p>
    <ul>
        <li>Ask questions about colleges and academic programs</li>
        <li>Connect with current students and alumni</li>
        <li>Share your knowledge and experiences</li>
    </ul>
    <p>To get started, <a href="{{loginUrl}}">log in to your account</a> and complete your profile.</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Best regards,<br>The CampusConnect Team</p>
</body>
</html>`
        break
      case "password-reset":
        title = "Edit Password Reset Email Template"
        subject = "Reset Your CampusConnect Password"
        content = `<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password</title>
</head>
<body>
    <h1>Password Reset Request</h1>
    <p>Hello {{name}},</p>
    <p>We received a request to reset your password for your CampusConnect account.</p>
    <p>To reset your password, click the link below:</p>
    <p><a href="{{resetUrl}}">Reset Your Password</a></p>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p>Best regards,<br>The CampusConnect Team</p>
</body>
</html>`
        break
      case "email-verification":
        title = "Edit Email Verification Template"
        subject = "Verify Your CampusConnect Email"
        content = `<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email</title>
</head>
<body>
    <h1>Verify Your Email Address</h1>
    <p>Hello {{name}},</p>
    <p>Thank you for registering with CampusConnect. To complete your registration, please verify your email address by clicking the link below:</p>
    <p><a href="{{verifyUrl}}">Verify Your Email</a></p>
    <p>This link will expire in 24 hours.</p>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,<br>The CampusConnect Team</p>
</body>
</html>`
        break
      case "new-question":
        title = "Edit New Question Notification Template"
        subject = "New Question in Your Topics"
        content = `<!DOCTYPE html>
<html>
<head>
    <title>New Question Notification</title>
</head>
<body>
    <h1>New Question in Your Topics</h1>
    <p>Hello {{name}},</p>
    <p>A new question has been posted in a topic you follow:</p>
    <h2>{{questionTitle}}</h2>
    <p>{{questionExcerpt}}</p>
    <p><a href="{{questionUrl}}">View the full question and answer</a></p>
    <p>Best regards,<br>The CampusConnect Team</p>
</body>
</html>`
        break
      case "new-answer":
        title = "Edit New Answer Notification Template"
        subject = "New Answer to Your Question"
        content = `<!DOCTYPE html>
<html>
<head>
    <title>New Answer Notification</title>
</head>
<body>
    <h1>New Answer to Your Question</h1>
    <p>Hello {{name}},</p>
    <p>Your question has received a new answer:</p>
    <h2>{{questionTitle}}</h2>
    <p><strong>Answer:</strong> {{answerExcerpt}}</p>
    <p><a href="{{questionUrl}}">View the full answer</a></p>
    <p>Best regards,<br>The CampusConnect Team</p>
</body>
</html>`
        break
    }

    templateModalTitle.textContent = title
    templateSubject.value = subject
    templateContent.value = content

    // Open modal
    templateModal.style.display = "block"
  }

  function saveEmailTemplate() {
    const templateName = templateId.value
    const subject = templateSubject.value
    const content = templateContent.value

    if (!subject || !content) {
      alert("Please fill in both the subject and content fields")
      return
    }

    // In a real application, we would send an API request to save the template
    // For this demo, we'll just show a success message
    showToast(`${templateName.charAt(0).toUpperCase() + templateName.slice(1)} email template saved successfully`)

    // Close modal
    closeTemplateModal()
  }

  function closeTemplateModal() {
    templateModal.style.display = "none"
  }

  function closeAllModals() {
    closeTemplateModal()
  }

  function showToast(message) {
    alert(message) // Replace with a more sophisticated toast notification
  }

  function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }
})

// Add styles for settings page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .settings-section {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            margin-bottom: 1.5rem;
            overflow: hidden;
        }
        
        .section-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--admin-border-color);
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
        
        .input-with-button {
            display: flex;
            gap: 0.5rem;
        }
        
        .input-with-button .form-control {
            flex: 1;
        }
        
        .file-upload {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        
        .current-logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        
        .current-logo img {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border: 1px solid var(--admin-border-color);
            border-radius: 0.25rem;
            padding: 0.5rem;
        }
        
        .current-logo span {
            font-size: 0.8rem;
            color: var(--admin-secondary);
        }
        
        .checkbox-group,
        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 0.5rem;
        }
        
        .checkbox-label,
        .radio-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }
        
        .email-templates-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .template-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid var(--admin-border-color);
            border-radius: 0.35rem;
            background-color: var(--admin-light);
        }
        
        .template-info h3 {
            margin: 0 0 0.25rem;
            font-size: 1rem;
        }
        
        .template-info p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--admin-secondary);
        }
        
        .template-editor {
            font-family: monospace;
            white-space: pre;
        }
        
        .integration-item {
            margin-bottom: 1.5rem;
            border: 1px solid var(--admin-border-color);
            border-radius: 0.35rem;
            overflow: hidden;
        }
        
        .integration-header {
            display: flex;
            align-items: center;
            padding: 1rem;
            background-color: var(--admin-light);
        }
        
        .integration-logo {
            width: 3rem;
            height: 3rem;
            border-radius: 0.35rem;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-right: 1rem;
            box-shadow: 0 0.15rem 0.5rem rgba(0, 0, 0, 0.1);
        }
        
        .integration-logo i {
            color: #4285F4;
        }
        
        .integration-logo .fa-facebook {
            color: #3b5998;
        }
        
        .integration-info {
            flex: 1;
        }
        
        .integration-info h3 {
            margin: 0 0 0.25rem;
            font-size: 1.1rem;
        }
        
        .integration-info p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--admin-secondary);
        }
        
        .integration-toggle {
            margin-left: 1rem;
        }
        
        .integration-details {
            padding: 1.5rem;
            border-top: 1px solid var(--admin-border-color);
        }
        
        /* Toggle Switch */
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
        }
        
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
        }
        
        input:checked + .slider {
            background-color: var(--admin-primary);
        }
        
        input:focus + .slider {
            box-shadow: 0 0 1px var(--admin-primary);
        }
        
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        
        .slider.round {
            border-radius: 24px;
        }
        
        .slider.round:before {
            border-radius: 50%;
        }
        
        @media (max-width: 768px) {
            .form-row {
                flex-direction: column;
                gap: 1rem;
            }
            
            .file-upload {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .integration-header {
                flex-wrap: wrap;
            }
            
            .integration-toggle {
                margin-left: 0;
                margin-top: 1rem;
                width: 100%;
                display: flex;
                justify-content: flex-end;
            }
        }
    `
  document.head.appendChild(style)
})
