const express = require('express');
const router = express.Router();
const advancedController = require('../controllers/advancedController');

// Advanced Bookings Routes
router.get('/bookings/top/highest-fare', advancedController.getHighestFareBookings);
router.get('/bookings/top/lowest-fare', advancedController.getLowestFareBookings);
router.get('/bookings/recent', advancedController.getRecentBookings);
router.get('/bookings/latest', advancedController.getRecentBookings);
router.get('/bookings/random', advancedController.getRandomBookings);
router.get('/bookings/trending', advancedController.getTrendingBookings);
router.get('/bookings/summary/ai', advancedController.getAiSummary);

// API Health and Version
router.get('/health', advancedController.getHealth);
router.get('/version', advancedController.getVersion);

// Compare Bookings
router.get('/compare', advancedController.compareBookings);

// HEAD and OPTIONS
router.head('/health', advancedController.getHealth);
router.options('/health', (req, res) => res.set('Allow', 'GET, HEAD, OPTIONS').status(204).send());
router.options('/bookings', (req, res) => res.set('Allow', 'GET, POST, OPTIONS, HEAD').status(204).send());

module.exports = router;
