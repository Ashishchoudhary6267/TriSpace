

const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Flat', 'PG', 'Room'], required: true },
  address: {
    sectorOrPhase: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      lat: { type: Number }, // Removed 'required'
      lng: { type: Number }  // Removed 'required'
    }
  },
  monthlyRent: { type: Number, required: true },
  electricity: {
    isIncluded: { type: Boolean, default: false },
    perUnitRate: { type: Number } // Removed 'required'
  },
  rules: {
    hasCurfew: { type: Boolean, default: false },
    genderAllowed: { type: String, default: 'Anyone' }
  } ,
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);