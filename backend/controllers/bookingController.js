const Data = require('../models/Data');

// 1. GET /bookings - Fetch all bookings (Enhanced for next 20 query parameter routes)
exports.getAllBookings = async (req, res) => {
  try {
    const {
      status, vehicle, payment, pickup, drop, date, time,
      driverRating, customerRating, minFare, maxFare,
      minDistance, maxDistance, distanceAbove, distanceBelow,
      customer, incomplete, cancelledByDriver, cancelledByCustomer,
      minRating, maxRating, sort
    } = req.query;
    
    const filter = {};
    
    // Basic Exact Matches
    if (status) filter.Booking_Status = status;
    if (vehicle) filter.Vehicle_Type = vehicle;
    if (payment) filter.Payment_Method = payment;
    if (pickup) filter.Pickup_Location = pickup;
    if (drop) filter.Drop_Location = drop;
    if (date) filter.Date = date;
    if (time) filter.Time = time;
    if (driverRating) filter.Driver_Ratings = Number(driverRating);
    if (customerRating) filter.Customer_Rating = Number(customerRating);
    if (customer) filter.Customer_ID = customer;
    if (incomplete) filter.Incomplete_Rides = incomplete;
    if (cancelledByDriver) filter.Canceled_Rides_by_Driver = cancelledByDriver === 'true' ? 'Yes' : 'No';
    if (cancelledByCustomer) filter.Canceled_Rides_by_Customer = cancelledByCustomer === 'true' ? 'Yes' : 'No';

    // Ranges for Fare
    if (minFare || maxFare) {
      filter.Booking_Value = {};
      if (minFare) filter.Booking_Value.$gte = Number(minFare);
      if (maxFare) filter.Booking_Value.$lte = Number(maxFare);
    }

    // Ranges for Distance
    const minD = minDistance || distanceAbove;
    const maxD = maxDistance || distanceBelow;
    if (minD || maxD) {
      filter.Ride_Distance = {};
      if (minD) filter.Ride_Distance.$gte = Number(minD);
      if (maxD) filter.Ride_Distance.$lte = Number(maxD);
    }

    // Ranges for Driver Rating
    if (minRating || maxRating) {
      // Assuming minRating/maxRating applies to Driver Rating for this example
      if (!filter.Driver_Ratings) filter.Driver_Ratings = {};
      if (minRating) filter.Driver_Ratings.$gte = Number(minRating);
      if (maxRating) filter.Driver_Ratings.$lte = Number(maxRating);
    }

    // Query execution
    let query = Data.find(filter);

    // Sorting
    if (sort) {
      // sort=-Booking_Value -> { Booking_Value: -1 }
      const sortFields = sort.split(',').reduce((acc, field) => {
        if (field.startsWith('-')) {
          acc[field.substring(1)] = -1;
        } else {
          acc[field] = 1;
        }
        return acc;
      }, {});
      query = query.sort(sortFields);
    }

    const bookings = await query;
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// 2. GET /bookings/:bookingId - Fetch booking by _id (or Booking_ID if preferred, but _id is standard for generic ID)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Data.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// 3. POST /bookings - Create new booking
exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Data(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// 4. PUT /bookings/:bookingId - Replace booking details
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Data.findByIdAndUpdate(
      req.params.bookingId,
      req.body,
      { new: true, overwrite: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

// 5. PATCH /bookings/:bookingId/status - Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBooking = await Data.findByIdAndUpdate(
      req.params.bookingId,
      { Booking_Status: status },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error: error.message });
  }
};

// 6. DELETE /bookings/:bookingId - Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Data.findByIdAndDelete(req.params.bookingId);
    if (!deletedBooking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
};

// 7. GET /bookings/id/:bookingId - Fetch booking by Booking_ID (Custom ID)
exports.getBookingByBookingId = async (req, res) => {
  try {
    const booking = await Data.findOne({ Booking_ID: req.params.bookingId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// 8. GET /bookings/status/:status - Fetch bookings by status
exports.getBookingsByStatus = async (req, res) => {
  try {
    const bookings = await Data.find({ Booking_Status: req.params.status });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by status', error: error.message });
  }
};

// 9. GET /bookings/customer/:customerId - Fetch bookings by customer
exports.getBookingsByCustomer = async (req, res) => {
  try {
    const bookings = await Data.find({ Customer_ID: req.params.customerId });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by customer', error: error.message });
  }
};

// 10. GET /bookings/vehicle/:vehicleType - Fetch bookings by vehicle type
exports.getBookingsByVehicle = async (req, res) => {
  try {
    const bookings = await Data.find({ Vehicle_Type: req.params.vehicleType });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by vehicle', error: error.message });
  }
};

// 11. GET /bookings/payment/:method - Fetch bookings by payment method
exports.getBookingsByPayment = async (req, res) => {
  try {
    const bookings = await Data.find({ Payment_Method: req.params.method });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by payment', error: error.message });
  }
};

// 12. GET /bookings/pickup/:location - Fetch bookings by pickup location
exports.getBookingsByPickup = async (req, res) => {
  try {
    const bookings = await Data.find({ Pickup_Location: req.params.location });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by pickup', error: error.message });
  }
};

// 13. GET /bookings/drop/:location - Fetch bookings by drop location
exports.getBookingsByDrop = async (req, res) => {
  try {
    const bookings = await Data.find({ Drop_Location: req.params.location });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by drop', error: error.message });
  }
};

// 14. GET /bookings/date/:date - Fetch bookings by date
exports.getBookingsByDate = async (req, res) => {
  try {
    const bookings = await Data.find({ Date: req.params.date });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by date', error: error.message });
  }
};

// 15. GET /bookings/time/:time - Fetch bookings by time
exports.getBookingsByTime = async (req, res) => {
  try {
    const bookings = await Data.find({ Time: req.params.time });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by time', error: error.message });
  }
};

// 16. GET /bookings/rating/driver/:rating - Fetch bookings by driver rating
exports.getBookingsByDriverRating = async (req, res) => {
  try {
    const bookings = await Data.find({ Driver_Ratings: Number(req.params.rating) });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by driver rating', error: error.message });
  }
};

// 17. GET /bookings/rating/customer/:rating - Fetch bookings by customer rating
exports.getBookingsByCustomerRating = async (req, res) => {
  try {
    const bookings = await Data.find({ Customer_Rating: Number(req.params.rating) });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by customer rating', error: error.message });
  }
};

// 18. GET /bookings/distance/:distance - Fetch bookings by ride distance
exports.getBookingsByDistance = async (req, res) => {
  try {
    const bookings = await Data.find({ Ride_Distance: Number(req.params.distance) });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by distance', error: error.message });
  }
};

// 19. GET /bookings/value/:amount - Fetch bookings by fare value
exports.getBookingsByValue = async (req, res) => {
  try {
    const bookings = await Data.find({ Booking_Value: Number(req.params.amount) });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings by value', error: error.message });
  }
};

// 20. GET /bookings/incomplete/:status - Fetch incomplete bookings
exports.getIncompleteBookings = async (req, res) => {
  try {
    const bookings = await Data.find({ Incomplete_Rides: "Yes", Incomplete_Rides_Reason: req.params.status });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incomplete bookings', error: error.message });
  }
};

// 21. GET /bookings/incomplete-reason/:reason - Fetch incomplete ride reasons
exports.getBookingsByIncompleteReason = async (req, res) => {
  try {
    const bookings = await Data.find({ Incomplete_Rides_Reason: req.params.reason });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by incomplete reason', error: error.message });
  }
};

// 22. GET /bookings/cancel/customer/:reason - Fetch customer cancellation reasons
exports.getBookingsByCustomerCancelReason = async (req, res) => {
  try {
    const bookings = await Data.find({ Canceled_Rides_by_Customer: req.params.reason });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by customer cancel reason', error: error.message });
  }
};

// 23. GET /bookings/cancel/driver/:reason - Fetch driver cancellation reasons
exports.getBookingsByDriverCancelReason = async (req, res) => {
  try {
    const bookings = await Data.find({ Canceled_Rides_by_Driver: req.params.reason });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by driver cancel reason', error: error.message });
  }
};

// 24. GET /bookings/vtat/:minutes - Fetch bookings by VTAT
exports.getBookingsByVtat = async (req, res) => {
  try {
    const bookings = await Data.find({ V_TAT: req.params.minutes });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by VTAT', error: error.message });
  }
};

// 25. GET /bookings/ctat/:minutes - Fetch bookings by CTAT
exports.getBookingsByCtat = async (req, res) => {
  try {
    const bookings = await Data.find({ C_TAT: req.params.minutes });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by CTAT', error: error.message });
  }
};

// 26. GET /bookings/day/:day - Fetch bookings by day
exports.getBookingsByDay = async (req, res) => {
  try {
    // Note: Assuming date field holds the exact day, or requires aggregation/date math based on schema
    const bookings = await Data.find({ Day: req.params.day }); // Simple assumption
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by day', error: error.message });
  }
};

// 27. GET /bookings/month/:month - Fetch bookings by month
exports.getBookingsByMonth = async (req, res) => {
  try {
    const bookings = await Data.find({ Month: req.params.month });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by month', error: error.message });
  }
};

// 28. GET /bookings/year/:year - Fetch bookings by year
exports.getBookingsByYear = async (req, res) => {
  try {
    const bookings = await Data.find({ Year: req.params.year });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by year', error: error.message });
  }
};

// 29. GET /bookings/hour/:hour - Fetch bookings by hour
exports.getBookingsByHour = async (req, res) => {
  try {
    const bookings = await Data.find({ Hour: req.params.hour });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by hour', error: error.message });
  }
};

// 30. GET /bookings/minute/:minute - Fetch bookings by minute
exports.getBookingsByMinute = async (req, res) => {
  try {
    const bookings = await Data.find({ Minute: req.params.minute });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by minute', error: error.message });
  }
};

// 31. GET /bookings/source/:pickup - Fetch bookings by pickup source
exports.getBookingsBySource = async (req, res) => {
  try {
    const bookings = await Data.find({ Pickup_Location: req.params.pickup });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by source', error: error.message });
  }
};

// 32. GET /bookings/destination/:drop - Fetch bookings by destination
exports.getBookingsByDestination = async (req, res) => {
  try {
    const bookings = await Data.find({ Drop_Location: req.params.drop });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by destination', error: error.message });
  }
};

// 33. GET /bookings/vehicle-image/:imageName - Fetch vehicle image bookings
exports.getBookingsByVehicleImage = async (req, res) => {
  try {
    const bookings = await Data.find({ Vehicle_Image: req.params.imageName });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by vehicle image', error: error.message });
  }
};

// 34. GET /bookings/fare/:value - Fetch bookings by fare
exports.getBookingsByFare = async (req, res) => {
  try {
    const bookings = await Data.find({ Booking_Value: Number(req.params.value) });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching by fare', error: error.message });
  }
};

// 35. GET /bookings/customer/:customerId/history - Fetch customer booking history
exports.getCustomerBookingHistory = async (req, res) => {
  try {
    const bookings = await Data.find({ Customer_ID: req.params.customerId }).sort({ Date: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer history', error: error.message });
  }
};

// 36. GET /bookings/customer/:customerId/latest - Fetch latest customer booking
exports.getLatestCustomerBooking = async (req, res) => {
  try {
    const booking = await Data.findOne({ Customer_ID: req.params.customerId }).sort({ Date: -1, Time: -1 });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest customer booking', error: error.message });
  }
};
