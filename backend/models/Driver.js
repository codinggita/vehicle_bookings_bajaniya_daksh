const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  Driver_ID: {
    type: String,
    required: [true, 'Driver ID is required'],
    unique: true
  },
  Name: {
    type: String,
    default: 'Unknown Driver'
  },
  Driver_Ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
