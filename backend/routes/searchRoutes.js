const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Define search routes
router.get('/', searchController.searchAll);
router.get('/bookings', searchController.searchBookings);
router.get('/customers', searchController.searchCustomers);
router.get('/payment', searchController.searchPayment);
router.get('/vehicle', searchController.searchVehicle);
router.get('/location', searchController.searchLocation);
router.get('/cancel-reason', searchController.searchCancelReason);
router.get('/incomplete', searchController.searchIncompleteReason);
router.get('/rating', searchController.searchRating);

module.exports = router;
