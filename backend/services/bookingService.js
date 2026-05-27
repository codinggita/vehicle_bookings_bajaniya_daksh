const Booking = require('../models/Booking');

exports.getAllBookings = (filter, skip, limitNum, sortFields) => {
  let query = Booking.find(filter).skip(skip).limit(limitNum);
  if (sortFields) {
    query = query.sort(sortFields);
  }
  return query;
};

exports.getBookingById = async (id) => {
  return await Booking.findById(id);
};

exports.createBooking = async (data) => {
  const newBooking = new Booking(data);
  return await newBooking.save();
};

exports.updateBooking = async (id, data, overwrite = false) => {
  return await Booking.findByIdAndUpdate(id, data, { new: true, overwrite });
};

exports.deleteBooking = async (id) => {
  return await Booking.findByIdAndDelete(id);
};

exports.deleteAllBookings = async () => {
  return await Booking.deleteMany({});
};

exports.findOneBooking = async (filter) => {
  return await Booking.findOne(filter);
};

exports.findBookings = (filter) => {
  return Booking.find(filter);
};

exports.aggregate = (pipeline) => {
  return Booking.aggregate(pipeline);
};
