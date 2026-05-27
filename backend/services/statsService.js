const Booking = require('../models/Booking');
const Customer = require('../models/Customer');

exports.countDocuments = async (filter) => {
  return await Booking.countDocuments(filter);
};

exports.aggregate = async (pipeline) => {
  return await Booking.aggregate(pipeline);
};

exports.getDistinctCustomers = async () => {
  return await Customer.distinct('Customer_ID');
};
