// College Map Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('collegeMap').setView([20.5937, 78.9629], 5); // Center on India
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // College data with coordinates
    const collegeData = [
        {
            id: 1,
            name: 'IIT Madras',
            location: 'Chennai, Tamil Nadu',
            coordinates: [13.0067, 80.2206],
            type: 'iit',
            region: 'south',
            image: '../assets/college1.jpg',
            description: 'Indian Institute of Technology Madras is a public technical and research university located in Chennai, Tamil Nadu.',
            ranking: 1,
            students: 8500,
            questions: 1250,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Aerospace Engineering']
        },
        {
            id: 2,
            name: 'BITS Pilani',
            location: 'Pilani, Rajasthan',
            coordinates: [28.3639, 75.5873],
            type: 'private',
            region: 'north',
            image: '../assets/college2.jpg',
            description: 'Birla Institute of Technology and Science, Pilani is a private deemed university in Pilani, India.',
            ranking: 3,
            students: 7200,
            questions: 980,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering']
        },
        {
            id: 3,
            name: 'NIT Andhra Pradesh',
            location: 'Tadepalligudem, Andhra Pradesh',
            coordinates: [16.7500, 81.5000],
            type: 'nit',
            region: 'south',
            image: '../assets/college3.jpg',
            description: 'National Institute of Technology, Andhra Pradesh is one of the 31 NITs in India and is located in Tadepalligudem, Andhra Pradesh.',
            ranking: 12,
            students: 4500,
            questions: 650,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication']
        },
        {
            id: 4,
            name: 'VIT Vellore',
            location: 'Vellore, Tamil Nadu',
            coordinates: [12.9692, 79.1559],
            type: 'private',
            region: 'south',
            image: '../assets/college4.jpg',
            description: 'Vellore Institute of Technology is a private deemed university located in Vellore, Tamil Nadu.',
            ranking: 8,
            students: 12000,
            questions: 1500,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication']
        },
        {
            id: 5,
            name: 'SRM University',
            location: 'Chennai, Tamil Nadu',
            coordinates: [12.8230, 80.0444],
            type: 'private',
            region: 'south',
            image: '../assets/college5.jpg',
            description: 'SRM Institute of Science and Technology, formerly known as SRM University, is a private university located in Chennai, Tamil Nadu.',
            ranking: 15,
            students: 15000,
            questions: 1800,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication']
        },
        {
            id: 6,
            name: 'IIT Delhi',
            location: 'New Delhi, Delhi',
            coordinates: [28.5456, 77.1926],
            type: 'iit',
            region: 'north',
            image: '../assets/college6.jpg',
            description: 'Indian Institute of Technology Delhi is a public technical and research university located in New Delhi, India.',
            ranking: 2,
            students: 8000,
            questions: 1100,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Textile Engineering']
        },
        {
            id: 7,
            name: 'IIT Bombay',
            location: 'Mumbai, Maharashtra',
            coordinates: [19.1334, 72.9133],
            type: 'iit',
            region: 'west',
            image: '../assets/college7.jpg',
            description: 'Indian Institute of Technology Bombay is a public technical and research university located in Mumbai, Maharashtra.',
            ranking: 3,
            students: 8200,
            questions: 1150,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Aerospace Engineering']
        },
        {
            id: 8,
            name: 'IIT Kharagpur',
            location: 'Kharagpur, West Bengal',
            coordinates: [22.3149, 87.3104],
            type: 'iit',
            region: 'east',
            image: '../assets/college8.jpg',
            description: 'Indian Institute of Technology Kharagpur is a public technical and research university located in Kharagpur, West Bengal.',
            ranking: 4,
            students: 8300,
            questions: 1050,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Architecture']
        },
        {
            id: 9,
            name: 'IIT Kanpur',
            location: 'Kanpur, Uttar Pradesh',
            coordinates: [26.5123, 80.2329],
            type: 'iit',
            region: 'north',
            image: '../assets/college9.jpg',
            description: 'Indian Institute of Technology Kanpur is a public technical and research university located in Kanpur, Uttar Pradesh.',
            ranking: 5,
            students: 7800,
            questions: 950,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Materials Science']
        },
        {
            id: 10,
            name: 'IIT Roorkee',
            location: 'Roorkee, Uttarakhand',
            coordinates: [29.8649, 77.8965],
            type: 'iit',
            region: 'north',
            image: '../assets/college10.jpg',
            description: 'Indian Institute of Technology Roorkee is a public technical and research university located in Roorkee, Uttarakhand.',
            ranking: 6,
            students: 7500,
            questions: 900,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Hydrology']
        },
        {
            id: 11,
            name: 'NIT Trichy',
            location: 'Tiruchirappalli, Tamil Nadu',
            coordinates: [10.7605, 78.8134],
            type: 'nit',
            region: 'south',
            image: '../assets/college11.jpg',
            description: 'National Institute of Technology, Tiruchirappalli is a public technical and research university located in Tiruchirappalli, Tamil Nadu.',
            ranking: 7,
            students: 6500,
            questions: 850,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication']
        },
        {
            id: 12,
            name: 'NIT Warangal',
            location: 'Warangal, Telangana',
            coordinates: [17.9899, 79.5339],
            type: 'nit',
            region: 'south',
            image: '../assets/college12.jpg',
            description: 'National Institute of Technology, Warangal is a public technical and research university located in Warangal, Telangana.',
            ranking: 9,
            students: 6000,
            questions: 800,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication']
        },
        {
            id: 13,
            name: 'IIIT Hyderabad',
            location: 'Hyderabad, Telangana',
            coordinates: [17.4456, 78.3497],
            type: 'iiit',
            region: 'south',
            image: '../assets/college13.jpg',
            description: 'International Institute of Information Technology, Hyderabad is a private deemed university located in Hyderabad, Telangana.',
            ranking: 10,
            students: 5500,
            questions: 750,
            courses: ['Computer Science', 'Electronics and Communication', 'Data Science', 'Artificial Intelligence', 'Computational Linguistics']
        },
        {
            id: 14,
            name: 'IIIT Bangalore',
            location: 'Bangalore, Karnataka',
            coordinates: [12.8446, 77.6643],
            type: 'iiit',
            region: 'south',
            image: '../assets/college14.jpg',
            description: 'International Institute of Information Technology, Bangalore is a private deemed university located in Bangalore, Karnataka.',
            ranking: 11,
            students: 5000,
            questions: 700,
            courses: ['Computer Science', 'Electronics and Communication', 'Data Science', 'Artificial Intelligence', 'Software Engineering']
        },
        {
            id: 15,
            name: 'Delhi Technological University',
            location: 'New Delhi, Delhi',
            coordinates: [28.7501, 77.1177],
            type: 'deemed',
            region: 'north',
            image: '../assets/college15.jpg',
            description: 'Delhi Technological University is a state university located in New Delhi, India.',
            ranking: 13,
            students: 7000,
            questions: 600,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication']
        }
    ];
    
    // Create custom marker icon
    function createMarkerIcon(type, isSelected = false) {
        return L.divIcon({
            className: `custom-marker-icon ${type} ${isSelected ? 'selected' : ''}`,
            iconSize: isSelected ? [16, 16] : [12, 12]
        });
    }
    
    // Store markers for filtering
    const markers = {};
    let selectedMarker = null;
    let selectedCollege = null;
    
    // Add markers to map
    collegeData.forEach(college => {
        const marker = L.marker(college.coordinates, {
            icon: createMarkerIcon(college.type),
            title: college.name
        }).addTo(map);
        
        // Store marker
        markers[college.id] = {
            marker,
            college
        };
        
        // Create popup content
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
            <img src="${college.image}" alt="${college.name}" class="popup-image">
            <div class="popup-content">
                <h3>${college.name}</h3>
                <p>${college.location}</p>
                <p>Ranking: #${college.ranking} in India</p>
                <div class="popup-actions">
                    <a href="#" class="btn btn-outline view-info-btn" data-id="${college.id}">View Info</a>
                    <a href="college-detail.html?id=${college.id}" class="btn btn-primary">View College</a>
                </div>
            </div>
        `;
        
        // Add popup to marker
        marker.bindPopup(popupContent, {
            closeButton: false,
            maxWidth: 300
        });
        
        // Add event listeners
        marker.on('click', () => {
            // Update selected marker
            if (selectedMarker) {
                selectedMarker.setIcon(createMarkerIcon(selectedCollege.type));
            }
            
            selectedMarker = marker;
            selectedCollege = college;
            marker.setIcon(createMarkerIcon(college.type, true));
            
            // Show college info
            showCollegeInfo(college);
            
            // Show nearby colleges
            showNearbyColleges(college);
        });
    });
    
    // Search and filter functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const regionFilter = document.getElementById('regionFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    // Search function
    function searchColleges() {
        const searchTerm = searchInput.value.toLowerCase();
        const region = regionFilter.value;
        const type = typeFilter.value;
        
        // Filter colleges
        Object.values(markers).forEach(({ marker, college }) => {
            const nameMatch = college.name.toLowerCase().includes(searchTerm) || 
                              college.location.toLowerCase().includes(searchTerm);
            const regionMatch = region === '' || college.region === region;
            const typeMatch = type === '' || college.type === type;
            
            // Show/hide marker based on filters
            if (nameMatch && regionMatch && typeMatch) {
                marker.addTo(map);
            } else {
                marker.remove();
            }
        });
    }
    
    // Add event listeners
    searchButton.addEventListener('click', searchColleges);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchColleges();
        }
    });
    regionFilter.addEventListener('change', searchColleges);
    typeFilter.addEventListener('change', searchColleges);
    
    // College info panel
    const collegeInfo = document.getElementById('collegeInfo');
    const collegeName = document.getElementById('collegeName');
    const infoContent = document.getElementById('infoContent');
    const infoActions = document.getElementById('infoActions');
    const closeInfo = document.getElementById('closeInfo');
    const viewCollegeBtn = document.getElementById('viewCollegeBtn');
    const viewQuestionsBtn = document.getElementById('viewQuestionsBtn');
    
    // Show college info
    function showCollegeInfo(college) {
        // Update college name
        collegeName.textContent = college.name;
        
        // Update content
        infoContent.innerHTML = `
            <img src="${college.image}" alt="${college.name}" class="college-image">
            
            <div class="college-stats">
                <div class="stat-item">
                    <div class="stat-number">#${college.ranking}</div>
                    <div class="stat-label">Ranking</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${college.students.toLocaleString()}</div>
                    <div class="stat-label">Students</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${college.questions.toLocaleString()}</div>
                    <div class="stat-label">Questions</div>
                </div>
            </div>
            
            <div class="college-detail">
                <h3>Location</h3>
                <p>${college.location}</p>
            </div>
            
            <div class="college-detail">
                <h3>Description</h3>
                <p>${college.description}</p>
            </div>
            
            <div class="college-detail">
                <h3>Courses</h3>
                <div class="college-tags">
                    ${college.courses.map(course => `<span class="college-tag">${course}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Update action buttons
        viewCollegeBtn.href = `college-detail.html?id=${college.id}`;
        viewQuestionsBtn.href = `questions.html?college=${encodeURIComponent(college.name)}`;
        
        // Show actions
        infoActions.style.display = 'flex';
    }
    
    // Close info panel
    closeInfo.addEventListener('click', () => {
        // Reset selected marker
        if (selectedMarker) {
            selectedMarker.setIcon(createMarkerIcon(selectedCollege.type));
            selectedMarker = null;
            selectedCollege = null;
        }
        
        // Reset info panel
        collegeName.textContent = 'Select a college';
        infoContent.innerHTML = '<p class="select-prompt">Click on a college marker to view details</p>';
        infoActions.style.display = 'none';
    });
    
    // Show nearby colleges
    function showNearbyColleges(selectedCollege) {
        const nearbyColleges = document.getElementById('nearbyColleges');
        
        // Calculate distances and find nearby colleges
        const nearby = collegeData
            .filter(college => college.id !== selectedCollege.id)
            .map(college => {
                const distance = calculateDistance(
                    selectedCollege.coordinates[0], selectedCollege.coordinates[1],
                    college.coordinates[0], college.coordinates[1]
                );
                return { college, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 4);
        
        // Render nearby colleges
        nearbyColleges.innerHTML = '';
        
        if (nearby.length === 0) {
            nearbyColleges.innerHTML = '<p class="select-prompt">No nearby colleges found</p>';
            return;
        }
        
        nearby.forEach(({ college, distance }) => {
            const nearbyCard = document.createElement('div');
            nearbyCard.className = 'nearby-card';
            
            nearbyCard.innerHTML = `
                <img src="${college.image}" alt="${college.name}" class="nearby-image">
                <div class="nearby-content">
                    <h3>${college.name}</h3>
                    <div class="nearby-meta">
                        <span>${college.location}</span>
                        <span>${Math.round(distance)} km away</span>
                    </div>
                    <div class="nearby-actions">
                        <a href="#" class="view-on-map" data-id="${college.id}">View on Map</a>
                        <a href="college-detail.html?id=${college.id}">Details</a>
                    </div>
                </div>
            `;
            
            nearbyColleges.appendChild(nearbyCard);
            
            // Add event listener to "View on Map" link
            const viewOnMapLink = nearbyCard.querySelector('.view-on-map');
            viewOnMapLink.addEventListener('click', (e) => {
                e.preventDefault();
                const collegeId = parseInt(viewOnMapLink.dataset.id);
                const { marker, college } = markers[collegeId];
                
                // Pan to marker and open popup
                map.panTo(marker.getLatLng());
                marker.openPopup();
                
                // Scroll to map
                document.querySelector('.map-container').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Calculate distance between two points (Haversine formula)
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    }
    
    // Handle view info button clicks in popups
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-info-btn') || e.target.closest('.view-info-btn')) {
            e.preventDefault();
            const btn = e.target.classList.contains('view-info-btn') ? e.target : e.target.closest('.view-info-btn');
            const collegeId = parseInt(btn.dataset.id);
            const { marker, college } = markers[collegeId];
            
            // Update selected marker
            if (selectedMarker) {
                selectedMarker.setIcon(createMarkerIcon(selectedCollege.type));
            }
            
            selectedMarker = marker;
            selectedCollege = college;
            marker.setIcon(createMarkerIcon(college.type, true));
            
            // Show college info
            showCollegeInfo(college);
            
            // Show nearby colleges
            showNearbyColleges(college);
            
            // Close popup
            marker.closePopup();
        }
    });
});