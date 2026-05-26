const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'vehicle_booking_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'vehicle_booking_refresh_secret';

// POST /jwt/generate-token - Generate a JWT token
router.post('/generate-token', (req, res) => {
  try {
    const { userId, email, role } = req.body;
    if (!userId || !email) {
      return res.status(400).json({ message: 'userId and email are required' });
    }
    const token = jwt.sign({ id: userId, email, role: role || 'user' }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, refreshToken, expiresIn: '1h' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
});

// POST /jwt/verify-token - Verify a JWT token
router.post('/verify-token', (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'token is required' });
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

// POST /jwt/refresh-token - Refresh JWT using refresh token
router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken is required' });
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: newToken, expiresIn: '1h' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// GET /jwt/profile - Access JWT protected profile
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ message: 'JWT profile access granted', user: req.user });
});

// GET /jwt/dashboard - Access JWT protected dashboard
router.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({ message: 'JWT dashboard access granted', user: req.user });
});

// GET /jwt/admin - Access admin protected route
router.get('/admin', verifyToken, requireAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin JWT access granted', user: req.user });
});

// GET /jwt/user - Access user protected route
router.get('/user', verifyToken, (req, res) => {
  res.status(200).json({ message: 'User JWT access granted', user: req.user });
});

// DELETE /jwt/logout - Logout JWT session (client-side — invalidate token)
router.delete('/logout', verifyToken, (req, res) => {
  res.status(200).json({ message: 'JWT session logged out. Please discard your token on the client side.' });
});

// OPTIONS /jwt/profile
router.options('/profile', (req, res) => {
  res.set('Allow', 'GET, OPTIONS').status(204).send();
});

module.exports = router;
