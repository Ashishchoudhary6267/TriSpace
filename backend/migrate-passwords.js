const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });

async function migratePasswords() {
  try {
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users to check...`);

    let migratedCount = 0;

    for (let user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a, $2b, or $2x)
      if (user.password && (user.password.startsWith('$2a') || user.password.startsWith('$2b') || user.password.startsWith('$2x'))) {
        console.log(`⏭️  ${user.email} - Already hashed, skipping...`);
        continue;
      }

      // Hash the plain text password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ Hashed password for: ${user.email}`);
      migratedCount++;
    }

    console.log(`\n✅ Migration complete! ${migratedCount} passwords hashed.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migratePasswords();
