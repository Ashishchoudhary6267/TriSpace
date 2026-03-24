const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/property');

dotenv.config(); 
const app = express();

// 1. THESE TWO LINES MUST BE HERE (The Translators)
app.use(express.json());
app.use(cors());

// 2. THE ROUTE MUST BE AFTER THE TRANSLATORS
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

// 3. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to TriSpace Database!'))
  .catch((err) => console.log('❌ Database connection failed:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});