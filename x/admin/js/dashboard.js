import { Chart } from "@/components/ui/chart"
// Admin Dashboard JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard script loaded")

  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const colleges = JSON.parse(localStorage.getItem("colleges") || "[]")
  const questions = JSON.parse(localStorage.getItem("questions") || "[]")

  // Count answers
  let totalAnswers = 0
  questions.forEach((question) => {
    if (question.answers) {
      totalAnswers += question.answers.length
    }
  })

  // Update stats
  document.getElementById("total-users").textContent = users.length.toLocaleString()
  document.getElementById("total-colleges").textContent = colleges.length.toLocaleString()
  document.getElementById("total-questions").textContent = questions.length.toLocaleString()
  document.getElementById("total-answers").textContent = totalAnswers.toLocaleString()

  // Calculate monthly growth
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

  // Users growth
  const newUsers = users.filter((user) => new Date(user.createdAt) > oneMonthAgo).length
  const usersGrowth = users.length > 0 ? (newUsers / users.length) * 100 : 0
  document.getElementById("users-change").textContent = `+${usersGrowth.toFixed(0)}% this month`

  // Colleges growth (mock data as we don't have createdAt for colleges)
  document.getElementById("colleges-change").textContent = "+3% this month"

  // Questions growth
  const newQuestions = questions.filter((question) => new Date(question.createdAt) > oneMonthAgo).length
  const questionsGrowth = questions.length > 0 ? (newQuestions / questions.length) * 100 : 0
  document.getElementById("questions-change").textContent = `+${questionsGrowth.toFixed(0)}% this month`

  // Answers growth (mock data as we're calculating total answers differently)
  document.getElementById("answers-change").textContent = "+22% this month"

  // Initialize user growth chart
  initUserGrowthChart()

  // Initialize user distribution chart
  initUserDistributionChart()

  // Load recent activity
  loadRecentActivity()

  // Handle user growth timeframe change
  document.getElementById("user-growth-timeframe").addEventListener("change", function () {
    initUserGrowthChart(this.value)
  })

  // Handle user distribution filter change
  const chartFilters = document.querySelectorAll(".chart-filter")
  chartFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Update active filter
      chartFilters.forEach((f) => f.classList.remove("active"))
      this.classList.add("active")

      // Update chart based on filter
      initUserDistributionChart(this.dataset.filter)
    })
  })
})

// Initialize user growth chart
function initUserGrowthChart(days = 7) {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const ctx = document.getElementById("userGrowthChart").getContext("2d")

  // Get dates for the selected timeframe
  const dates = []
  const counts = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const usersOnDate = users.filter((user) => {
      const createdAt = new Date(user.createdAt)
      return createdAt >= date && createdAt < nextDate
    }).length

    dates.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))
    counts.push(usersOnDate)
  }

  // Destroy existing chart if it exists
  if (window.userGrowthChart) {
    window.userGrowthChart.destroy()
  }

  // Create new chart
  window.userGrowthChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "New Users",
          data: counts,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          borderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
          ticks: {
            precision: 0,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          titleColor: "#333",
          bodyColor: "#333",
          borderColor: "rgba(78, 115, 223, 0.2)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: (tooltipItems) => tooltipItems[0].label,
            label: (context) => `New Users: ${context.raw}`,
          },
        },
      },
    },
  })
}

// Initialize user distribution chart
function initUserDistributionChart(filter = "all") {
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const ctx = document.getElementById("userDistributionChart").getContext("2d")

  let labels = []
  let data = []
  let backgroundColor = []
  let title = ""

  if (filter === "role") {
    // Group users by role
    const roleCount = {}

    users.forEach((user) => {
      const role = user.role
      roleCount[role] = (roleCount[role] || 0) + 1
    })

    // Prepare data for chart
    labels = Object.keys(roleCount).map((role) => role.charAt(0).toUpperCase() + role.slice(1))
    data = Object.values(roleCount)
    backgroundColor = [
      "rgba(78, 115, 223, 0.8)",
      "rgba(54, 185, 204, 0.8)",
      "rgba(28, 200, 138, 0.8)",
      "rgba(246, 194, 62, 0.8)",
      "rgba(231, 74, 59, 0.8)",
    ]
    title = "Users by Role"
  } else if (filter === "college") {
    // Group users by college
    const collegeCount = {}

    users.forEach((user) => {
      const college = user.college || "No College"
      collegeCount[college] = (collegeCount[college] || 0) + 1
    })

    // Prepare data for chart
    labels = Object.keys(collegeCount)
    data = Object.values(collegeCount)

    // Generate colors
    const colors = [
      "rgba(78, 115, 223, 0.8)",
      "rgba(54, 185, 204, 0.8)",
      "rgba(28, 200, 138, 0.8)",
      "rgba(246, 194, 62, 0.8)",
      "rgba(231, 74, 59, 0.8)",
    ]

    backgroundColor = data.map((_, i) => colors[i % colors.length])
    title = "Users by College"
  } else {
    // All users - active vs inactive (mock data)
    labels = ["Active", "Inactive"]
    data = [users.length, Math.floor(users.length * 0.2)] // Assuming 20% inactive
    backgroundColor = ["rgba(28, 200, 138, 0.8)", "rgba(231, 74, 59, 0.8)"]
    title = "User Status"
  }

  // Destroy existing chart if it exists
  if (window.userDistributionChart) {
    window.userDistributionChart.destroy()
  }

  // Create new chart
  window.userDistributionChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
          borderColor: "rgba(255, 255, 255, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
          },
          padding: {
            bottom: 10,
          },
        },
        tooltip: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          titleColor: "#333",
          bodyColor: "#333",
          borderColor: "rgba(0, 0, 0, 0.1)",
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = context.raw
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${context.label}: ${value} (${percentage}%)`
            },
          },
        },
      },
    },
  })
}

// Function to format time relative to now (e.g., "2 hours ago")
function formatRelativeTime(date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return days === 1 ? "Yesterday" : `${days} days ago`
  } else if (hours > 0) {
    return hours === 1 ? "An hour ago" : `${hours} hours ago`
  } else if (minutes > 0) {
    return minutes === 1 ? "A minute ago" : `${minutes} minutes ago`
  } else {
    return "Just now"
  }
}

// Load recent activity
function loadRecentActivity() {
  const activityList = document.getElementById("recent-activity-list")

  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const questions = JSON.parse(localStorage.getItem("questions") || "[]")

  // Create combined activity array
  const activities = []

  // Add user registrations
  users.forEach((user) => {
    activities.push({
      type: "user",
      user: user,
      date: new Date(user.createdAt),
      content: `${user.name} joined the platform`,
    })
  })

  // Add questions
  questions.forEach((question) => {
    const user = users.find((u) => u.id === question.userId)

    activities.push({
      type: "question",
      user: user,
      question: question,
      date: new Date(question.createdAt),
      content: `${user ? user.name : "A user"} posted a new question: ${question.title}`,
    })

    // Add answers
    if (question.answers) {
      question.answers.forEach((answer) => {
        const answerUser = users.find((u) => u.id === answer.userId)

        activities.push({
          type: "answer",
          user: answerUser,
          question: question,
          date: new Date(answer.createdAt),
          content: `${answerUser ? answerUser.name : "A user"} answered a question: ${question.title}`,
        })
      })
    }
  })

  // Sort activities by date (newest first)
  activities.sort((a, b) => b.date - a.date)

  // Limit to 5 activities
  const recentActivities = activities.slice(0, 5)

  // Clear activity list
  activityList.innerHTML = ""

  // Display activities
  recentActivities.forEach((activity) => {
    const activityItem = document.createElement("div")
    activityItem.className = "activity-item"

    let iconClass = ""

    switch (activity.type) {
      case "user":
        iconClass = "user-icon"
        break
      case "question":
        iconClass = "question-icon"
        break
      case "answer":
        iconClass = "answer-icon"
        break
      default:
        iconClass = "user-icon"
    }

    activityItem.innerHTML = `
            <div class="activity-icon ${iconClass}">
                <i class="fas fa-${activity.type === "user" ? "user-plus" : activity.type === "question" ? "question-circle" : "comment-alt"}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.content}</p>
                <span class="activity-time">${formatRelativeTime(activity.date)}</span>
            </div>
        `

    activityList.appendChild(activityItem)
  })
}
