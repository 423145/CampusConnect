const mongoose = require('mongoose');
const Question = require('./backend/models/Question');
const User = require('./backend/models/User');

async function testMongoConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/campusconnect', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Successfully connected to MongoDB!');
    
    // List all collections
    console.log('Listing all collections in the database:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Create a test question
    console.log('Creating a test question...');
    const testQuestion = new Question({
      title: 'TEST QUESTION - Please delete me',
      content: 'This is a test question to verify database connection. You can delete this.',
      author: '65febf432b13a02c64881a87', // Replace with a valid user ID from your database
      tags: ['test', 'debug']
    });
    
    // Save the test question
    console.log('Saving test question to database...');
    const savedQuestion = await testQuestion.save();
    console.log('Test question saved successfully!', savedQuestion);
    
    // Find all questions
    console.log('Finding all questions in the database:');
    const questions = await Question.find();
    console.log(`Found ${questions.length} questions:`);
    questions.forEach((q, i) => {
      console.log(`Question ${i+1}: ${q.title} (ID: ${q._id})`);
    });
    
    // --- USER ROLE CHECK START ---
    // Find the user by email and print their role
    const userEmail = 'thecolumbus526@gmail.com';
    const user = await User.findOne({ email: userEmail });
    if (user) {
      console.log(`User found: ${user.email}`);
      console.log(`User role: ${user.role}`);
    } else {
      console.log('User not found with email:', userEmail);
    }
    // --- USER ROLE CHECK END ---
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    
  } catch (error) {
    console.error('Error during MongoDB test:', error);
  }
}

testMongoConnection();
