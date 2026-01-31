const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // ---------------------------------------------------------
    // 👇 ENTER YOUR NEW SECURE DETAILS HERE 👇
    // ---------------------------------------------------------
    const adminEmail = "tusharsaini9521@gmail.com"; // Change this if you want a new email
    const adminPassword = "Re@per_19"; // <--- Type your new password here
    // ---------------------------------------------------------

    if (!adminEmail || !adminPassword) {
      console.log('⚠ Credentials missing. Please edit seedAdmin.js');
      return;
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      // If admin exists, UPDATE the password
      adminExists.password = adminPassword;
      await adminExists.save();
      console.log('✓ SUCCESS: Admin password updated for:', adminEmail);
    } else {
      // If admin does not exist, CREATE it
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log('✓ SUCCESS: New Admin created:', adminEmail);
    }

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();