const bookingService = require('../services/bookingService');
const catchAsync = require('../utils/catchAsync');
const sendResponse = require('../utils/responseHandler');

// Utility function to handle pagination
const getPagination = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  return { skip: (page - 1) * limit, limit };
};

// GET /search?keyword=...
exports.searchAll = async (req, res) => {
  try {
    const { keyword } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required for search' });
    }

    const regex = new RegExp(keyword, 'i');
    
    // Search across multiple relevant fields
    const query = {
      $or: [
        { Pickup_Location: regex },
        { Drop_Location: regex },
        { Vehicle_Type: regex },
        { Booking_Status: regex },
        { Payment_Method: regex },
        { Booking_ID: regex },
        { Customer_ID: regex }
      ]
    };

    const results = await bookingService.findBookings(query).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error performing search', error: error.message });
  }
};

// GET /search/bookings?bookingId=...
exports.searchBookings = async (req, res) => {
  try {
    const { bookingId } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!bookingId) {
      return res.status(400).json({ message: 'bookingId is required' });
    }
    
    const results = await bookingService.findBookings({ Booking_ID: new RegExp(bookingId, 'i') }).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching bookings', error: error.message });
  }
};

// GET /search/customers?customerId=...
exports.searchCustomers = async (req, res) => {
  try {
    const { customerId } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!customerId) {
      return res.status(400).json({ message: 'customerId is required' });
    }
    
    const results = await bookingService.findBookings({ Customer_ID: new RegExp(customerId, 'i') }).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching customers', error: error.message });
  }
};

// GET /search/payment?method=...
exports.searchPayment = async (req, res) => {
  try {
    const { method } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!method) {
      return res.status(400).json({ message: 'method is required' });
    }
    
    const results = await bookingService.findBookings({ Payment_Method: new RegExp(method, 'i') }).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching payments', error: error.message });
  }
};

// GET /search/vehicle?type=...
exports.searchVehicle = async (req, res) => {
  try {
    const { type } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!type) {
      return res.status(400).json({ message: 'type is required' });
    }
    
    const results = await bookingService.findBookings({ Vehicle_Type: new RegExp(type, 'i') }).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching vehicles', error: error.message });
  }
};

// GET /search/location?pickup=... & drop=...
exports.searchLocation = async (req, res) => {
  try {
    const { pickup, drop } = req.query;
    const { skip, limit } = getPagination(req);
    
    const filter = {};
    if (pickup) filter.Pickup_Location = new RegExp(pickup, 'i');
    if (drop) filter.Drop_Location = new RegExp(drop, 'i');
    
    const results = await bookingService.findBookings(filter).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching locations', error: error.message });
  }
};

// GET /search/cancel-reason?reason=...
exports.searchCancelReason = async (req, res) => {
  try {
    const { reason } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!reason) {
      return res.status(400).json({ message: 'reason is required' });
    }
    
    const regex = new RegExp(reason, 'i');
    const filter = {
      $or: [
        { Canceled_Rides_by_Customer: regex },
        { Canceled_Rides_by_Driver: regex }
      ]
    };
    
    const results = await bookingService.findBookings(filter).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching cancel reasons', error: error.message });
  }
};

// GET /search/incomplete?reason=...
exports.searchIncompleteReason = async (req, res) => {
  try {
    const { reason } = req.query;
    const { skip, limit } = getPagination(req);
    
    if (!reason) {
      return res.status(400).json({ message: 'reason is required' });
    }
    
    const results = await bookingService.findBookings({ Incomplete_Rides_Reason: new RegExp(reason, 'i') }).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching incomplete reasons', error: error.message });
  }
};

// GET /search/rating?driver=... & customer=...
exports.searchRating = async (req, res) => {
  try {
    const { driver, customer } = req.query;
    const { skip, limit } = getPagination(req);
    
    const filter = {};
    if (driver) filter.Driver_Ratings = Number(driver);
    if (customer) filter.Customer_Rating = Number(customer);
    
    const results = await bookingService.findBookings(filter).skip(skip).limit(limit);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching ratings', error: error.message });
  }
};
