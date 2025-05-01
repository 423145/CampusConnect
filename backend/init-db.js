const mongoose = require('mongoose');
const Question = require('./models/Question');
const College = require('./models/College');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/collegedb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    try {
        // Clear existing data
        await Question.deleteMany({});
        await College.deleteMany({});
        await User.deleteMany({});

        // Create sample colleges with detailed information
        const colleges = [
            {
                name: 'IIT Madras',
                location: 'Chennai, Tamil Nadu',
                description: 'Indian Institute of Technology Madras is a public technical and research university located in Chennai, Tamil Nadu. It is one of the premier engineering institutions in India.',
                image: '../assets/college1.jpg',
                students: 8500,
                questions: 1250,
                courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'],
                facilities: ['Hostel', 'Sports Complex', 'Library', 'Research Labs', 'Incubation Center'],
                ranking: 1,
                type: 'iit',
                region: 'south',
                contact: {
                    website: 'https://www.iitm.ac.in',
                    email: 'info@iitm.ac.in',
                    phone: '+91-44-2257-8000',
                    address: 'IIT Madras, Chennai - 600036, Tamil Nadu, India'
                }
            },
            {
                name: 'NIT Andhra Pradesh',
                location: 'Tadepalligudem, Andhra Pradesh',
                description: 'National Institute of Technology, Andhra Pradesh is one of the 31 NITs in India. It offers undergraduate and postgraduate programs in various engineering disciplines.',
                image: '../assets/college3.jpg',
                students: 4500,
                questions: 650,
                courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Electronics', 'Civil Engineering'],
                facilities: ['Hostel', 'Sports Complex', 'Library', 'Research Centers', 'Smart Classrooms'],
                ranking: 12,
                type: 'nit',
                region: 'south',
                contact: {
                    website: 'https://www.nitandhra.ac.in',
                    email: 'info@nitandhra.ac.in',
                    phone: '+91-8816-235200',
                    address: 'NIT Andhra Pradesh, Tadepalligudem - 534101, Andhra Pradesh, India'
                }
            },
            {
                name: 'IIT Delhi',
                location: 'New Delhi',
                description: 'Indian Institute of Technology Delhi is one of the premier engineering institutions in India, known for its research and academic excellence.',
                image: '../assets/college2.jpg',
                students: 9000,
                questions: 1500,
                courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Textile Technology', 'Design'],
                facilities: ['Hostel', 'Sports Complex', 'Central Library', 'Research Parks', 'Innovation Hub'],
                ranking: 2,
                type: 'iit',
                region: 'north',
                contact: {
                    website: 'https://www.iitd.ac.in',
                    email: 'info@iitd.ac.in',
                    phone: '+91-11-2659-7135',
                    address: 'IIT Delhi, Hauz Khas, New Delhi - 110016, India'
                }
            },
            {
                name: 'NIT Trichy',
                location: 'Tiruchirappalli, Tamil Nadu',
                description: 'National Institute of Technology, Tiruchirappalli is one of the oldest and most prestigious NITs in India, offering quality technical education.',
                image: '../assets/college4.jpg',
                students: 7000,
                questions: 950,
                courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Chemical Engineering', 'Architecture'],
                facilities: ['Hostel', 'Sports Complex', 'Central Library', 'Research Centers', 'Industry Collaboration Center'],
                ranking: 3,
                type: 'nit',
                region: 'south',
                contact: {
                    website: 'https://www.nitt.edu',
                    email: 'info@nitt.edu',
                    phone: '+91-431-250-3000',
                    address: 'NIT Trichy, Tanjore Main Road, Tiruchirappalli - 620015, Tamil Nadu, India'
                }
            },
            {
                name: 'IIT Bombay',
                location: 'Mumbai, Maharashtra',
                description: 'Indian Institute of Technology Bombay is one of the premier engineering institutions in India, known for its research and innovation.',
                image: '../assets/college5.jpg',
                students: 9500,
                questions: 1800,
                courses: ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Aerospace Engineering', 'Energy Science'],
                facilities: ['Hostel', 'Sports Complex', 'Central Library', 'Research Parks', 'Entrepreneurship Cell'],
                ranking: 3,
                type: 'iit',
                region: 'west',
                contact: {
                    website: 'https://www.iitb.ac.in',
                    email: 'info@iitb.ac.in',
                    phone: '+91-22-2572-2545',
                    address: 'IIT Bombay, Powai, Mumbai - 400076, Maharashtra, India'
                }
            }
        ];

        const createdColleges = await College.insertMany(colleges);
        console.log('Colleges created:', createdColleges.length);

        // Create a test user for questions
        const testUser = await User.create({
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            userType: 'current',
            role: 'student',
            collegeName: 'IIT Madras'
        });

        // Create sample questions
        const questions = [
            {
                title: 'How difficult is it to get into IIT Madras?',
                content: 'I am planning to apply for Computer Science at IIT Madras. Can anyone share their experience about the admission process?',
                college: 'IIT Madras',
                tags: ['admissions', 'computer science'],
                views: 150,
                upvotes: 25,
                author: testUser._id,
                answers: [
                    {
                        content: 'The admission process is quite competitive. You need to score well in JEE Advanced.',
                        author: testUser._id,
                        upvotes: 10
                    }
                ]
            },
            {
                title: 'What are the hostel facilities at NIT Andhra Pradesh?',
                content: 'Can anyone tell me about the hostel facilities, food, and accommodation at NIT Andhra Pradesh?',
                college: 'NIT Andhra Pradesh',
                tags: ['hostel', 'facilities'],
                views: 120,
                upvotes: 15,
                author: testUser._id,
                answers: [
                    {
                        content: 'The hostels are well-maintained with good facilities. The food is decent.',
                        author: testUser._id,
                        upvotes: 8
                    }
                ]
            }
        ];

        const createdQuestions = await Question.insertMany(questions);
        console.log('Questions created:', createdQuestions.length);

        console.log('Database initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
}); 