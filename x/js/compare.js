// Load college comparison data
const loadComparisonData = () => {
    // Get college IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    const collegeIds = urlParams.get('ids')?.split(',').map(id => parseInt(id)) || [];
    
    // If no college IDs, redirect to colleges page
    if (collegeIds.length < 2) {
        alert('Please select at least 2 colleges to compare.');
        window.location.href = 'colleges.html';
        return;
    }
    
    // Get colleges from localStorage
    const colleges = JSON.parse(localStorage.getItem('colleges') || '[]');
    
    // Filter colleges by IDs
    const selectedColleges = colleges.filter(college => collegeIds.includes(college.id));
    
    // If not enough colleges found, redirect to colleges page
    if (selectedColleges.length < 2) {
        alert('Could not find the selected colleges. Please try again.');
        window.location.href = 'colleges.html';
        return;
    }
    
    // Render comparison table
    renderComparisonTable(selectedColleges);
    
    // Load initial section content
    loadSectionContent('overview', selectedColleges);
    
    // Set up section tabs
    const sectionTabs = document.querySelectorAll('.section-tab');
    sectionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            sectionTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Load section content
            const section = tab.dataset.section;
            loadSectionContent(section, selectedColleges);
        });
    });
    
    // Set up back button
    const backButton = document.getElementById('backToColleges');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.location.href = 'colleges.html';
        });
    }
    
    // Set up print button
    const printButton = document.getElementById('printCompare');
    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }
};

// Render comparison table
const renderComparisonTable = (colleges) => {
    const compareContainer = document.getElementById('compareContainer');
    if (!compareContainer) return;
    
    // Create table
    const table = document.createElement('table');
    table.className = 'compare-table';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add empty cell for feature column
    headerRow.appendChild(document.createElement('th'));
    
    // Add college headers
    colleges.forEach(college => {
        const th = document.createElement('th');
        th.className = 'college-header';
        th.innerHTML = `
            <img src="${college.image}" alt="${college.name}">
            <h3>${college.name}</h3>
            <p>${college.location}</p>
        `;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add basic info rows
    const basicInfoRows = [
        { label: 'Established', value: college => '2015' },
        { label: 'Type', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? 'Public' : 'Private' },
        { label: 'Campus Size', value: college => `${Math.floor(Math.random() * 500) + 100} acres` },
        { label: 'Total Students', value: college => `${college.students.toLocaleString()}` },
        { label: 'Student-Faculty Ratio', value: college => `${Math.floor(Math.random() * 10) + 10}:1` },
        { label: 'Accreditation', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? 'NAAC A++' : 'NAAC A' },
        { label: 'Website', value: college => `<a href="#">${college.name.toLowerCase().replace(/\s+/g, '')}.ac.in</a>` }
    ];
    
    basicInfoRows.forEach(row => {
        const tr = document.createElement('tr');
        
        // Add label cell
        const labelCell = document.createElement('td');
        labelCell.textContent = row.label;
        tr.appendChild(labelCell);
        
        // Add value cells for each college
        colleges.forEach(college => {
            const valueCell = document.createElement('td');
            valueCell.innerHTML = row.value(college);
            tr.appendChild(valueCell);
        });
        
        tbody.appendChild(tr);
    });
    
    // Add courses row
    const coursesRow = document.createElement('tr');
    const coursesLabel = document.createElement('td');
    coursesLabel.textContent = 'Courses Offered';
    coursesRow.appendChild(coursesLabel);
    
    colleges.forEach(college => {
        const coursesCell = document.createElement('td');
        const coursesList = document.createElement('ul');
        
        college.courses.forEach(course => {
            const courseItem = document.createElement('li');
            courseItem.textContent = course;
            coursesList.appendChild(courseItem);
        });
        
        coursesCell.appendChild(coursesList);
        coursesRow.appendChild(coursesCell);
    });
    
    tbody.appendChild(coursesRow);
    
    // Add facilities rows
    const facilities = [
        { label: 'Hostel Facilities', available: true },
        { label: 'Sports Complex', available: true },
        { label: 'Library', available: true },
        { label: 'Medical Center', available: true },
        { label: 'Wi-Fi Campus', available: true },
        { label: 'Cafeteria', available: true },
        { label: 'Gym', available: college => college.name.includes('IIT') || college.name.includes('BITS') },
        { label: 'Swimming Pool', available: college => college.name.includes('IIT') || college.name.includes('BITS') },
        { label: 'Auditorium', available: true },
        { label: 'Research Labs', available: true }
    ];
    
    facilities.forEach(facility => {
        const tr = document.createElement('tr');
        
        // Add label cell
        const labelCell = document.createElement('td');
        labelCell.textContent = facility.label;
        tr.appendChild(labelCell);
        
        // Add availability cells for each college
        colleges.forEach(college => {
            const availableCell = document.createElement('td');
            const isAvailable = typeof facility.available === 'function' ? facility.available(college) : facility.available;
            
            availableCell.innerHTML = isAvailable ? 
                '<span class="feature-available"><i class="fas fa-check"></i> Available</span>' : 
                '<span class="feature-unavailable"><i class="fas fa-times"></i> Not Available</span>';
            
            tr.appendChild(availableCell);
        });
        
        tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    compareContainer.appendChild(table);
};

// Load section content
const loadSectionContent = (section, colleges) => {
    const sectionContent = document.getElementById('sectionContent');
    if (!sectionContent) return;
    
    // Clear section content
    sectionContent.innerHTML = '';
    
    switch (section) {
        case 'overview':
            renderOverviewSection(sectionContent, colleges);
            break;
        case 'academics':
            renderAcademicsSection(sectionContent, colleges);
            break;
        case 'campus':
            renderCampusSection(sectionContent, colleges);
            break;
        case 'admissions':
            renderAdmissionsSection(sectionContent, colleges);
            break;
        case 'placements':
            renderPlacementsSection(sectionContent, colleges);
            break;
    }
};

// Render overview section
const renderOverviewSection = (container, colleges) => {
    // Create overview content
    const overviewContent = document.createElement('div');
    overviewContent.className = 'overview-content';
    
    // Add college descriptions
    colleges.forEach(college => {
        const collegeDescription = document.createElement('div');
        collegeDescription.className = 'college-description';
        
        collegeDescription.innerHTML = `
            <h3>${college.name}</h3>
            <p>${college.description}</p>
            <div class="college-highlights">
                <h4>Key Highlights</h4>
                <ul>
                    <li>Ranked among top ${Math.floor(Math.random() * 20) + 1} colleges in India</li>
                    <li>${Math.floor(Math.random() * 50) + 50}% placement rate</li>
                    <li>State-of-the-art research facilities</li>
                    <li>Vibrant campus life with ${Math.floor(Math.random() * 30) + 20}+ student clubs</li>
                    <li>International exchange programs with universities worldwide</li>
                </ul>
            </div>
            <a href="college-detail.html?id=${college.id}" class="btn btn-outline">View Full Profile</a>
        `;
        
        overviewContent.appendChild(collegeDescription);
    });
    
    // Add student satisfaction chart
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    chartContainer.innerHTML = `
        <div class="chart-header">
            <h3>Student Satisfaction Ratings</h3>
            <p>Based on surveys from current students and alumni</p>
        </div>
        <div class="chart" id="satisfactionChart">
            <canvas id="satisfactionCanvas" width="800" height="400"></canvas>
        </div>
    `;
    
    overviewContent.appendChild(chartContainer);
    
    // Add to container
    container.appendChild(overviewContent);
    
    // Render chart (in a real application, you would use a library like Chart.js)
    renderSatisfactionChart(colleges);
};

// Render academics section
const renderAcademicsSection = (container, colleges) => {
    // Create academics content
    const academicsContent = document.createElement('div');
    academicsContent.className = 'academics-content';
    
    // Add course comparison
    const courseComparison = document.createElement('div');
    courseComparison.className = 'course-comparison';
    
    // Common courses across colleges
    const commonCourses = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
    
    commonCourses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        
        // Course header
        const courseHeader = document.createElement('h4');
        courseHeader.textContent = course;
        courseCard.appendChild(courseHeader);
        
        // Course details
        const courseDetails = document.createElement('div');
        courseDetails.className = 'course-details';
        
        // Add details for each college
        colleges.forEach(college => {
            const courseDetail = document.createElement('div');
            courseDetail.className = 'course-detail';
            
            courseDetail.innerHTML = `
                <div class="detail-label">
                    <img src="${college.image}" alt="${college.name}" width="20" height="20" style="border-radius: 50%; margin-right: 5px;">
                    ${college.name}
                </div>
                <div class="detail-value">
                    ${Math.floor(Math.random() * 30) + 60} seats
                </div>
            `;
            
            courseDetails.appendChild(courseDetail);
        });
        
        courseCard.appendChild(courseDetails);
        
        // Add course metrics
        const courseMetrics = document.createElement('div');
        courseMetrics.className = 'course-metrics';
        
        courseMetrics.innerHTML = `
            <h5>Course Highlights</h5>
            <ul>
                <li>Duration: 4 years</li>
                <li>Degree: B.Tech</li>
                <li>Internship Opportunities: Yes</li>
                <li>Research Projects: Yes</li>
            </ul>
        `;
        
        courseCard.appendChild(courseMetrics);
        
        courseComparison.appendChild(courseCard);
    });
    
    academicsContent.appendChild(courseComparison);
    
    // Add faculty comparison
    const facultyComparison = document.createElement('div');
    facultyComparison.className = 'chart-container';
    
    facultyComparison.innerHTML = `
        <div class="chart-header">
            <h3>Faculty Comparison</h3>
            <p>Number of faculty members by qualification</p>
        </div>
        <div class="chart" id="facultyChart">
            <canvas id="facultyCanvas" width="800" height="400"></canvas>
        </div>
    `;
    
    academicsContent.appendChild(facultyComparison);
    
    // Add to container
    container.appendChild(academicsContent);
    
    // Render chart (in a real application, you would use a library like Chart.js)
    renderFacultyChart(colleges);
};

// Render campus section
const renderCampusSection = (container, colleges) => {
    // Create campus content
    const campusContent = document.createElement('div');
    campusContent.className = 'campus-content';
    
    // Add campus facilities comparison
    colleges.forEach(college => {
        const campusCard = document.createElement('div');
        campusCard.className = 'campus-card';
        
        campusCard.innerHTML = `
            <h3>${college.name} Campus</h3>
            <div class="campus-image">
                <img src="${college.image}" alt="${college.name} Campus">
            </div>
            <div class="campus-details">
                <h4>Campus Facilities</h4>
                <ul>
                    <li><i class="fas fa-bed"></i> Hostels for boys and girls</li>
                    <li><i class="fas fa-utensils"></i> Multiple cafeterias and food courts</li>
                    <li><i class="fas fa-book"></i> Central library with digital resources</li>
                    <li><i class="fas fa-futbol"></i> Sports complex with indoor and outdoor facilities</li>
                    <li><i class="fas fa-wifi"></i> Campus-wide Wi-Fi connectivity</li>
                    <li><i class="fas fa-bus"></i> Transportation facilities</li>
                </ul>
            </div>
            <div class="campus-life">
                <h4>Campus Life</h4>
                <p>The campus offers a vibrant environment with various cultural, technical, and sports events throughout the year. Students can participate in clubs and societies based on their interests.</p>
            </div>
        `;
        
        campusContent.appendChild(campusCard);
    });
    
    // Add to container
    container.appendChild(campusContent);
};

// Render admissions section
const renderAdmissionsSection = (container, colleges) => {
    // Create admissions content
    const admissionsContent = document.createElement('div');
    admissionsContent.className = 'admissions-content';
    
    // Add admissions table
    const admissionsTable = document.createElement('table');
    admissionsTable.className = 'compare-table';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add empty cell for criteria column
    headerRow.appendChild(document.createElement('th'));
    
    // Add college headers
    colleges.forEach(college => {
        const th = document.createElement('th');
        th.className = 'college-header';
        th.innerHTML = `
            <img src="${college.image}" alt="${college.name}" width="50" height="50">
            <h3>${college.name}</h3>
        `;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    admissionsTable.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add admission criteria rows
    const admissionCriteria = [
        { label: 'Entrance Exam', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? 'JEE Main & Advanced' : 'BITSAT / State Entrance Exam' },
        { label: 'Application Deadline', value: () => 'May 31, 2025' },
        { label: 'Application Fee', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? '₹2,000' : '₹3,500' },
        { label: 'Minimum Eligibility', value: () => '75% in 10+2 with PCM' },
        { label: 'Selection Process', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? 'JEE Rank + Counseling' : 'Entrance Exam + Interview' },
        { label: 'Annual Tuition Fee', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? '₹1,25,000 - ₹2,00,000' : '₹2,50,000 - ₹4,00,000' },
        { label: 'Scholarship Available', value: () => 'Yes (Merit & Need-based)' },
        { label: 'Hostel Fee', value: college => college.name.includes('NIT') || college.name.includes('IIT') ? '₹40,000 - ₹60,000' : '₹75,000 - ₹1,00,000' }
    ];
    
    admissionCriteria.forEach(criteria => {
        const tr = document.createElement('tr');
        
        // Add label cell
        const labelCell = document.createElement('td');
        labelCell.textContent = criteria.label;
        tr.appendChild(labelCell);
        
        // Add value cells for each college
        colleges.forEach(college => {
            const valueCell = document.createElement('td');
            valueCell.innerHTML = criteria.value(college);
            tr.appendChild(valueCell);
        });
        
        tbody.appendChild(tr);
    });
    
    admissionsTable.appendChild(tbody);
    admissionsContent.appendChild(admissionsTable);
    
    // Add cutoff trends chart
    const cutoffChart = document.createElement('div');
    cutoffChart.className = 'chart-container';
    
    cutoffChart.innerHTML = `
        <div class="chart-header">
            <h3>Entrance Exam Cutoff Trends</h3>
            <p>Minimum ranks required for admission in the last 3 years</p>
        </div>
        <div class="chart" id="cutoffChart">
            <canvas id="cutoffCanvas" width="800" height="400"></canvas>
        </div>
    `;
    
    admissionsContent.appendChild(cutoffChart);
    
    // Add to container
    container.appendChild(admissionsContent);
    
    // Render chart (in a real application, you would use a library like Chart.js)
    renderCutoffChart(colleges);
};

// Render placements section
const renderPlacementsSection = (container, colleges) => {
    // Create placements content
    const placementsContent = document.createElement('div');
    placementsContent.className = 'placements-content';
    
    // Add placement statistics chart
    const placementChart = document.createElement('div');
    placementChart.className = 'chart-container';
    
    placementChart.innerHTML = `
        <div class="chart-header">
            <h3>Placement Statistics</h3>
            <p>Percentage of students placed and average package</p>
        </div>
        <div class="chart" id="placementChart">
            <canvas id="placementCanvas" width="800" height="400"></canvas>
        </div>
    `;
    
    placementsContent.appendChild(placementChart);
    
    // Add top recruiters
    const topRecruiters = document.createElement('div');
    topRecruiters.className = 'top-recruiters';
    
    topRecruiters.innerHTML = `
        <h3>Top Recruiters</h3>
        <div class="recruiters-grid">
            ${colleges.map(college => `
                <div class="college-recruiters">
                    <h4>${college.name}</h4>
                    <ul>
                        <li>Google</li>
                        <li>Microsoft</li>
                        <li>Amazon</li>
                        <li>IBM</li>
                        <li>Infosys</li>
                        <li>TCS</li>
                        <li>Wipro</li>
                        <li>${college.name.includes('IIT') ? 'Goldman Sachs' : 'Cognizant'}</li>
                        <li>${college.name.includes('IIT') ? 'Morgan Stanley' : 'Tech Mahindra'}</li>
                        <li>${college.name.includes('IIT') ? 'Apple' : 'HCL'}</li>
                    </ul>
                </div>
            `).join('')}
        </div>
    `;
    
    placementsContent.appendChild(topRecruiters);
    
    // Add placement comparison table
    const placementTable = document.createElement('table');
    placementTable.className = 'compare-table';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Add empty cell for criteria column
    headerRow.appendChild(document.createElement('th'));
    
    // Add college headers
    colleges.forEach(college => {
        const th = document.createElement('th');
        th.className = 'college-header';
        th.innerHTML = `
            <img src="${college.image}" alt="${college.name}" width="50" height="50">
            <h3>${college.name}</h3>
        `;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    placementTable.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add placement criteria rows
    const placementCriteria = [
        { label: 'Placement Rate', value: college => `${Math.floor(Math.random() * 20) + 80}%` },
        { label: 'Average Package', value: college => college.name.includes('IIT') ? '₹12-15 LPA' : college.name.includes('NIT') ? '₹8-10 LPA' : '₹6-8 LPA' },
        { label: 'Highest Package', value: college => college.name.includes('IIT') ? '₹1.2-1.5 CPA' : college.name.includes('NIT') ? '₹50-80 LPA' : '₹30-45 LPA' },
        { label: 'Median Package', value: college => college.name.includes('IIT') ? '₹10 LPA' : college.name.includes('NIT') ? '₹7 LPA' : '₹5 LPA' },
        { label: 'Internship Opportunities', value: () => 'Yes (Summer & Winter)' },
        { label: 'Pre-Placement Offers', value: college => college.name.includes('IIT') ? '40%' : college.name.includes('NIT') ? '25%' : '15%' },
        { label: 'Career Services', value: () => 'Yes (Resume Building, Mock Interviews)' },
        { label: 'Alumni Network', value: college => college.name.includes('IIT') ? 'Very Strong' : college.name.includes('NIT') ? 'Strong' : 'Growing' }
    ];
    
    placementCriteria.forEach(criteria => {
        const tr = document.createElement('tr');
        
        // Add label cell
        const labelCell = document.createElement('td');
        labelCell.textContent = criteria.label;
        tr.appendChild(labelCell);
        
        // Add value cells for each college
        colleges.forEach(college => {
            const valueCell = document.createElement('td');
            valueCell.innerHTML = criteria.value(college);
            tr.appendChild(valueCell);
        });
        
        tbody.appendChild(tr);
    });
    
    placementTable.appendChild(tbody);
    placementsContent.appendChild(placementTable);
    
    // Add to container
    container.appendChild(placementsContent);
    
    // Render chart (in a real application, you would use a library like Chart.js)
    renderPlacementChart(colleges);
};

// Chart rendering functions (simplified for demo)
const renderSatisfactionChart = (colleges) => {
    const canvas = document.getElementById('satisfactionCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up chart dimensions
    const chartWidth = canvas.width - 100;
    const chartHeight = canvas.height - 100;
    const barWidth = chartWidth / (colleges.length * 5);
    const spacing = barWidth / 2;
    
    // Draw chart title
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Student Satisfaction Ratings (out of 5)', canvas.width / 2, 30);
    
    // Categories
    const categories = ['Academics', 'Faculty', 'Infrastructure', 'Campus Life', 'Placements'];
    const colors = ['#4a6bff', '#ff6b6b', '#28a745', '#ffc107', '#6f42c1'];
    
    // Draw legend
    ctx.font = '12px Arial';
    for (let i = 0; i < categories.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(50 + i * 150, 50, 15, 15);
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText(categories[i], 70 + i * 150, 62);
    }
    
    // Draw axes
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(50, 100 + chartHeight);
    ctx.lineTo(50 + chartWidth, 100 + chartHeight);
    ctx.strokeStyle = '#333';
    ctx.stroke();
    
    // Draw y-axis labels
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        ctx.fillText(i.toString(), 45, 100 + chartHeight - (i * chartHeight / 5));
        
        // Draw horizontal grid lines
        ctx.beginPath();
        ctx.moveTo(50, 100 + chartHeight - (i * chartHeight / 5));
        ctx.lineTo(50 + chartWidth, 100 + chartHeight - (i * chartHeight / 5));
        ctx.strokeStyle = '#eee';
        ctx.stroke();
    }
    
    // Draw bars for each college and category
    for (let i = 0; i < colleges.length; i++) {
        // Draw college name
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        ctx.fillText(colleges[i].name, 50 + (i * 5 + 2.5) * (barWidth + spacing), 100 + chartHeight + 20);
        
        // Draw bars for each category
        for (let j = 0; j < categories.length; j++) {
            // Generate random rating between 3.5 and 4.8
            const rating = Math.random() * 1.3 + 3.5;
            
            // Draw bar
            ctx.fillStyle = colors[j];
            const barHeight = rating * chartHeight / 5;
            const x = 50 + (i * 5 + j) * (barWidth + spacing);
            const y = 100 + chartHeight - barHeight;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Draw rating value
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#333';
            ctx.fillText(rating.toFixed(1), x + barWidth / 2, y - 5);
        }
    }
};

// Simplified chart rendering functions for other charts
const renderFacultyChart = (colleges) => {
    const canvas = document.getElementById('facultyCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Faculty Comparison Chart (Demo)', canvas.width / 2, canvas.height / 2);
};

const renderCutoffChart = (colleges) => {
    const canvas = document.getElementById('cutoffCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Cutoff Trends Chart (Demo)', canvas.width / 2, canvas.height / 2);
};

const renderPlacementChart = (colleges) => {
    const canvas = document.getElementById('placementCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Placement Statistics Chart (Demo)', canvas.width / 2, canvas.height / 2);
};

// Initialize page
document.addEventListener('DOMContentLoaded', loadComparisonData);