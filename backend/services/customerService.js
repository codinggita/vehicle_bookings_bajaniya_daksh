const Customer = require('../models/Customer');

exports.getCustomers = async (skip, limit) => {
  return await Customer.find({}).skip(skip).limit(limit);
};

exports.createCustomer = async (data) => {
  const newCustomer = new Customer(data);
  return await newCustomer.save();
};

exports.deleteCustomer = async (id) => {
  return await Customer.findByIdAndDelete(id);
};
