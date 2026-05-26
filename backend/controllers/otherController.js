const Data = require('../models/Data');

// Utility function to handle pagination
const getPagination = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  return { skip: (page - 1) * limit, limit };
};

// 1. GET /customers - Paginate customers
exports.getCustomers = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    // As we don't have a separate customers collection, return distinct customer fields or full bookings
    // We'll return full bookings with just the customer details for simplicity
    const customers = await Data.find({}, 'Customer_ID Customer_Rating').skip(skip).limit(limit);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// 2. GET /vehicles - Paginate vehicles
exports.getVehicles = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const vehicles = await Data.find({}, 'Vehicle_Type Vehicle_Image').skip(skip).limit(limit);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};

// 3. GET /success-rides - Paginate successful rides
exports.getSuccessRides = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const rides = await Data.find({ Booking_Status: 'Success' }).skip(skip).limit(limit);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching successful rides', error: error.message });
  }
};

// 4. GET /cancelled-rides - Paginate cancelled rides
exports.getCancelledRides = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const rides = await Data.find({ Booking_Status: /Canceled/i }).skip(skip).limit(limit);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cancelled rides', error: error.message });
  }
};

// 5. GET /incomplete-rides - Paginate incomplete rides
exports.getIncompleteRides = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const rides = await Data.find({ Incomplete_Rides: 'Yes' }).skip(skip).limit(limit);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incomplete rides', error: error.message });
  }
};

// 6. GET /ratings - Paginate ratings
exports.getRatings = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const ratings = await Data.find({}, 'Driver_Ratings Customer_Rating').skip(skip).limit(limit);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};

// 7. GET /payments - Paginate payments
exports.getPayments = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const payments = await Data.find({}, 'Payment_Method Booking_Value').skip(skip).limit(limit);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
};

// 8. GET /admin/bookings - Paginate admin bookings
exports.getAdminBookings = async (req, res) => {
  try {
    const { skip, limit } = getPagination(req);
    const bookings = await Data.find({}).skip(skip).limit(limit);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin bookings', error: error.message });
  }
};

// --- POST Routes ---

const createGenericRecord = async (req, res, recordName) => {
  try {
    const newRecord = new Data(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json({ message: `${recordName} created successfully`, data: savedRecord });
  } catch (error) {
    res.status(500).json({ message: `Error creating ${recordName}`, error: error.message });
  }
};

const bulkInsertGeneric = async (req, res, recordName) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Request body must be an array of objects' });
    }
    const insertedRecords = await Data.insertMany(req.body);
    res.status(201).json({ message: `${recordName} bulk inserted successfully`, count: insertedRecords.length });
  } catch (error) {
    res.status(500).json({ message: `Error during bulk insert of ${recordName}`, error: error.message });
  }
};

exports.createCustomer = (req, res) => createGenericRecord(req, res, 'Customer');
exports.createDriver = (req, res) => createGenericRecord(req, res, 'Driver');
exports.createPayment = (req, res) => createGenericRecord(req, res, 'Payment');
exports.createRating = (req, res) => createGenericRecord(req, res, 'Rating');
exports.createVehicle = (req, res) => createGenericRecord(req, res, 'Vehicle');
exports.createLocation = (req, res) => createGenericRecord(req, res, 'Location');

exports.bulkInsertBookings = (req, res) => bulkInsertGeneric(req, res, 'Bookings');
exports.bulkInsertCustomers = (req, res) => bulkInsertGeneric(req, res, 'Customers');
exports.bulkInsertDrivers = (req, res) => bulkInsertGeneric(req, res, 'Drivers');
