const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@vesturo.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await Admin.create({
      name: 'Vesturo Admin',
      email: 'admin@vesturo.com',
      password: 'admin123', // This will be hashed automatically
      role: 'super_admin'
    });

    console.log('Admin user created successfully:');
    console.log('Email: admin@vesturo.com');
    console.log('Password: admin123');
    console.log('Role: super_admin');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
