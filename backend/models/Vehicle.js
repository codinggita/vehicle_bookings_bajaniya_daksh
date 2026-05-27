const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  Vehicle_Type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    unique: true
  },
  Vehicle_Image: {
    type: String,
    default: 'default_vehicle.jpg'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
