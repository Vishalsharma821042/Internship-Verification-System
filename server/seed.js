const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing users
    await User.deleteMany();

    // Create admin user
    await User.create({
      name: 'System Administrator',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });

    // Create hr user
    await User.create({
      name: 'HR Manager',
      email: 'hr@test.com',
      password: 'password123',
      role: 'hr'
    });

    console.log('Seeding successful!');
    console.log('Admin: admin@test.com / password123');
    console.log('HR: hr@test.com / password123');

    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seed();
