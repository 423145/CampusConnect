const API_BASE_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    // Get college ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const collegeId = urlParams.get('id');

    if (!collegeId) {
        window.location.href = 'colleges.html';
        return;
    }

    // Fetch college details
    fetchCollegeDetails(collegeId);
});

async function fetchCollegeDetails(collegeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/colleges/${collegeId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch college details');
        }

        const college = await response.json();
        displayCollegeDetails(college);
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load college details. Please try again later.');
    }
}

function displayCollegeDetails(college) {
    // Update page title
    document.title = `${college.name} - College Details`;

    // Update college header
    document.getElementById('collegeName').textContent = college.name;
    document.getElementById('collegeLocation').textContent = college.location;
    document.getElementById('collegeType').textContent = college.type;

    // Update description
    document.getElementById('collegeDescription').textContent = college.description;

    // Update contact information
    document.getElementById('collegeEmail').textContent = college.contact.email;
    document.getElementById('collegePhone').textContent = college.contact.phone;
    document.getElementById('collegeWebsite').href = college.contact.website;

    // Update key information
    document.getElementById('collegeEstablished').textContent = college.established;
    document.getElementById('collegeAccreditation').textContent = college.accreditation.join(', ');

    // Update facilities
    const facilitiesList = document.getElementById('collegeFacilities');
    facilitiesList.innerHTML = college.facilities.map(facility => `
        <div class="facility-item">
            <i class="fas fa-check"></i>
            <span>${facility}</span>
        </div>
    `).join('');
}

function showError(message) {
    const container = document.getElementById('collegeDetails');
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <a href="colleges.html" class="btn btn-primary">Back to Colleges</a>
        </div>
    `;
} 