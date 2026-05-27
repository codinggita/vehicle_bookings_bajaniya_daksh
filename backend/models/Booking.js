const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  Booking_ID: {
    type: String,
    required: [true, 'Booking ID is required'],
    unique: true
  },
  Customer_ID: {
    type: String, // Referencing customer by their unique ID string
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  Driver_ID: {
    type: String, // Referencing driver by string ID if assigned
    ref: 'Driver',
    default: null
  },
  Vehicle_Type: {
    type: String,
    ref: 'Vehicle',
    required: [true, 'Vehicle Type is required']
  },
  Booking_Status: {
    type: String,
    enum: [
      'Success',
      'Canceled by Customer',
      'Canceled by Driver',
      'Driver Not Found',
      'Incomplete'
    ],
    default: 'Success'
  },
  Payment_Method: {
    type: String,
    default: 'Cash'
  },
  Pickup_Location: {
    type: String,
    required: [true, 'Pickup Location is required']
  },
  Drop_Location: {
    type: String,
    required: [true, 'Drop Location is required']
  },
  Date: {
    type: String, // Storing as string to match old data, ideally Date type
    required: true
  },
  Time: {
    type: String,
    required: true
  },
  Booking_Value: {
    type: Number,
    required: true,
    min: 0
  },
  Ride_Distance: {
    type: Number,
    required: true,
    min: 0
  },
  Incomplete_Rides: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'No'
  },
  Incomplete_Rides_Reason: {
    type: String,
    default: null
  },
  Canceled_Rides_by_Driver: {
    type: String,
    default: null
  },
  Canceled_Rides_by_Customer: {
    type: String,
    default: null
  },
  V_TAT: {
    type: Number, // Vehicle Turnaround Time
    default: 0
  },
  C_TAT: {
    type: Number, // Customer Turnaround Time
    default: 0
  },
  Month: { type: String },
  Year: { type: String },
  Day: { type: String },
  Hour: { type: String },
  Minute: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
