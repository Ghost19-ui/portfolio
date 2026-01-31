const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await User.create({
      name: 'Tushar Saini',
      email: 'tusharsaini9521@gmail.com', // Your email
      password: 'Re@per_19', // CHANGE THIS LATER
      role: 'admin'
    });
    console.log('Admin Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();