const Data = require('../models/Data');
const pjson = require('../package.json');

// GET /bookings/top/highest-fare
exports.getHighestFareBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const bookings = await Data.find().sort({ Booking_Value: -1 }).limit(limit);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching highest fare bookings', error: error.message });
  }
};

// GET /bookings/top/lowest-fare
exports.getLowestFareBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const bookings = await Data.find({ Booking_Value: { $gt: 0 } }).sort({ Booking_Value: 1 }).limit(limit);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lowest fare bookings', error: error.message });
  }
};

// GET /bookings/recent (or latest)
exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    // Assuming Date and Time fields or _id can be used for sorting recent
    const bookings = await Data.find().sort({ _id: -1 }).limit(limit);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent bookings', error: error.message });
  }
};

// GET /bookings/random
exports.getRandomBookings = async (req, res) => {
  try {
    const size = parseInt(req.query.limit, 10) || 5;
    const bookings = await Data.aggregate([{ $sample: { size } }]);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random bookings', error: error.message });
  }
};

// GET /bookings/trending
exports.getTrendingBookings = async (req, res) => {
  try {
    // Trending could mean most popular pickup locations recently
    const limit = parseInt(req.query.limit, 10) || 10;
    const trending = await Data.aggregate([
      { $group: { _id: '$Pickup_Location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit }
    ]);
    res.status(200).json(trending);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending bookings', error: error.message });
  }
};

// GET /compare
exports.compareBookings = async (req, res) => {
  try {
    const { booking1, booking2 } = req.query;
    if (!booking1 || !booking2) {
      return res.status(400).json({ message: 'booking1 and booking2 query parameters are required' });
    }
    const b1 = await Data.findOne({ Booking_ID: booking1 });
    const b2 = await Data.findOne({ Booking_ID: booking2 });
    
    if (!b1 || !b2) {
      return res.status(404).json({ message: 'One or both bookings not found' });
    }
    
    res.status(200).json({
      comparison: {
        fare_difference: Math.abs((b1.Booking_Value || 0) - (b2.Booking_Value || 0)),
        distance_difference: Math.abs((b1.Ride_Distance || 0) - (b2.Ride_Distance || 0))
      },
      booking1: b1,
      booking2: b2
    });
  } catch (error) {
    res.status(500).json({ message: 'Error comparing bookings', error: error.message });
  }
};

// GET /bookings/summary/ai
exports.getAiSummary = (req, res) => {
  // Mock AI summary
  res.status(200).json({
    summary: "Based on AI analysis, Prime SUVs are most popular during evening hours, while Bikes dominate short-distance morning commutes."
  });
};

// GET /health
exports.getHealth = (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
};

// GET /version
exports.getVersion = (req, res) => {
  res.status(200).json({ version: pjson.version || '1.0.0', name: pjson.name });
};
