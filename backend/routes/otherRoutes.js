const express = require('express');
const router = express.Router();
const otherController = require('../controllers/otherController');

// GET - paginated top-level resources
router.get('/customers', otherController.getCustomers);
router.get('/vehicles', otherController.getVehicles);
router.get('/success-rides', otherController.getSuccessRides);
router.get('/cancelled-rides', otherController.getCancelledRides);
router.get('/incomplete-rides', otherController.getIncompleteRides);
router.get('/ratings', otherController.getRatings);
router.get('/payments', otherController.getPayments);

// POST - creation
router.post('/customers', otherController.createCustomer);
router.post('/drivers', otherController.createDriver);
router.post('/payments', otherController.createPayment);
router.post('/ratings', otherController.createRating);
router.post('/vehicles', otherController.createVehicle);
router.post('/locations', otherController.createLocation);

// POST - bulk insert (must be before /:id routes)
router.post('/customers/bulk-insert', otherController.bulkInsertCustomers);
router.post('/drivers/bulk-insert', otherController.bulkInsertDrivers);

// DELETE - delete-all variants (must be before /:id routes)
router.delete('/customers/delete-all', otherController.deleteAllCustomers);
router.delete('/cancelled-rides/delete-all', otherController.deleteAllCancelledRides);
router.delete('/logs/:id', otherController.deleteLog);

// PUT - full replace
router.put('/customers/:customerId', otherController.replaceCustomer);
router.put('/drivers/:driverId', otherController.replaceDriver);
router.put('/vehicles/:vehicleId', otherController.replaceVehicle);

// DELETE - individual resources
router.delete('/customers/:customerId', otherController.deleteCustomer);
router.delete('/drivers/:driverId', otherController.deleteDriver);
router.delete('/vehicles/:vehicleId', otherController.deleteVehicle);
router.delete('/payments/:paymentId', otherController.deletePayment);
router.delete('/ratings/:ratingId', otherController.deleteRating);

module.exports = router;
