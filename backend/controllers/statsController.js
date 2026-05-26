const Data = require('../models/Data');

// GET /stats/total-bookings
exports.getTotalBookings = async (req, res) => {
  try {
    const count = await Data.countDocuments({});
    res.status(200).json({ total_bookings: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total bookings', error: error.message });
  }
};

// GET /stats/success-rides
exports.getSuccessRidesCount = async (req, res) => {
  try {
    const count = await Data.countDocuments({ Booking_Status: 'Success' });
    res.status(200).json({ success_rides: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching success rides count', error: error.message });
  }
};

// GET /stats/cancelled-rides
exports.getCancelledRidesCount = async (req, res) => {
  try {
    const count = await Data.countDocuments({ Booking_Status: /Canceled/i });
    res.status(200).json({ cancelled_rides: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cancelled rides count', error: error.message });
  }
};

// GET /stats/incomplete-rides
exports.getIncompleteRidesCount = async (req, res) => {
  try {
    const count = await Data.countDocuments({ Incomplete_Rides: 'Yes' });
    res.status(200).json({ incomplete_rides: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incomplete rides count', error: error.message });
  }
};

// GET /stats/driver-not-found
exports.getDriverNotFoundCount = async (req, res) => {
  try {
    const count = await Data.countDocuments({ Booking_Status: 'Driver Not Found' });
    res.status(200).json({ driver_not_found: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver not found count', error: error.message });
  }
};

// GET /stats/total-customers
exports.getTotalCustomers = async (req, res) => {
  try {
    const customers = await Data.distinct('Customer_ID');
    res.status(200).json({ total_customers: customers.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching total customers', error: error.message });
  }
};

// GET /stats/top-vehicle
exports.getTopVehicle = async (req, res) => {
  try {
    const result = await Data.aggregate([
      { $group: { _id: '$Vehicle_Type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    res.status(200).json({ top_vehicle: result[0] || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top vehicle', error: error.message });
  }
};

// GET /stats/top-payment-method
exports.getTopPaymentMethod = async (req, res) => {
  try {
    const result = await Data.aggregate([
      { $group: { _id: '$Payment_Method', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    res.status(200).json({ top_payment_method: result[0] || null });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top payment method', error: error.message });
  }
};

// GET /stats/highest-fare
exports.getHighestFare = async (req, res) => {
  try {
    const result = await Data.findOne({}).sort({ Booking_Value: -1 }).select('Booking_ID Booking_Value');
    res.status(200).json({ highest_fare: result });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching highest fare', error: error.message });
  }
};

// GET /stats/lowest-fare
exports.getLowestFare = async (req, res) => {
  try {
    const result = await Data.findOne({ Booking_Value: { $gt: 0 } }).sort({ Booking_Value: 1 }).select('Booking_ID Booking_Value');
    res.status(200).json({ lowest_fare: result });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lowest fare', error: error.message });
  }
};
