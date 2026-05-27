const statsService = require('../services/statsService');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseHandler');

// GET /stats/total-bookings
exports.getTotalBookings = catchAsync(async (req, res) => {
  const count = await statsService.countDocuments({});
  sendResponse(res, 200, true, 'Fetched total bookings', { total_bookings: count });
});

// GET /stats/success-rides
exports.getSuccessRidesCount = catchAsync(async (req, res) => {
  const count = await statsService.countDocuments({ Booking_Status: 'Success' });
  sendResponse(res, 200, true, 'Fetched success rides', { success_rides: count });
});

// GET /stats/cancelled-rides
exports.getCancelledRidesCount = catchAsync(async (req, res) => {
  const count = await statsService.countDocuments({ Booking_Status: /Canceled/i });
  sendResponse(res, 200, true, 'Fetched cancelled rides', { cancelled_rides: count });
});

// GET /stats/incomplete-rides
exports.getIncompleteRidesCount = catchAsync(async (req, res) => {
  const count = await statsService.countDocuments({ Incomplete_Rides: 'Yes' });
  sendResponse(res, 200, true, 'Fetched incomplete rides', { incomplete_rides: count });
});

// GET /stats/driver-not-found
exports.getDriverNotFoundCount = catchAsync(async (req, res) => {
  const count = await statsService.countDocuments({ Booking_Status: 'Driver Not Found' });
  sendResponse(res, 200, true, 'Fetched driver not found', { driver_not_found: count });
});

// GET /stats/total-customers
exports.getTotalCustomers = catchAsync(async (req, res) => {
  const customers = await statsService.getDistinctCustomers();
  sendResponse(res, 200, true, 'Fetched total customers', { total_customers: customers.length });
});

// GET /stats/top-vehicle
exports.getTopVehicle = catchAsync(async (req, res) => {
  const result = await statsService.aggregate([
    { $group: { _id: '$Vehicle_Type', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  sendResponse(res, 200, true, 'Fetched top vehicle', { top_vehicle: result[0] || null });
});

// GET /stats/top-payment-method
exports.getTopPaymentMethod = catchAsync(async (req, res) => {
  const result = await statsService.aggregate([
    { $group: { _id: '$Payment_Method', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  sendResponse(res, 200, true, 'Fetched top payment method', { top_payment_method: result[0] || null });
});

// GET /stats/highest-fare
exports.getHighestFare = catchAsync(async (req, res) => {
  const result = await statsService.aggregate([
    { $sort: { Booking_Value: -1 } },
    { $limit: 1 },
    { $project: { Booking_ID: 1, Booking_Value: 1 } }
  ]);
  sendResponse(res, 200, true, 'Fetched highest fare', { highest_fare: result[0] || null });
});

// GET /stats/lowest-fare
exports.getLowestFare = catchAsync(async (req, res) => {
  const result = await statsService.aggregate([
    { $match: { Booking_Value: { $gt: 0 } } },
    { $sort: { Booking_Value: 1 } },
    { $limit: 1 },
    { $project: { Booking_ID: 1, Booking_Value: 1 } }
  ]);
  sendResponse(res, 200, true, 'Fetched lowest fare', { lowest_fare: result[0] || null });
});
