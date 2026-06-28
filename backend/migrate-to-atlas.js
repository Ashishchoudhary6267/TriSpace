const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Local MongoDB URI
const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/trispace';

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['Tenant', 'admin'], 
    default: 'Tenant' 
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

const PropertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Flat', 'PG', 'Room'], required: true },
  address: {
    sectorOrPhase: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  monthlyRent: { type: Number, required: true },
  electricity: {
    isIncluded: { type: Boolean, default: false },
    perUnitRate: { type: Number }
  },
  rules: {
    hasCurfew: { type: Boolean, default: false },
    genderAllowed: { type: String, default: 'Anyone' }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  image: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

async function migrateToAtlas() {
  let localConnection = null;
  let atlasConnection = null;

  try {
    console.log('🔄 Starting migration from Local MongoDB to Atlas...\n');

    // Connect to local MongoDB
    console.log('📍 Connecting to local MongoDB...');
    localConnection = await mongoose.createConnection(LOCAL_MONGO_URI);
    console.log('✅ Connected to local MongoDB\n');

    // Create models for local connection
    const LocalUser = localConnection.model('User', UserSchema);
    const LocalProperty = localConnection.model('Property', PropertySchema);

    // Get users from local database
    console.log('📥 Fetching users from local database...');
    const users = await LocalUser.find({});
    console.log(`✅ Found ${users.length} users\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found in local database to migrate.');
      process.exit(0);
    }

    // Connect to Atlas
    console.log('🌐 Connecting to MongoDB Atlas...');
    atlasConnection = await mongoose.createConnection(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Create models for atlas connection
    const AtlasUser = atlasConnection.model('User', UserSchema);
    const AtlasProperty = atlasConnection.model('Property', PropertySchema);

    // Migrate users
    console.log('📤 Migrating users to Atlas...');
    for (let user of users) {
      const userExists = await AtlasUser.findOne({ email: user.email });
      
      if (userExists) {
        console.log(`⏭️  ${user.email} - Already exists in Atlas, skipping...`);
        continue;
      }

      const newUser = new AtlasUser({
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        role: user.role,
        favorites: user.favorites,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      await newUser.save();
      console.log(`✅ Migrated user: ${user.email}`);
    }

    // Migrate properties
    console.log('\n📥 Fetching properties from local database...');
    const properties = await LocalProperty.find({});
    console.log(`✅ Found ${properties.length} properties\n`);

    if (properties.length > 0) {
      console.log('📤 Migrating properties to Atlas...');
      for (let property of properties) {
        const propExists = await AtlasProperty.findOne({ _id: property._id });
        
        if (propExists) {
          console.log(`⏭️  Property ${property.title} - Already exists, skipping...`);
          continue;
        }

        const newProperty = new AtlasProperty({
          _id: property._id,
          owner: property.owner,
          title: property.title,
          type: property.type,
          address: property.address,
          monthlyRent: property.monthlyRent,
          electricity: property.electricity,
          rules: property.rules,
          status: property.status,
          image: property.image,
          createdAt: property.createdAt,
          updatedAt: property.updatedAt,
        });

        await newProperty.save();
        console.log(`✅ Migrated property: ${property.title}`);
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Migrated ${users.length} users and ${properties.length} properties to MongoDB Atlas`);

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
    process.exit(0);
  }
}

migrateToAtlas();
