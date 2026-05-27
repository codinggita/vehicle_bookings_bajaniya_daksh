const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (skip, limit) => {
  return await Vehicle.find({}).skip(skip).limit(limit);
};

exports.createVehicle = async (data) => {
  const newVehicle = new Vehicle(data);
  return await newVehicle.save();
};

exports.deleteVehicle = async (id) => {
  return await Vehicle.findByIdAndDelete(id);
};
