const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@ellipsonic.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const user = await User.create({
    name: 'Ellipsonic Admin',
    email,
    password: await bcrypt.hash(password, 10),
    role: 'admin',
  });

  console.log(`Created admin user: ${user.email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
