// Admin Common JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin common script loaded")

  // Check if user is admin
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || currentUser.role !== "admin") {
    // Redirect to login page if not admin
    alert("You must be an admin to access this page")
    window.location.href = "/pages/login.html?redirect=/admin/html/dashboard.html"
    return
  }

  // Toggle sidebar on mobile
  const sidebarToggle = document.querySelector(".mobile-menu-toggle")
  const sidebar = document.querySelector(".admin-sidebar")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active")
    })
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 576 &&
      !e.target.closest(".admin-sidebar") &&
      !e.target.closest(".mobile-menu-toggle") &&
      sidebar.classList.contains("active")
    ) {
      sidebar.classList.remove("active")
    }
  })

  // Toggle notifications dropdown
  const notificationIcon = document.querySelector(".notification-icon")
  const notificationDropdown = document.querySelector(".notification-dropdown")

  if (notificationIcon && notificationDropdown) {
    notificationIcon.addEventListener("click", (e) => {
      e.preventDefault()
      notificationDropdown.style.display = notificationDropdown.style.display === "block" ? "none" : "block"
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".notifications")) {
        notificationDropdown.style.display = "none"
      }
    })
  }

  // Toggle admin profile dropdown
  const profileToggle = document.querySelector(".admin-profile-toggle")
  const profileDropdown = document.querySelector(".admin-dropdown")

  if (profileToggle && profileDropdown) {
    profileToggle.addEventListener("click", (e) => {
      e.preventDefault()
      profileDropdown.style.display = profileDropdown.style.display === "block" ? "none" : "block"
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".admin-profile")) {
        profileDropdown.style.display = "none"
      }
    })
  }

  // Handle logout
  const logoutBtn = document.getElementById("admin-logout")

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove current user from localStorage
      localStorage.removeItem("currentUser")

      // Redirect to login page
      window.location.href = "/pages/login.html"
    })
  }

  // Update admin profile info
  const adminName = document.querySelector(".admin-name")
  const adminAvatar = document.querySelector(".admin-avatar")

  if (adminName && adminAvatar && currentUser) {
    adminName.textContent = currentUser.name

    if (currentUser.avatar) {
      adminAvatar.innerHTML = `<img src="${currentUser.avatar}" alt="${currentUser.name}">`
    } else {
      adminAvatar.innerHTML = `<span>${getInitials(currentUser.name)}</span>`
    }
  }

  // Helper function to get initials from name
  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Format date helper function
  window.formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format time helper function
  window.formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format date and time helper function
  window.formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format relative time helper function
  window.formatRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60))
        return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    } else {
      return window.formatDate(dateString)
    }
  }

  // Show confirmation dialog helper function
  window.showConfirmDialog = (message, callback) => {
    if (confirm(message)) {
      callback()
    }
  }

  // Show toast notification helper function
  window.showToast = (message, type = "success") => {
    // Create toast element if it doesn't exist
    let toast = document.querySelector(".admin-toast")

    if (!toast) {
      toast = document.createElement("div")
      toast.className = "admin-toast"
      document.body.appendChild(toast)
    }

    // Set toast content and type
    toast.textContent = message
    toast.className = `admin-toast ${type}`

    // Show toast
    toast.classList.add("show")

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  // Add toast styles if not already added
  if (!document.querySelector("#toast-styles")) {
    const style = document.createElement("style")
    style.id = "toast-styles"
    style.textContent = `
            .admin-toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                border-radius: 4px;
                color: white;
                font-size: 14px;
                z-index: 9999;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .admin-toast.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .admin-toast.success {
                background-color: var(--admin-success);
            }
            
            .admin-toast.error {
                background-color: var(--admin-danger);
            }
            
            .admin-toast.warning {
                background-color: var(--admin-warning);
            }
            
            .admin-toast.info {
                background-color: var(--admin-info);
            }
        `
    document.head.appendChild(style)
  }
})
