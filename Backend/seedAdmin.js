const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Needed if you manually hash, but usually handled in Model
require('dotenv').config();

const User = require('./models/User');

const createAdminUser = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // ---------------------------------------------------------
    // 👇 BEST PRACTICE: USE ENV VARIABLES 👇
    // ---------------------------------------------------------
    const adminEmail = process.env.ADMIN_EMAIL || "tusharsaini9521@gmail.com"; 
    const adminPassword = process.env.ADMIN_PASSWORD || "Reaper_19"; 
    // ---------------------------------------------------------

    if (!adminEmail || !adminPassword) {
      console.log('⚠ Credentials missing. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env');
      return;
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      // If admin exists, UPDATE the password
      // The User model's pre-save hook handles hashing
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
    process.exit(1); // Exit with failure code
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0); // Exit with success code
  }
};

createAdminUser();