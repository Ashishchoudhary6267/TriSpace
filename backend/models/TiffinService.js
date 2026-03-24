const mongoose = require('mongoose');

const tiffinSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true }, 
  
  mealType: { type: String, enum: ['Veg', 'Non-Veg', 'Both'], required: true },
  deliveryAreas: [{ type: String }], 
  
  pricing: {
    twoMealsPerDayMonthly: { type: Number }, 
    perThaliRate: { type: Number } 
  },

  weeklyMenu: {
    monday: { type: String },
    tuesday: { type: String },
    wednesday: { type: String },
    thursday: { type: String },
    friday: { type: String },
    saturday: { type: String },
    sunday: { type: String }
  },
  
  contactPhone: { type: String, required: true },
  isFssaiVerified: { type: Boolean, default: false } 

}, { timestamps: true });

module.exports = mongoose.model('TiffinService', tiffinSchema);