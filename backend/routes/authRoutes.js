const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Authentication routes (lines 191-198 from routes.txt)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);
router.get('/me', authController.getMe);
router.delete('/account', authController.deleteAccount);
router.put('/profile', authController.updateProfile);
router.put('/password', authController.updatePassword);

// HEAD / OPTIONS support
router.head('/me', authController.getMe);
router.options('/login', (req, res) => {
  res.set('Allow', 'POST, OPTIONS').status(204).send();
});

module.exports = router;
