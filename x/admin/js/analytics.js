import { Chart } from "@/components/ui/chart"
// Analytics JavaScript

document.addEventListener("DOMContentLoaded", () => {
  console.log("Analytics script loaded")

  // Get DOM elements
  const dateRange = document.getElementById("date-range")
  const customDateRange = document.getElementById("custom-date-range")
  const startDate = document.getElementById("start-date")
  const endDate = document.getElementById("end-date")
  const applyDateRange = document.getElementById("apply-date-range")
  const exportAnalyticsBtn = document.getElementById("export-analytics-btn")
  const printAnalyticsBtn = document.getElementById("print-analytics-btn")
  const chartFilters = document.querySelectorAll(".chart-filter")

  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const questions = JSON.parse(localStorage.getItem("questions") || "[]")
  const colleges = JSON.parse(localStorage.getItem("colleges") || "[]")

  // Set default dates
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  startDate.valueAsDate = thirtyDaysAgo
  endDate.valueAsDate = today

  // Initialize charts
  initUserActivityChart()
  initContentMetricsChart()
  initUserRolesChart()
  initCollegeQuestionsChart()
  initPopularTagsChart()
  initRetentionHeatmap()

  // Event listeners
  dateRange.addEventListener("change", function () {
    if (this.value === "custom") {
      customDateRange.style.display = "flex"
    } else {
      customDateRange.style.display = "none"
      updateDateRange(this.value)
      refreshCharts()
    }
  })

  applyDateRange.addEventListener("click", () => {
    if (startDate.value && endDate.value) {
      refreshCharts()
    } else {
      alert("Please select both start and end dates")
    }
  })

  exportAnalyticsBtn.addEventListener("click", () => {
    exportAnalytics()
  })

  printAnalyticsBtn.addEventListener("click", () => {
    window.print()
  })

  chartFilters.forEach((filter) => {
    filter.addEventListener("click", function () {
      // Update active filter
      chartFilters.forEach((f) => f.classList.remove("active"))
      this.classList.add("active")

      // Update chart based on filter
      const metric = this.dataset.metric
      updateUserActivityChart(metric)
    })
  })

  // Functions
  function updateDateRange(days) {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - Number.parseInt(days))

    startDate.valueAsDate = start
    endDate.valueAsDate = end
  }

  function refreshCharts() {
    // In a real application, we would fetch new data based on the date range
    // For this demo, we'll just reinitialize the charts
    initUserActivityChart()
    initContentMetricsChart()
    initUserRolesChart()
    initCollegeQuestionsChart()
    initPopularTagsChart()
    initRetentionHeatmap()
  }

  function initUserActivityChart() {
    const ctx = document.getElementById("userActivityChart").getContext("2d")

    // Generate mock data for daily active users
    const labels = []
    const dauData = []
    const wauData = []
    const mauData = []

    // Generate dates for the last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }))

      // Generate random data
      dauData.push(Math.floor(Math.random() * 500) + 1000)
      wauData.push(Math.floor(Math.random() * 1000) + 2000)
      mauData.push(Math.floor(Math.random() * 2000) + 3000)
    }

    // Destroy existing chart if it exists
    if (window.userActivityChart) {
      window.userActivityChart.destroy()
    }

    // Create new chart
    window.userActivityChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Active Users",
            data: dauData,
            backgroundColor: "rgba(78, 115, 223, 0.05)",
            borderColor: "rgba(78, 115, 223, 1)",
            pointBackgroundColor: "rgba(78, 115, 223, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
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
          },
        },
      },
    })
  }

  function updateUserActivityChart(metric) {
    // In a real application, we would fetch new data based on the metric
    // For this demo, we'll just update the chart with mock data
    const data = window.userActivityChart.data.datasets[0]

    if (metric === "dau") {
      data.label = "Daily Active Users"
      data.data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 500) + 1000)
    } else if (metric === "wau") {
      data.label = "Weekly Active Users"
      data.data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000) + 2000)
    } else if (metric === "mau") {
      data.label = "Monthly Active Users"
      data.data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 2000) + 3000)
    }

    window.userActivityChart.update()
  }

  function initContentMetricsChart() {
    const ctx = document.getElementById("contentMetricsChart").getContext("2d")

    // Generate mock data for questions and answers
    const labels = []
    const questionsData = []
    const answersData = []

    // Generate dates for the last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      labels.push(date.toLocaleDateString("en-US", { month: "short" }))

      // Generate random data
      questionsData.push(Math.floor(Math.random() * 500) + 500)
      answersData.push(Math.floor(Math.random() * 1000) + 1000)
    }

    // Destroy existing chart if it exists
    if (window.contentMetricsChart) {
      window.contentMetricsChart.destroy()
    }

    // Create new chart
    window.contentMetricsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Questions",
            data: questionsData,
            backgroundColor: "rgba(78, 115, 223, 0.8)",
            borderColor: "rgba(78, 115, 223, 1)",
            borderWidth: 1,
          },
          {
            label: "Answers",
            data: answersData,
            backgroundColor: "rgba(28, 200, 138, 0.8)",
            borderColor: "rgba(28, 200, 138, 1)",
            borderWidth: 1,
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
            position: "top",
          },
        },
      },
    })
  }

  function initUserRolesChart() {
    const ctx = document.getElementById("userRolesChart").getContext("2d")

    // Count users by role
    const roleCount = {}
    users.forEach((user) => {
      const role = user.role || "unknown"
      roleCount[role] = (roleCount[role] || 0) + 1
    })

    // Prepare data for chart
    const labels = Object.keys(roleCount).map((role) => role.charAt(0).toUpperCase() + role.slice(1))
    const data = Object.values(roleCount)
    const backgroundColor = [
      "rgba(78, 115, 223, 0.8)",
      "rgba(28, 200, 138, 0.8)",
      "rgba(246, 194, 62, 0.8)",
      "rgba(231, 74, 59, 0.8)",
      "rgba(54, 185, 204, 0.8)",
    ]

    // Destroy existing chart if it exists
    if (window.userRolesChart) {
      window.userRolesChart.destroy()
    }

    // Create new chart
    window.userRolesChart = new Chart(ctx, {
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
            position: "right",
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
          tooltip: {
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

  function initCollegeQuestionsChart() {
    const ctx = document.getElementById("collegeQuestionsChart").getContext("2d")

    // Count questions by college
    const collegeQuestions = {}
    questions.forEach((question) => {
      if (question.collegeId) {
        collegeQuestions[question.collegeId] = (collegeQuestions[question.collegeId] || 0) + 1
      }
    })

    // Get top 5 colleges by question count
    const topColleges = Object.entries(collegeQuestions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Prepare data for chart
    const labels = []
    const data = []

    topColleges.forEach(([collegeId, count]) => {
      const college = colleges.find((c) => c.id === Number.parseInt(collegeId))
      if (college) {
        labels.push(college.name)
        data.push(count)
      }
    })

    // Destroy existing chart if it exists
    if (window.collegeQuestionsChart) {
      window.collegeQuestionsChart.destroy()
    }

    // Create new chart
    window.collegeQuestionsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Questions",
            data: data,
            backgroundColor: "rgba(78, 115, 223, 0.8)",
            borderColor: "rgba(78, 115, 223, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              precision: 0,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    })
  }

  function initPopularTagsChart() {
    const ctx = document.getElementById("popularTagsChart").getContext("2d")

    // Count questions by tag
    const tagCount = {}
    questions.forEach((question) => {
      if (question.tags) {
        question.tags.forEach((tag) => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })

    // Get top 10 tags by count
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Prepare data for chart
    const labels = topTags.map(([tag]) => tag)
    const data = topTags.map(([, count]) => count)

    // Destroy existing chart if it exists
    if (window.popularTagsChart) {
      window.popularTagsChart.destroy()
    }

    // Create new chart
    window.popularTagsChart = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "rgba(78, 115, 223, 0.8)",
              "rgba(28, 200, 138, 0.8)",
              "rgba(246, 194, 62, 0.8)",
              "rgba(231, 74, 59, 0.8)",
              "rgba(54, 185, 204, 0.8)",
              "rgba(90, 92, 105, 0.8)",
              "rgba(255, 111, 97, 0.8)",
              "rgba(123, 239, 178, 0.8)",
              "rgba(255, 177, 66, 0.8)",
              "rgba(77, 208, 225, 0.8)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: "circle",
            },
          },
        },
      },
    })
  }

  function initRetentionHeatmap() {
    const heatmapContainer = document.getElementById("retentionHeatmap")
    heatmapContainer.innerHTML = ""

    // Create table for heatmap
    const table = document.createElement("table")
    table.className = "retention-table"

    // Create header row
    const thead = document.createElement("thead")
    const headerRow = document.createElement("tr")
    headerRow.innerHTML = `
            <th>Cohort</th>
            <th>Size</th>
            <th>Week 1</th>
            <th>Week 2</th>
            <th>Week 3</th>
            <th>Week 4</th>
            <th>Week 5</th>
            <th>Week 6</th>
            <th>Week 7</th>
            <th>Week 8</th>
        `
    thead.appendChild(headerRow)
    table.appendChild(thead)

    // Create body rows
    const tbody = document.createElement("tbody")

    // Generate mock data for 6 cohorts
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr")
      const cohortDate = new Date()
      cohortDate.setDate(cohortDate.getDate() - (i * 7 + 56)) // Start 8 weeks ago, go back 1 week per cohort

      const cohortSize = Math.floor(Math.random() * 500) + 500
      const cells = [
        `<td class="cohort-date">${cohortDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}</td>`,
        `<td class="cohort-size">${cohortSize}</td>`,
      ]

      // Generate retention percentages for 8 weeks
      let prevRetention = 100
      for (let j = 0; j < 8; j++) {
        // Retention decreases over time
        const decrease = Math.floor(Math.random() * 10) + 5
        const retention = j === 0 ? 100 : Math.max(prevRetention - decrease, 0)
        prevRetention = retention

        // Determine cell color based on retention percentage
        let cellClass = ""
        if (retention >= 80) cellClass = "retention-high"
        else if (retention >= 60) cellClass = "retention-medium-high"
        else if (retention >= 40) cellClass = "retention-medium"
        else if (retention >= 20) cellClass = "retention-medium-low"
        else cellClass = "retention-low"

        cells.push(`<td class="${cellClass}">${retention}%</td>`)
      }

      row.innerHTML = cells.join("")
      tbody.appendChild(row)
    }

    table.appendChild(tbody)
    heatmapContainer.appendChild(table)
  }

  function exportAnalytics() {
    // In a real application, we would generate a CSV or PDF file
    // For this demo, we'll just show an alert
    alert("Analytics data exported successfully")
  }
})

// Add styles for analytics page
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style")
  style.textContent = `
        .date-range-picker {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .date-range-picker label {
            font-weight: 600;
        }
        
        .custom-date-range {
            display: none;
            align-items: center;
            gap: 0.5rem;
            margin-left: 1rem;
        }
        
        .analytics-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .analytics-section {
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
        
        .chart-container {
            padding: 1.5rem;
        }
        
        .chart-container.full-width {
            padding: 1.5rem;
        }
        
        .chart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .chart-header h3 {
            margin: 0;
            font-size: 1rem;
            color: var(--admin-secondary);
        }
        
        .chart-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .chart-filter {
            padding: 0.375rem 0.75rem;
            border: 1px solid var(--admin-border-color);
            background-color: white;
            font-size: 0.85rem;
            cursor: pointer;
            transition: var(--admin-transition);
        }
        
        .chart-filter:first-child {
            border-radius: 0.25rem 0 0 0.25rem;
        }
        
        .chart-filter:last-child {
            border-radius: 0 0.25rem 0.25rem 0;
        }
        
        .chart-filter.active {
            background-color: var(--admin-primary);
            color: white;
            border-color: var(--admin-primary);
        }
        
        .chart-body {
            height: 300px;
            position: relative;
        }
        
        .analytics-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
            padding: 1.5rem;
        }
        
        .metric-card {
            background-color: white;
            border-radius: 0.35rem;
            box-shadow: var(--admin-shadow);
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .metric-icon {
            width: 3rem;
            height: 3rem;
            border-radius: 0.35rem;
            background-color: var(--admin-primary-light);
            color: var(--admin-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
        }
        
        .metric-content {
            flex: 1;
        }
        
        .metric-content h3 {
            margin: 0 0 0.5rem;
            font-size: 0.9rem;
            color: var(--admin-secondary);
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        
        .metric-change {
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .metric-change.positive {
            color: var(--admin-success);
        }
        
        .metric-change.negative {
            color: var(--admin-danger);
        }
        
        .views-icon {
            background-color: rgba(54, 185, 204, 0.1);
            color: rgb(54, 185, 204);
        }
        
        .retention-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .retention-table th,
        .retention-table td {
            padding: 0.75rem;
            text-align: center;
            border: 1px solid var(--admin-border-color);
        }
        
        .retention-table th {
            background-color: var(--admin-light);
            font-weight: 600;
        }
        
        .cohort-date,
        .cohort-size {
            font-weight: 600;
        }
        
        .retention-high {
            background-color: rgba(28, 200, 138, 0.8);
            color: white;
        }
        
        .retention-medium-high {
            background-color: rgba(28, 200, 138, 0.6);
            color: white;
        }
        
        .retention-medium {
            background-color: rgba(28, 200, 138, 0.4);
            color: var(--admin-dark);
        }
        
        .retention-medium-low {
            background-color: rgba(28, 200, 138, 0.2);
            color: var(--admin-dark);
        }
        
        .retention-low {
            background-color: rgba(28, 200, 138, 0.1);
            color: var(--admin-dark);
        }
        
        @media (max-width: 1200px) {
            .analytics-grid {
                grid-template-columns: 1fr;
            }
            
            .metrics-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .date-range-picker {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .custom-date-range {
                margin-left: 0;
                margin-top: 0.5rem;
                flex-wrap: wrap;
            }
            
            .metrics-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media print {
            .admin-sidebar,
            .admin-header,
            .analytics-actions,
            .chart-actions {
                display: none !important;
            }
            
            .admin-main {
                margin-left: 0 !important;
            }
            
            .chart-body {
                height: 250px !important;
            }
            
            .admin-content {
                padding: 0 !important;
            }
        }
    `
  document.head.appendChild(style)
})
