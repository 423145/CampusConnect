const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/campusconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// College Schema
const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    description: String,
    contact: {
        email: { type: String, required: true },
        phone: String,
        website: String
    },
    established: Number,
    accreditation: [String],
    facilities: [String],
    createdAt: { type: Date, default: Date.now }
});

const College = mongoose.model('College', collegeSchema);

// Sample colleges data
const sampleColleges = [
    {
        name: "Indian Institute of Technology Madras",
        location: "Chennai, Tamil Nadu",
        type: "IIT",
        image: "https://example.com/iitm.jpg",
        contact: {
            email: "info@iitm.ac.in",
            phone: "+91-44-2257-8000",
            website: "https://www.iitm.ac.in"
        },
        description: "One of the premier engineering institutions in India, known for excellence in technical education and research.",
        established: 1959,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Research Labs", "Sports Complex", "Student Center"]
    },
    {
        name: "National Institute of Technology Karnataka",
        location: "Surathkal, Karnataka",
        type: "NIT",
        image: "https://example.com/nitk.jpg",
        contact: {
            email: "info@nitk.ac.in",
            phone: "+91-824-2474000",
            website: "https://www.nitk.ac.in"
        },
        description: "A leading technical institution with state-of-the-art facilities and strong industry connections.",
        established: 1960,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Research Centers", "Athletic Facilities", "Libraries"]
    },
    {
        name: "VIT University",
        location: "Vellore, Tamil Nadu",
        type: "Deemed",
        image: "https://example.com/vit.jpg",
        contact: {
            email: "info@vit.ac.in",
            phone: "+91-416-220-2000",
            website: "https://vit.ac.in"
        },
        description: "A private university known for its innovative teaching methods and strong placement record.",
        established: 1984,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Smart Classrooms", "Research Labs", "Sports Complex"]
    },
    {
        name: "BITS Pilani",
        location: "Pilani, Rajasthan",
        type: "Deemed",
        image: "https://example.com/bits.jpg",
        contact: {
            email: "info@bits-pilani.ac.in",
            phone: "+91-1596-242210",
            website: "https://www.bits-pilani.ac.in"
        },
        description: "A premier technical university known for its innovative curriculum and strong industry ties.",
        established: 1964,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Research Labs", "Sports Complex", "Student Center"]
    },
    {
        name: "IIT Delhi",
        location: "New Delhi",
        type: "IIT",
        image: "https://example.com/iitd.jpg",
        contact: {
            email: "info@iitd.ac.in",
            phone: "+91-11-2659-7135",
            website: "https://www.iitd.ac.in"
        },
        description: "One of the premier engineering institutions in India, known for research and academic excellence.",
        established: 1961,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Research Labs", "Sports Complex", "Student Center"]
    },
    {
        name: "IIT Bombay",
        location: "Mumbai, Maharashtra",
        type: "IIT",
        image: "https://example.com/iitb.jpg",
        contact: {
            email: "info@iitb.ac.in",
            phone: "+91-22-2572-2545",
            website: "https://www.iitb.ac.in"
        },
        description: "A leading technology institute known for its cutting-edge research and innovation in engineering and technology.",
        established: 1958,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Research Labs", "Innovation Center", "Sports Complex", "Student Center"]
    },
    {
        name: "National Institute of Technology Andhra Pradesh",
        location: "Tadepalligudem, Andhra Pradesh",
        type: "NIT",
        image: "https://example.com/nitap.jpg",
        contact: {
            email: "info@nitandhra.ac.in",
            phone: "+91-8818-284700",
            website: "https://www.nitandhra.ac.in"
        },
        description: "A new generation technical institution focusing on cutting-edge technology and research.",
        established: 2015,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Modern Labs", "Digital Library", "Sports Complex", "Innovation Hub"]
    },
    {
        name: "Indian Institute of Technology Kerala",
        location: "Palakkad, Kerala",
        type: "IIT",
        image: "https://example.com/iitk.jpg",
        contact: {
            email: "info@iitpkd.ac.in",
            phone: "+91-4923-226300",
            website: "https://www.iitpkd.ac.in"
        },
        description: "A new IIT focused on technological innovation and sustainable development.",
        established: 2015,
        accreditation: ["AICTE", "UGC"],
        facilities: ["Research Centers", "Innovation Park", "Smart Classrooms", "Sports Facilities"]
    }
];

// Function to initialize colleges
async function initializeColleges() {
    try {
        // Clear existing colleges
        await College.deleteMany({});
        console.log('Cleared existing colleges');

        // Insert new colleges
        const result = await College.insertMany(sampleColleges);
        console.log(`Successfully added ${result.length} colleges`);

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error initializing colleges:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeColleges();