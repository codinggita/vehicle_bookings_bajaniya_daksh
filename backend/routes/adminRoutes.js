const express = require('express');
const router = express.Router();
const otherController = require('../controllers/otherController');

// Define admin routes
router.get('/bookings', otherController.getAdminBookings);

module.exports = router;
