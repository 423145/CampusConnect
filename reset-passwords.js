const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./backend/models/User');

async function resetPasswords() {
  await mongoose.connect('mongodb://localhost:27017/campusconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Set new passwords
  const updates = [
    {
      email: 'thecolumbus526@gmail.com',
      password: 'test123' // You can change this if you want
    },
    {
      email: '423145@student.nitandhra.ac.in',
      password: '12345678' // You can change this if you want
    }
  ];

  for (const { email, password } of updates) {
    const hash = await bcrypt.hash(password, 10);
    const result = await User.updateOne(
      { email },
      { $set: { password: hash } }
    );
    console.log(`Updated password for ${email}:`, result.modifiedCount > 0 ? 'Success' : 'User not found');
  }

  await mongoose.connection.close();
  console.log('Done.');
}

resetPasswords().catch(console.error);
