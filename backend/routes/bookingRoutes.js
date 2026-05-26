const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// 1. GET /bookings - Fetch all bookings
router.get('/', bookingController.getAllBookings);

// 3. POST /bookings - Create new booking
router.post('/', bookingController.createBooking);

// Note: specific static prefix paths should be defined before parameter paths to avoid route collision

// 7. GET /bookings/id/:bookingId - Fetch booking by Booking_ID
router.get('/id/:bookingId', bookingController.getBookingByBookingId);

// 8. GET /bookings/status/:status - Fetch bookings by status
router.get('/status/:status', bookingController.getBookingsByStatus);

// 9. GET /bookings/customer/:customerId - Fetch bookings by customer
router.get('/customer/:customerId', bookingController.getBookingsByCustomer);

// 10. GET /bookings/vehicle/:vehicleType - Fetch bookings by vehicle type
router.get('/vehicle/:vehicleType', bookingController.getBookingsByVehicle);

// 11. GET /bookings/payment/:method - Fetch bookings by payment method
router.get('/payment/:method', bookingController.getBookingsByPayment);

// 12. GET /bookings/pickup/:location - Fetch bookings by pickup location
router.get('/pickup/:location', bookingController.getBookingsByPickup);

// 13. GET /bookings/drop/:location - Fetch bookings by drop location
router.get('/drop/:location', bookingController.getBookingsByDrop);

// 14. GET /bookings/date/:date - Fetch bookings by date
router.get('/date/:date', bookingController.getBookingsByDate);

// 15. GET /bookings/time/:time - Fetch bookings by time
router.get('/time/:time', bookingController.getBookingsByTime);

// 16. GET /bookings/rating/driver/:rating - Fetch bookings by driver rating
router.get('/rating/driver/:rating', bookingController.getBookingsByDriverRating);

// 17. GET /bookings/rating/customer/:rating - Fetch bookings by customer rating
router.get('/rating/customer/:rating', bookingController.getBookingsByCustomerRating);

// 18. GET /bookings/distance/:distance - Fetch bookings by ride distance
router.get('/distance/:distance', bookingController.getBookingsByDistance);

// 19. GET /bookings/value/:amount - Fetch bookings by fare value
router.get('/value/:amount', bookingController.getBookingsByValue);

// 20. GET /bookings/incomplete/:status - Fetch incomplete bookings
router.get('/incomplete/:status', bookingController.getIncompleteBookings);

// Parameter paths (must be after static ones like /status/:status)

// 2. GET /bookings/:bookingId - Fetch booking by ID (MongoDB _id)
router.get('/:bookingId', bookingController.getBookingById);

// 4. PUT /bookings/:bookingId - Replace booking details
router.put('/:bookingId', bookingController.updateBooking);

// 5. PATCH /bookings/:bookingId/status - Update booking status
router.patch('/:bookingId/status', bookingController.updateBookingStatus);

// 6. DELETE /bookings/:bookingId - Delete booking
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;
