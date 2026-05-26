const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const otherController = require('../controllers/otherController');

// 1. GET /bookings - Fetch all bookings
router.get('/', bookingController.getAllBookings);

// 3. POST /bookings - Create new booking
router.post('/', bookingController.createBooking);

// POST /bookings/bulk-insert - Bulk insert bookings
router.post('/bulk-insert', otherController.bulkInsertBookings);

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

// 21. GET /bookings/incomplete-reason/:reason - Fetch incomplete ride reasons
router.get('/incomplete-reason/:reason', bookingController.getBookingsByIncompleteReason);

// 22. GET /bookings/cancel/customer/:reason - Fetch customer cancellation reasons
router.get('/cancel/customer/:reason', bookingController.getBookingsByCustomerCancelReason);

// 23. GET /bookings/cancel/driver/:reason - Fetch driver cancellation reasons
router.get('/cancel/driver/:reason', bookingController.getBookingsByDriverCancelReason);

// 24. GET /bookings/vtat/:minutes - Fetch bookings by VTAT
router.get('/vtat/:minutes', bookingController.getBookingsByVtat);

// 25. GET /bookings/ctat/:minutes - Fetch bookings by CTAT
router.get('/ctat/:minutes', bookingController.getBookingsByCtat);

// 26. GET /bookings/day/:day - Fetch bookings by day
router.get('/day/:day', bookingController.getBookingsByDay);

// 27. GET /bookings/month/:month - Fetch bookings by month
router.get('/month/:month', bookingController.getBookingsByMonth);

// 28. GET /bookings/year/:year - Fetch bookings by year
router.get('/year/:year', bookingController.getBookingsByYear);

// 29. GET /bookings/hour/:hour - Fetch bookings by hour
router.get('/hour/:hour', bookingController.getBookingsByHour);

// 30. GET /bookings/minute/:minute - Fetch bookings by minute
router.get('/minute/:minute', bookingController.getBookingsByMinute);

// 31. GET /bookings/source/:pickup - Fetch bookings by pickup source
router.get('/source/:pickup', bookingController.getBookingsBySource);

// 32. GET /bookings/destination/:drop - Fetch bookings by destination
router.get('/destination/:drop', bookingController.getBookingsByDestination);

// 33. GET /bookings/vehicle-image/:imageName - Fetch vehicle image bookings
router.get('/vehicle-image/:imageName', bookingController.getBookingsByVehicleImage);

// 34. GET /bookings/fare/:value - Fetch bookings by fare
router.get('/fare/:value', bookingController.getBookingsByFare);

// 35. GET /bookings/customer/:customerId/history - Fetch customer booking history
router.get('/customer/:customerId/history', bookingController.getCustomerBookingHistory);

// 36. GET /bookings/customer/:customerId/latest - Fetch latest customer booking
router.get('/customer/:customerId/latest', bookingController.getLatestCustomerBooking);

// Parameter paths (must be after static ones like /status/:status)

// 2. GET /bookings/:bookingId - Fetch booking by ID (MongoDB _id)
router.get('/:bookingId', bookingController.getBookingById);

// 4. PUT /bookings/:bookingId - Replace booking details
router.put('/:bookingId', bookingController.updateBooking);

// 5. PATCH /bookings/:bookingId/status - Update booking status
router.patch('/:bookingId/status', bookingController.updateBookingStatus);

// PATCH /bookings/:bookingId/payment - Update booking payment
router.patch('/:bookingId/payment', bookingController.updateBookingPayment);

// PATCH /bookings/:bookingId/rating - Update booking rating
router.patch('/:bookingId/rating', bookingController.updateBookingRating);

// PATCH /bookings/:bookingId/fare - Update booking fare
router.patch('/:bookingId/fare', bookingController.updateBookingFare);

// PATCH /bookings/:bookingId/distance - Update ride distance
router.patch('/:bookingId/distance', bookingController.updateBookingDistance);

// PATCH /bookings/:bookingId/location - Update ride location
router.patch('/:bookingId/location', bookingController.updateBookingLocation);

// DELETE /bookings/delete-all - Delete all bookings
router.delete('/delete-all', bookingController.deleteAllBookings);

// 6. DELETE /bookings/:bookingId - Delete booking
router.delete('/:bookingId', bookingController.deleteBooking);

module.exports = router;
