const express = require('express');
const router = express.Router();
const otherController = require('../controllers/otherController');

// Define the paginated top-level routes
router.get('/customers', otherController.getCustomers);
router.get('/vehicles', otherController.getVehicles);
router.get('/success-rides', otherController.getSuccessRides);
router.get('/cancelled-rides', otherController.getCancelledRides);
router.get('/incomplete-rides', otherController.getIncompleteRides);
router.get('/ratings', otherController.getRatings);
router.get('/payments', otherController.getPayments);

module.exports = router;
