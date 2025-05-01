// AI-generated questions and answers data
const questionData = [
    {
        id: 1,
        userId: "user1",
        title: "How difficult is it to get into Tech Institute of Innovation's Computer Science program?",
        content: "I'm planning to apply for the B.Tech Computer Science program at TII. Can current students share their experience about the admission process, cutoff marks, and preparation tips?",
        college: "Tech Institute of Innovation",
        tags: ["admissions", "computer science", "academics"],
        createdAt: "2024-01-15T10:30:00Z",
        upvotes: 45,
        views: 230,
        answers: [
            {
                id: "a1",
                userId: "user2",
                content: "As a current CS student at TII, I can tell you that the admission process is quite competitive. The cutoff last year was 95% for general category. Focus on strong mathematics and programming fundamentals. The institute also considers extracurricular achievements in tech competitions.",
                createdAt: "2024-01-15T11:45:00Z",
                upvotes: 28
            },
            {
                id: "a2",
                userId: "user3",
                content: "Adding to the above, there's also a coding aptitude test after the initial screening. Practice competitive programming and work on your problem-solving skills. The interview panel looks for passion in technology and innovation.",
                createdAt: "2024-01-15T13:20:00Z",
                upvotes: 15
            }
        ]
    },
    {
        id: 2,
        userId: "user4",
        title: "What's the placement scenario at Global Business School?",
        content: "I'm interested in the MBA program at GBS. Could someone share insights about the placement statistics, top recruiters, and average package?",
        college: "Global Business School",
        tags: ["placements", "mba", "career"],
        createdAt: "2024-01-14T09:15:00Z",
        upvotes: 52,
        views: 310,
        answers: [
            {
                id: "a3",
                userId: "user5",
                content: "Recent graduate here. The placement cell is very active with 100+ companies visiting annually. Average package is around 12 LPA, with top firms like McKinsey, Goldman Sachs, and Amazon being regular recruiters. Strong focus on internship conversion too.",
                createdAt: "2024-01-14T10:30:00Z",
                upvotes: 35
            }
        ]
    },
    {
        id: 3,
        userId: "user6",
        title: "How's the hostel life at Medical Sciences University?",
        content: "Prospective MBBS student here. Would like to know about the hostel facilities, mess food quality, and overall campus life at MSU.",
        college: "Medical Sciences University",
        tags: ["campus life", "hostel", "mbbs"],
        createdAt: "2024-01-13T14:20:00Z",
        upvotes: 38,
        views: 185,
        answers: [
            {
                id: "a4",
                userId: "user7",
                content: "Third-year student here. The hostels are well-maintained with 24/7 hot water and Wi-Fi. Rooms are spacious with attached bathrooms. Mess food is good with both veg and non-veg options. There are separate reading rooms and gym facilities.",
                createdAt: "2024-01-13T15:45:00Z",
                upvotes: 22
            }
        ]
    },
    {
        id: 4,
        userId: "user8",
        title: "What are the internship opportunities at Creative Arts Academy?",
        content: "Looking to join the Animation program. How are the internship opportunities? Do they have industry partnerships?",
        college: "Creative Arts Academy",
        tags: ["internships", "animation", "career"],
        createdAt: "2024-01-12T11:10:00Z",
        upvotes: 29,
        views: 145,
        answers: [
            {
                id: "a5",
                userId: "user9",
                content: "The academy has tie-ups with major animation studios and gaming companies. Summer internships are mandatory in the final year. Many students get to work on real projects with companies like Pixar, Ubisoft, and local animation studios.",
                createdAt: "2024-01-12T12:30:00Z",
                upvotes: 18
            }
        ]
    },
    {
        id: 5,
        userId: "user10",
        title: "Research opportunities at Engineering Excellence Institute?",
        content: "Interested in pursuing B.Tech in Mechanical Engineering. What kind of research projects and labs are available? Are there any industry collaborations?",
        college: "Engineering Excellence Institute",
        tags: ["research", "mechanical engineering", "academics"],
        createdAt: "2024-01-11T16:05:00Z",
        upvotes: 33,
        views: 167,
        answers: [
            {
                id: "a6",
                userId: "user11",
                content: "The institute has state-of-the-art research facilities including robotics lab, thermal engineering lab, and CAD/CAM center. There are ongoing projects with automotive companies and defense organizations. Students can participate in research from second year onwards.",
                createdAt: "2024-01-11T17:20:00Z",
                upvotes: 25
            }
        ]
    }
];

// Function to load questions into the container
function loadQuestionsData() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;

    container.innerHTML = questionData.map(question => `
        <div class="question-card">
            <div class="question-header">
                <img src="https://via.placeholder.com/50" alt="User Avatar" class="question-avatar">
                <div class="question-meta">
                    <h3><a href="question-detail.html?id=${question.id}">${question.title}</a></h3>
                    <div class="question-info">
                        <span>Asked by User${question.userId.slice(-1)}</span>
                        <span>•</span>
                        <span>${formatDate(question.createdAt)}</span>
                        ${question.college ? `<span>•</span><span class="question-college">${question.college}</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="question-content">
                <p>${question.content}</p>
            </div>
            <div class="question-tags">
                ${question.tags.map(tag => `<span class="question-tag">${tag}</span>`).join('')}
            </div>
            <div class="question-stats">
                <div class="question-stat-group">
                    <span class="question-stat"><i class="fas fa-comment"></i> ${question.answers.length} answers</span>
                    <span class="question-stat"><i class="fas fa-eye"></i> ${question.views} views</span>
                    <span class="question-stat"><i class="fas fa-thumbs-up"></i> ${question.upvotes} upvotes</span>
                </div>
                <div class="question-actions">
                    <span class="question-action" title="Upvote"><i class="far fa-thumbs-up"></i></span>
                    <span class="question-action" title="Save"><i class="far fa-bookmark"></i></span>
                    <span class="question-action" title="Share"><i class="fas fa-share-alt"></i></span>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize questions when the page loads
document.addEventListener('DOMContentLoaded', loadQuestionsData);