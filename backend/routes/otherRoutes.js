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

// POST routes for creation
router.post('/customers', otherController.createCustomer);
router.post('/drivers', otherController.createDriver);
router.post('/payments', otherController.createPayment);
router.post('/ratings', otherController.createRating);
router.post('/vehicles', otherController.createVehicle);
router.post('/locations', otherController.createLocation);

// POST routes for bulk-insert
router.post('/customers/bulk-insert', otherController.bulkInsertCustomers);
router.post('/drivers/bulk-insert', otherController.bulkInsertDrivers);

module.exports = router;
