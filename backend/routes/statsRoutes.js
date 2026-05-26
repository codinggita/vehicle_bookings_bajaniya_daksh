const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Statistics routes
router.get('/total-bookings', statsController.getTotalBookings);
router.get('/success-rides', statsController.getSuccessRidesCount);
router.get('/cancelled-rides', statsController.getCancelledRidesCount);
router.get('/incomplete-rides', statsController.getIncompleteRidesCount);
router.get('/driver-not-found', statsController.getDriverNotFoundCount);
router.get('/total-customers', statsController.getTotalCustomers);
router.get('/top-vehicle', statsController.getTopVehicle);
router.get('/top-payment-method', statsController.getTopPaymentMethod);
router.get('/highest-fare', statsController.getHighestFare);
router.get('/lowest-fare', statsController.getLowestFare);

// HEAD routes (return only headers, no body)
router.head('/total-bookings', statsController.getTotalBookings);

module.exports = router;
