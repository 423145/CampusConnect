// Database Initialization Script
// This script initializes the database with sample data using localStorage

// Check if database is already initialized
const isInitialized = localStorage.getItem('dbInitialized');

if (!isInitialized) {
    console.log('Initializing database...');
    
    // Initialize users
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@student.nitandhra.ac.in',
            password: 'password123',
            role: 'student',
            college: 'NIT Andhra Pradesh',
            course: 'Computer Science',
            year: '3',
            bio: 'Computer Science student passionate about web development and AI.',
            avatar: '../assets/avatar1.jpg',
            verified: true,
            emailVerified: true,
            reputation: 120,
            badges: ['helpful', 'knowledgeable'],
            createdAt: '2024-12-15T10:30:00Z',
            notifications: {
                emailAnswers: true,
                emailComments: true,
                emailUpvotes: false,
                emailMentions: true,
                pushAll: true
            }
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@gmail.com',
            password: 'password123',
            role: 'prospective',
            bio: 'High school senior looking to pursue engineering.',
            avatar: '../assets/avatar2.jpg',
            verified: false,
            emailVerified: true,
            reputation: 30,
            badges: ['curious'],
            createdAt: '2025-01-05T14:20:00Z',
            notifications: {
                emailAnswers: true,
                emailComments: true,
                emailUpvotes: true,
                emailMentions: true,
                pushAll: true
            }
        },
        {
            id: 3,
            name: 'Robert Johnson',
            email: 'robert@student.iitm.ac.in',
            password: 'password123',
            role: 'student',
            college: 'IIT Madras',
            course: 'Electrical Engineering',
            year: '2',
            bio: 'Electrical Engineering student with interest in renewable energy.',
            avatar: '../assets/avatar3.jpg',
            verified: true,
            emailVerified: true,
            reputation: 85,
            badges: ['helpful'],
            createdAt: '2024-11-20T09:15:00Z',
            notifications: {
                emailAnswers: true,
                emailComments: false,
                emailUpvotes: false,
                emailMentions: true,
                pushAll: false
            }
        },
        {
            id: 4,
            name: 'Sarah Williams',
            email: 'sarah@student.bitspilani.ac.in',
            password: 'password123',
            role: 'student',
            college: 'BITS Pilani',
            course: 'Mechanical Engineering',
            year: '4',
            bio: 'Final year Mechanical Engineering student. Research assistant in robotics lab.',
            avatar: '../assets/avatar4.jpg',
            verified: true,
            emailVerified: true,
            reputation: 150,
            badges: ['helpful', 'knowledgeable', 'expert'],
            createdAt: '2024-10-10T16:45:00Z',
            notifications: {
                emailAnswers: true,
                emailComments: true,
                emailUpvotes: true,
                emailMentions: true,
                pushAll: true
            }
        },
        {
            id: 5,
            name: 'Michael Brown',
            email: 'admin@gmail.com',
            password: 'admin123',
            role: 'admin',
            bio: 'Platform administrator and community manager.',
            avatar: '../assets/avatar5.jpg',
            verified: true,
            emailVerified: true,
            reputation: 500,
            badges: ['admin', 'moderator', 'expert'],
            createdAt: '2024-01-01T08:00:00Z',
            notifications: {
                emailAnswers: false,
                emailComments: false,
                emailUpvotes: false,
                emailMentions: true,
                pushAll: false
            }
        }
    ];
    
    // Initialize colleges
    const colleges = [
        {
            id: 1,
            name: 'IIT Madras',
            location: 'Chennai, Tamil Nadu',
            description: 'Indian Institute of Technology Madras is a public technical and research university located in Chennai, Tamil Nadu. As one of the Indian Institutes of Technology, it is recognized as an Institute of National Importance and has been consistently ranked as one of the top engineering institutes in India.',
            image: '../assets/college1.jpg',
            students: 8500,
            questions: 1250,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Aerospace Engineering', 'Chemical Engineering', 'Biotechnology'],
            facilities: ['Hostel', 'Sports Complex', 'Library', 'Medical Center', 'Wi-Fi Campus', 'Cafeteria', 'Gym', 'Swimming Pool', 'Auditorium', 'Research Labs'],
            ranking: 1,
            website: 'https://www.iitm.ac.in',
            coordinates: [13.0067, 80.2206],
            type: 'iit',
            region: 'south',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 2,
            name: 'BITS Pilani',
            location: 'Pilani, Rajasthan',
            description: 'Birla Institute of Technology and Science, Pilani is a private deemed university in Pilani, India. It focuses primarily on higher education and research in engineering and sciences. The institute was established in its present form in 1964.',
            image: '../assets/college2.jpg',
            students: 7200,
            questions: 980,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Biotechnology', 'Economics'],
            facilities: ['Hostel', 'Sports Complex', 'Library', 'Medical Center', 'Wi-Fi Campus', 'Cafeteria', 'Gym', 'Swimming Pool', 'Auditorium', 'Research Labs'],
            ranking: 3,
            website: 'https://www.bits-pilani.ac.in',
            coordinates: [28.3639, 75.5873],
            type: 'private',
            region: 'north',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 3,
            name: 'NIT Andhra Pradesh',
            location: 'Tadepalligudem, Andhra Pradesh',
            description: 'National Institute of Technology, Andhra Pradesh is one of the 31 NITs in India and is located in Tadepalligudem, Andhra Pradesh. It was established in 2015 and is an autonomous institute functioning under the aegis of Ministry of Education, Government of India.',
            image: '../assets/college3.jpg',
            students: 4500,
            questions: 650,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication', 'Metallurgical Engineering'],
            facilities: ['Hostel', 'Sports Complex', 'Library', 'Medical Center', 'Wi-Fi Campus', 'Cafeteria', 'Auditorium', 'Research Labs'],
            ranking: 12,
            website: 'https://www.nitandhra.ac.in',
            coordinates: [16.7500, 81.5000],
            type: 'nit',
            region: 'south',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 4,
            name: 'VIT Vellore',
            location: 'Vellore, Tamil Nadu',
            description: 'Vellore Institute of Technology is a private deemed university located in Vellore, Tamil Nadu. Founded in 1984 as Vellore Engineering College, it has grown to become one of the top engineering schools in India.',
            image: '../assets/college4.jpg',
            students: 12000,
            questions: 1500,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication', 'Biotechnology', 'Information Technology'],
            facilities: ['Hostel', 'Sports Complex', 'Library', 'Medical Center', 'Wi-Fi Campus', 'Cafeteria', 'Gym', 'Auditorium', 'Research Labs'],
            ranking: 8,
            website: 'https://www.vit.ac.in',
            coordinates: [12.9692, 79.1559],
            type: 'private',
            region: 'south',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 5,
            name: 'SRM University',
            location: 'Chennai, Tamil Nadu',
            description: 'SRM Institute of Science and Technology, formerly known as SRM University, is a private university located in Chennai, Tamil Nadu. It was founded in 1985 and offers a wide range of undergraduate, postgraduate, and doctoral programs in engineering, management, medicine, and sciences.',
            image: '../assets/college5.jpg',
            students: 15000,
            questions: 1800,
            courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Communication', 'Biotechnology', 'Information Technology', 'Aerospace Engineering'],
            facilities: ['Hostel', 'Sports Complex', 'Library', 'Medical Center', 'Wi-Fi Campus', 'Cafeteria', 'Gym', 'Auditorium', 'Research Labs'],
            ranking: 15,
            website: 'https://www.srmist.edu.in',
            coordinates: [12.8230, 80.0444],
            type: 'private',
            region: 'south',
            createdAt: '2024-01-01T00:00:00Z'
        }
    ];
    
    // Initialize questions
    const questions = [
        {
            id: 1,
            userId: 2,
            title: 'What are the housing options for first-year students at IIT Madras?',
            content: 'I\'ve been accepted to IIT Madras for the upcoming academic year and I\'m wondering about the housing options. Are first-year students guaranteed on-campus housing? What are the different types of hostels available? Are there any tips for choosing the best hostel?',
            college: 'IIT Madras',
            tags: ['housing', 'first-year', 'hostels'],
            createdAt: '2025-03-15T09:30:00Z',
            views: 120,
            upvotes: 15,
            isAnonymous: false,
            answers: [
                {
                    id: 1,
                    userId: 3,
                    content: 'Yes, first-year students are guaranteed on-campus housing at IIT Madras. There are several hostels available, each with its own culture and facilities. Most first-years are assigned to Mandakini, Pampa, or Tamiraparani hostels. Rooms are typically double occupancy with shared bathrooms. All hostels have Wi-Fi, laundry facilities, and common rooms. The mess food is decent, but varies by hostel. My advice is to embrace the hostel culture as it\'s a big part of the IIT experience!',
                    createdAt: '2025-03-15T10:45:00Z',
                    upvotes: 8,
                    downvotes: 1,
                    isBestAnswer: true,
                    isAnonymous: false
                },
                {
                    id: 2,
                    userId: 4,
                    content: 'Adding to what Robert said, the hostels at IIT Madras are located within a beautiful forested campus. You might even see deer and other wildlife! One thing to note is that the climate in Chennai is quite hot and humid, so bring appropriate clothing. Also, while you don\'t get to choose your hostel in the first year, you can request a specific roommate if you know someone else joining.',
                    createdAt: '2025-03-15T14:20:00Z',
                    upvotes: 5,
                    downvotes: 0,
                    isAnonymous: false
                }
            ]
        },
        {
            id: 2,
            userId: 1,
            title: 'How difficult is it to change branches after the first year at NIT Andhra Pradesh?',
            content: 'I\'ve been offered Computer Science at NIT Andhra Pradesh, but I\'m also interested in Electronics and Communication. I\'ve heard that it\'s possible to change branches after the first year based on performance. How difficult is this process? What CGPA would I need to maintain? Are there any other factors considered?',
            college: 'NIT Andhra Pradesh',
            tags: ['academics', 'branch-change', 'first-year'],
            createdAt: '2025-03-10T16:45:00Z',
            views: 85,
            upvotes: 10,
            isAnonymous: false,
            answers: [
                {
                    id: 3,
                    userId: 3,
                    content: 'Branch change at NIT Andhra Pradesh is possible but competitive. You typically need a CGPA of at least 9.0/10.0 in your first year to be considered. The exact cutoff varies each year depending on the number of seats available and the number of applicants. Computer Science to Electronics is one of the easier transitions since they have some overlap. Besides CGPA, they also consider if there are available seats in your target department. My advice would be to focus on getting the highest possible grades in your first year if you\'re serious about changing.',
                    createdAt: '2025-03-10T18:30:00Z',
                    upvotes: 7,
                    downvotes: 0,
                    isAnonymous: false
                }
            ]
        },
        {
            id: 3,
            userId: 4,
            title: 'What are the best clubs to join at BITS Pilani for someone interested in robotics?',
            content: 'I\'ll be joining BITS Pilani this fall and I\'m really interested in robotics. What are the best clubs or student groups to join? Are there any robotics competitions that BITS teams participate in? Any advice from current students would be greatly appreciated!',
            college: 'BITS Pilani',
            tags: ['clubs', 'robotics', 'extracurricular'],
            createdAt: '2025-03-05T11:20:00Z',
            views: 95,
            upvotes: 12,
            isAnonymous: false,
            answers: [
                {
                    id: 4,
                    userId: 1,
                    content: 'BITS Pilani has several great options for robotics enthusiasts! The main one is the Robotics Association (RA), which works on various projects throughout the year and participates in competitions like Robocon and ABU Robocon. There\'s also Project Embryo, which focuses on autonomous vehicles. If you\'re interested in the software side, you might want to check out the Coding Club as well. Most clubs have recruitment drives during the first few weeks of the semester, so keep an eye out for those announcements!',
                    createdAt: '2025-03-05T13:40:00Z',
                    upvotes: 9,
                    downvotes: 0,
                    isBestAnswer: true,
                    isAnonymous: false
                }
            ]
        },
        {
            id: 4,
            userId: 3,
            title: 'How is the placement scenario for Electrical Engineering students at IIT Madras?',
            content: 'I\'m currently in my second year of Electrical Engineering at IIT Madras. I\'m starting to think about placements and I\'m wondering what the scenario is like for EE students. What are the typical companies that recruit? What\'s the average package? Are there good opportunities for core electrical roles or do most students end up in IT?',
            college: 'IIT Madras',
            tags: ['placements', 'electrical-engineering', 'career'],
            createdAt: '2025-02-28T14:15:00Z',
            views: 150,
            upvotes: 18,
            isAnonymous: false,
            answers: [
                {
                    id: 5,
                    userId: 4,
                    content: 'The placement scenario for EE at IIT Madras is quite good. Core electrical companies like ABB, Schneider, Siemens, and Texas Instruments regularly recruit. The average package is around 12-15 LPA, with top performers getting offers of 20+ LPA. Many EE students also get offers from consulting firms like McKinsey and BCG, as well as tech giants like Microsoft and Google. While it\'s true that a significant number of EE grads do end up in IT or finance due to higher packages, there are definitely good core opportunities if that\'s what you\'re interested in. My advice would be to build a strong profile with relevant projects and internships in your area of interest.',
                    createdAt: '2025-02-28T16:30:00Z',
                    upvotes: 12,
                    downvotes: 1,
                    isAnonymous: false
                }
            ]
        },
        {
            id: 5,
            userId: 2,
            title: 'How does the mess food compare between different colleges?',
            content: 'I\'ve been accepted to multiple colleges (IIT Madras, BITS Pilani, and VIT Vellore) and I\'m trying to make my decision. One of the factors I\'m considering is the quality of daily life, including the food. How does the mess food compare between these colleges? Are there good alternatives if the mess food isn\'t great?',
            tags: ['food', 'mess', 'campus-life'],
            createdAt: '2025-02-20T10:10:00Z',
            views: 200,
            upvotes: 25,
            isAnonymous: false,
            answers: [
                {
                    id: 6,
                    userId: 3,
                    content: 'I can speak for IIT Madras. The mess food is decent but repetitive. Each hostel has its own mess with slightly different menus. Some are better than others. There are also several canteens and cafes on campus with good and affordable options. Zaitoon and Gurunath are popular spots. Off-campus, there are plenty of restaurants in Adyar and Velachery that deliver to campus.',
                    createdAt: '2025-02-20T11:25:00Z',
                    upvotes: 15,
                    downvotes: 2,
                    isAnonymous: false
                },
                {
                    id: 7,
                    userId: 4,
                    content: 'BITS Pilani student here. Our mess food is hit or miss. Some items are consistently good, others not so much. We have multiple messes and you can choose which one to eat at. There\'s also a food court with outlets like Subway and Cafe Coffee Day. The town of Pilani is small, so off-campus options are limited, but there are a few decent restaurants that deliver. Many students also cook simple meals in their rooms using induction cookers.',
                    createdAt: '2025-02-20T12:40:00Z',
                    upvotes: 18,
                    downvotes: 1,
                    isBestAnswer: true,
                    isAnonymous: false
                }
            ]
        }
    ];
    
    // Initialize notifications
    const notifications = [
        {
            id: 1,
            userId: 1,
            type: 'answer',
            content: '<strong>Sarah Williams</strong> answered your question about branch change at NIT Andhra Pradesh.',
            link: 'question-detail.html?id=2',
            read: false,
            createdAt: '2025-03-10T18:30:00Z'
        },
        {
            id: 2,
            userId: 1,
            type: 'upvote',
            content: 'Your answer about robotics clubs at BITS Pilani received an upvote.',
            link: 'question-detail.html?id=3',
            read: true,
            createdAt: '2025-03-06T09:15:00Z'
        },
        {
            id: 3,
            userId: 2,
            type: 'answer',
            content: '<strong>Robert Johnson</strong> answered your question about housing at IIT Madras.',
            link: 'question-detail.html?id=1',
            read: false,
            createdAt: '2025-03-15T10:45:00Z'
        },
        {
            id: 4,
            userId: 2,
            type: 'answer',
            content: '<strong>Sarah Williams</strong> also answered your question about housing at IIT Madras.',
            link: 'question-detail.html?id=1',
            read: false,
            createdAt: '2025-03-15T14:20:00Z'
        },
        {
            id: 5,
            userId: 3,
            type: 'upvote',
            content: 'Your answer about housing at IIT Madras received an upvote.',
            link: 'question-detail.html?id=1',
            read: true,
            createdAt: '2025-03-16T08:30:00Z'
        },
        {
            id: 6,
            userId: 4,
            type: 'upvote',
            content: 'Your answer about placements at IIT Madras received an upvote.',
            link: 'question-detail.html?id=4',
            read: false,
            createdAt: '2025-03-01T10:20:00Z'
        },
        {
            id: 7,
            userId: 4,
            type: 'mention',
            content: '<strong>John Doe</strong> mentioned you in a comment: "Thanks @Sarah for the detailed answer!"',
            link: 'question-detail.html?id=4',
            read: true,
            createdAt: '2025-03-01T11:45:00Z'
        }
    ];
    
    // Initialize comments
    const comments = [
        {
            id: 1,
            userId: 2,
            answerId: 1,
            questionId: 1,
            content: 'Thanks for the detailed information! Do you know if there are any single rooms available for first-year students?',
            createdAt: '2025-03-15T11:30:00Z',
            upvotes: 2
        },
        {
            id: 2,
            userId: 3,
            answerId: 1,
            questionId: 1,
            content: 'No, single rooms are typically reserved for senior students (3rd year and above). First-years almost always get double occupancy.',
            createdAt: '2025-03-15T12:15:00Z',
            upvotes: 3
        },
        {
            id: 3,
            userId: 1,
            answerId: 3,
            questionId: 2,
            content: 'This is really helpful information. I\'ll definitely focus on my grades in the first year.',
            createdAt: '2025-03-10T19:45:00Z',
            upvotes: 1
        },
        {
            id: 4,
            userId: 4,
            answerId: 4,
            questionId: 3,
            content: 'I was part of the Robotics Association at BITS. It\'s a great community and you learn a lot. Highly recommend it!',
            createdAt: '2025-03-05T15:20:00Z',
            upvotes: 4
        },
        {
            id: 5,
            userId: 1,
            answerId: 5,
            questionId: 4,
            content: 'Thanks @Sarah for the detailed answer! Do you know if internships during the summer after 2nd year help with placements?',
            createdAt: '2025-03-01T11:45:00Z',
            upvotes: 2
        },
        {
            id: 6,
            userId: 4,
            answerId: 5,
            questionId: 4,
            content: 'Summer internships are extremely valuable. Many companies offer PPOs (Pre-Placement Offers) based on internship performance.',
            createdAt: '2025-03-01T13:30:00Z',
            upvotes: 3
        }
    ];
    
    // Initialize reports
    const reports = [
        {
            id: 1,
            contentId: 5,
            contentType: 'question',
            reason: 'inappropriate',
            details: 'This question contains inappropriate language.',
            reportedBy: 3,
            reportedAt: '2025-02-21T08:15:00Z',
            status: 'pending'
        },
        {
            id: 2,
            contentId: 6,
            contentType: 'answer',
            reason: 'misinformation',
            details: 'This answer contains incorrect information about the mess food at IIT Madras.',
            reportedBy: 1,
            reportedAt: '2025-02-22T14:30:00Z',
            status: 'resolved'
        },
        {
            id: 3,
            contentId: 5,
            contentType: 'comment',
            reason: 'spam',
            details: 'This comment is spam and not related to the question.',
            reportedBy: 4,
            reportedAt: '2025-03-02T09:45:00Z',
            status: 'pending'
        }
    ];
    
    // Initialize badges
    const badges = [
        {
            id: 'helpful',
            name: 'Helpful',
            description: 'Provided 5 or more answers marked as helpful',
            icon: 'fas fa-hands-helping',
            color: '#4CAF50'
        },
        {
            id: 'knowledgeable',
            name: 'Knowledgeable',
            description: 'Received 10 or more upvotes on answers',
            icon: 'fas fa-brain',
            color: '#2196F3'
        },
        {
            id: 'expert',
            name: 'Expert',
            description: 'Had 3 or more answers selected as best answer',
            icon: 'fas fa-award',
            color: '#FFC107'
        },
        {
            id: 'curious',
            name: 'Curious',
            description: 'Asked 5 or more questions',
            icon: 'fas fa-question-circle',
            color: '#9C27B0'
        },
        {
            id: 'moderator',
            name: 'Moderator',
            description: 'Helps moderate the platform',
            icon: 'fas fa-shield-alt',
            color: '#F44336'
        },
        {
            id: 'admin',
            name: 'Admin',
            description: 'Platform administrator',
            icon: 'fas fa-user-shield',
            color: '#000000'
        }
    ];
    
    // Initialize saved questions
    const savedQuestions = {
        '1': [1, 3, 5],  // User 1 saved questions 1, 3, 5
        '2': [1, 2],     // User 2 saved questions 1, 2
        '3': [4, 5],     // User 3 saved questions 4, 5
        '4': [2, 3]      // User 4 saved questions 2, 3
    };
    
    // Initialize user upvotes
    const userUpvotes = {
        '1': {
            questions: [3, 5],
            answers: [1, 6, 7]
        },
        '2': {
            questions: [2, 4],
            answers: [3, 4, 5]
        },
        '3': {
            questions: [1, 3, 5],
            answers: [2, 4, 7]
        },
        '4': {
            questions: [1, 2, 4],
            answers: [1, 3, 6]
        }
    };
    
    // Initialize blocked users
    const blockedUsers = {
        '1': [],  // User 1 has not blocked anyone
        '2': [],  // User 2 has not blocked anyone
        '3': [],  // User 3 has not blocked anyone
        '4': []   // User 4 has not blocked anyone
    };
    
    // Save data to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('colleges', JSON.stringify(colleges));
    localStorage.setItem('questions', JSON.stringify(questions));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('comments', JSON.stringify(comments));
    localStorage.setItem('reports', JSON.stringify(reports));
    localStorage.setItem('badges', JSON.stringify(badges));
    localStorage.setItem('savedQuestions', JSON.stringify(savedQuestions));
    localStorage.setItem('userUpvotes', JSON.stringify(userUpvotes));
    localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
    
    // Mark database as initialized
    localStorage.setItem('dbInitialized', 'true');
    
    console.log('Database initialized successfully!');
} else {
    console.log('Database already initialized.');
}

// Function to reset database (for testing purposes)
window.resetDatabase = function() {
    localStorage.removeItem('dbInitialized');
    localStorage.removeItem('users');
    localStorage.removeItem('colleges');
    localStorage.removeItem('questions');
    localStorage.removeItem('notifications');
    localStorage.removeItem('comments');
    localStorage.removeItem('reports');
    localStorage.removeItem('badges');
    localStorage.removeItem('savedQuestions');
    localStorage.removeItem('userUpvotes');
    localStorage.removeItem('blockedUsers');
    localStorage.removeItem('currentUser');
    
    console.log('Database reset successfully. Refresh the page to reinitialize.');
};

// Function to create admin user
window.createAdminUser = function() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if admin already exists
    const adminExists = users.some(user => user.role === 'admin');
    
    if (!adminExists) {
        const newAdmin = {
            id: users.length + 1,
            name: 'Admin User',
            email: 'admin@campusconnect.com',
            password: 'admin123',
            role: 'admin',
            bio: 'System administrator',
            avatar: '../assets/default-avatar.jpg',
            verified: true,
            emailVerified: true,
            reputation: 500,
            badges: ['admin', 'moderator'],
            createdAt: new Date().toISOString(),
            notifications: {
                emailAnswers: false,
                emailComments: false,
                emailUpvotes: false,
                emailMentions: true,
                pushAll: false
            }
        };
        
        users.push(newAdmin);
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('Admin user created successfully!');
        console.log('Email: admin@campusconnect.com');
        console.log('Password: admin123');
    } else {
        console.log('Admin user already exists.');
    }
};