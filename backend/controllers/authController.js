const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'vehicle_booking_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'vehicle_booking_refresh_secret';

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    // Normalize role to Title Case; default to 'User'
    const normalizedRole = role === 'Admin' ? 'Admin' : 'User';

    const newUser = await User.create({ name, email, password, role: normalizedRole });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    // select: false on password — must explicitly include it
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in', error: error.message });
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }
    const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
    // In production, send email with reset link. Returning here for dev/testing.
    res.status(200).json({ success: true, message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing forgot password', error: error.message });
  }
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'token and newPassword are required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.password = newPassword; // pre-save hook will hash it
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired reset token', error: error.message });
  }
};

// POST /auth/refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'refreshToken is required' });
    }
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({ success: true, token: newToken });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token', error: error.message });
  }
};

// GET /auth/me  (uses verifyToken middleware from authRoutes)
exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token', error: error.message });
  }
};

// DELETE /auth/account
exports.deleteAccount = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const deleted = await User.findByIdAndDelete(decoded.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token', error: error.message });
  }
};

// PUT /auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = name;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating profile', error: error.message });
  }
};

// PUT /auth/password
exports.updatePassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    const user = await User.findById(decoded.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating password', error: error.message });
  }
};
