const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Stored as bcrypt hash, never plain text
  phone: { type: String },
  // Role-Based Access Control: 'Tenant' for normal users, 'admin' for moderators
  role: { 
    type: String, 
    enum: ['Tenant', 'admin'], 
    default: 'Tenant' 
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);