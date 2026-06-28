const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to TriSpace Database!');
  } catch (err) {
    console.log('❌ Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
