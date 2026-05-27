const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  Customer_ID: {
    type: String,
    required: [true, 'Customer ID is required'],
    unique: true
  },
  Name: {
    type: String,
    default: 'Unknown Customer'
  },
  Customer_Rating: {
    type: Number,
    min: 0,
    max: 5,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
