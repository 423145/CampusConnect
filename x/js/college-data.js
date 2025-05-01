// AI-generated college data
const collegeData = [
    {
        id: 1,
        name: "Tech Institute of Innovation",
        location: "Andhra Pradesh",
        image: "https://via.placeholder.com/300",
        rating: 4.5,
        established: 1995,
        description: "A premier institute known for cutting-edge technology education and research innovation.",
        courses: ["Computer Science", "Artificial Intelligence", "Data Science", "Robotics"],
        facilities: ["Smart Classrooms", "AI Lab", "Innovation Hub", "Digital Library"],
        fees: "₹2.5L - ₹3.5L per year",
        placement: "95% placement rate",
        highlights: [
            "Industry-partnered curriculum",
            "International faculty",
            "Research collaborations with tech giants"
        ]
    },
    {
        id: 2,
        name: "Global Business School",
        location: "Tamil Nadu",
        image: "https://via.placeholder.com/300",
        rating: 4.3,
        established: 1988,
        description: "Leading business school focusing on entrepreneurship and global management.",
        courses: ["Business Administration", "Finance", "Marketing", "International Business"],
        facilities: ["Trading Lab", "Business Incubator", "Conference Center", "Research Center"],
        fees: "₹4L - ₹5L per year",
        placement: "92% placement rate",
        highlights: [
            "International exchange programs",
            "Industry mentorship",
            "Startup incubation support"
        ]
    },
    {
        id: 3,
        name: "Medical Sciences University",
        location: "Rajasthan",
        image: "https://via.placeholder.com/300",
        rating: 4.6,
        established: 1975,
        description: "Renowned medical institution with state-of-the-art healthcare facilities.",
        courses: ["Medicine", "Dentistry", "Pharmacy", "Biotechnology"],
        facilities: ["Teaching Hospital", "Research Labs", "Simulation Center", "Telemedicine Unit"],
        fees: "₹5L - ₹7L per year",
        placement: "98% placement rate",
        highlights: [
            "WHO collaborations",
            "Advanced research facilities",
            "Rural healthcare programs"
        ]
    },
    {
        id: 4,
        name: "Creative Arts Academy",
        location: "Tamil Nadu",
        image: "https://via.placeholder.com/300",
        rating: 4.2,
        established: 2005,
        description: "Modern institute specializing in digital arts and creative technology.",
        courses: ["Digital Design", "Animation", "Film Making", "Game Development"],
        facilities: ["Design Studios", "Animation Lab", "Recording Studio", "Exhibition Space"],
        fees: "₹3L - ₹4L per year",
        placement: "85% placement rate",
        highlights: [
            "Industry-standard equipment",
            "Celebrity workshops",
            "International exhibitions"
        ]
    },
    {
        id: 5,
        name: "Engineering Excellence Institute",
        location: "Andhra Pradesh",
        image: "https://via.placeholder.com/300",
        rating: 4.4,
        established: 1982,
        description: "Premier engineering college known for technical excellence and innovation.",
        courses: ["Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Chemical Engineering"],
        facilities: ["Advanced Labs", "Workshop", "Research Center", "Industry Training Center"],
        fees: "₹2.8L - ₹3.8L per year",
        placement: "90% placement rate",
        highlights: [
            "Industry partnerships",
            "Research funding",
            "Patent achievements"
        ]
    }
];

// Function to load colleges into the container
function loadColleges() {
    const container = document.getElementById('collegesContainer');
    if (!container) return;

    container.innerHTML = collegeData.map(college => `
        <div class="college-card">
            <img src="${college.image}" alt="${college.name}">
            <div class="college-info">
                <h3>${college.name}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${college.location}</p>
                <div class="rating">
                    <span class="stars">${'★'.repeat(Math.floor(college.rating))}${college.rating % 1 >= 0.5 ? '½' : ''}</span>
                    <span class="rating-value">${college.rating}/5</span>
                </div>
                <p class="description">${college.description}</p>
                <div class="college-details">
                    <p><strong>Established:</strong> ${college.established}</p>
                    <p><strong>Courses:</strong> ${college.courses.join(', ')}</p>
                    <p><strong>Fees:</strong> ${college.fees}</p>
                    <p><strong>Placement:</strong> ${college.placement}</p>
                </div>
                <div class="college-actions">
                    <button class="btn btn-primary">View Details</button>
                    <button class="btn btn-outline add-compare">Add to Compare</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize colleges when the page loads
document.addEventListener('DOMContentLoaded', loadColleges);