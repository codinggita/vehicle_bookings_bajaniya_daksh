const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const otherController = require('../controllers/otherController');
const bookingController = require('../controllers/bookingController');
const Data = require('../models/Data');

// GET /admin/bookings - Paginated admin bookings (already in adminRoutes, adding auth guard)
router.get('/bookings', verifyToken, requireAdmin, otherController.getAdminBookings);

// POST /admin/bookings - Admin create booking
router.post('/bookings', verifyToken, requireAdmin, bookingController.createBooking);

// DELETE /admin/bookings/:bookingId - Admin delete booking
router.delete('/bookings/:bookingId', verifyToken, requireAdmin, bookingController.deleteBooking);

// PATCH /admin/bookings/:bookingId - Admin update booking
router.patch('/bookings/:bookingId', verifyToken, requireAdmin, async (req, res) => {
  try {
    const updated = await Data.findByIdAndUpdate(req.params.bookingId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});

// GET /admin/dashboard - Admin dashboard
router.get('/dashboard', verifyToken, requireAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin dashboard', admin: req.user });
});

// OPTIONS /admin/bookings
router.options('/bookings', (req, res) => {
  res.set('Allow', 'GET, POST, DELETE, PATCH, OPTIONS').status(204).send();
});

module.exports = router;
