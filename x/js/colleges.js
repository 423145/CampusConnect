// Colleges page script
const API_BASE_URL = 'http://localhost:3000';
let colleges = [];
let map = null;
let markers = [];
let activeFilters = new Set();
let activeTagFilters = new Set();

// DOM Elements
const collegesGrid = document.getElementById('collegesGrid');
const collegeSearch = document.getElementById('collegeSearch');
const collegeType = document.getElementById('collegeType');
const collegeLocation = document.getElementById('collegeLocation');

// Initialize colleges page
const initializeColleges = async () => {
    try {
        console.log('Fetching colleges from API...');
        // Fetch colleges from API
        const response = await fetch(`${API_BASE_URL}/api/colleges`);
        if (!response.ok) {
            throw new Error(`Failed to fetch colleges: ${response.status} ${response.statusText}`);
    }
        const data = await response.json();
        console.log('Received data:', data);
        
        colleges = Array.isArray(data) ? data : (data.colleges || []);
        console.log('Processed colleges:', colleges);

        if (colleges.length === 0) {
            console.log('No colleges found in the response');
            const container = document.getElementById('collegesContainer');
            if (container) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No colleges available at the moment.</p>
                    </div>
                `;
            }
            return;
        }

        // Initialize filters
        initializeFilters();
        
        // Display colleges
        displayColleges(colleges);
    } catch (error) {
        console.error('Error initializing colleges:', error);
        const container = document.getElementById('collegesContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load colleges: ${error.message}</p>
                    <p>Please check if the server is running at ${API_BASE_URL}</p>
        </div>
    `;
        }
    }
};

// Initialize filters
const initializeFilters = () => {
    // Get unique locations
    const locations = [...new Set(colleges.map(college => college.location))];
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.innerHTML = '<option value="">All Locations</option>';
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    }

    // Get unique types
    const types = [...new Set(colleges.map(college => college.type))];
    const typeFilter = document.getElementById('collegeType');
    if (typeFilter) {
        typeFilter.innerHTML = '<option value="">All Types</option>';
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeFilter.appendChild(option);
        });
    }
};

// Display colleges
const displayColleges = (colleges) => {
    const container = document.getElementById('collegesContainer');
    if (!container) return;

    if (colleges.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No colleges found matching your criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = colleges.map(college => `
        <div class="college-card">
            <div class="college-content">
                <h3>${college.name}</h3>
                <p class="college-location">
                    <i class="fas fa-map-marker-alt"></i> ${college.location}
                </p>
                <p class="college-type">
                    <i class="fas fa-university"></i> ${college.type}
                </p>
                <div class="college-actions">
                    <a href="${college.contact.website}" class="btn btn-primary" target="_blank">
                        <i class="fas fa-globe"></i> Visit Website
                    </a>
                </div>
            </div>
        </div>
    `).join('');
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeColleges();

    // Search functionality
    if (collegeSearch) {
        collegeSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredColleges = colleges.filter(college => 
                college.name.toLowerCase().includes(searchTerm) ||
                college.location.toLowerCase().includes(searchTerm) ||
                college.type.toLowerCase().includes(searchTerm) ||
                college.description.toLowerCase().includes(searchTerm)
            );
            displayColleges(filteredColleges);
        });
    }

    // Type filter
    if (collegeType) {
        collegeType.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            const filteredColleges = selectedType 
                ? colleges.filter(college => college.type === selectedType)
                : colleges;
            displayColleges(filteredColleges);
        });
    }

    // Location filter
    if (collegeLocation) {
        collegeLocation.addEventListener('change', (e) => {
            const selectedLocation = e.target.value;
            const filteredColleges = selectedLocation 
                ? colleges.filter(college => college.location === selectedLocation)
                : colleges;
            displayColleges(filteredColleges);
        });
    }
});