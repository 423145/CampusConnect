const mongoose = require('mongoose');
const College = require('./models/College');

mongoose.connect('mongodb://127.0.0.1:27017/qnaDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Find all colleges
        const colleges = await College.find({});
        
        if (colleges.length === 0) {
            console.log('No colleges found in the database.');
        } else {
            console.log(`\nFound ${colleges.length} colleges in the database:`);
            console.log('----------------------------------------');
            
            colleges.forEach((college, index) => {
                console.log(`\nCollege #${index + 1}:`);
                console.log(`Name: ${college.name}`);
                console.log(`Location: ${college.location}`);
                console.log(`Type: ${college.type}`);
                console.log(`Description: ${college.description}`);
                console.log(`Established: ${college.established}`);
                console.log(`Website: ${college.contact.website}`);
                console.log(`Email: ${college.contact.email}`);
                console.log(`Phone: ${college.contact.phone}`);
                console.log(`Facilities: ${college.facilities.join(', ')}`);
                console.log('----------------------------------------');
            });
        }
        
        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        mongoose.disconnect();
    }
}); 