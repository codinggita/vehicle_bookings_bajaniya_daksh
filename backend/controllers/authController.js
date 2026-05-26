const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user store for demonstration (replace with DB model in production)
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'vehicle_booking_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'vehicle_booking_refresh_secret';

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), username, email, password: hashedPassword, role: role || 'user' };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, username, email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'Login successful', token, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// POST /auth/logout
exports.logout = (req, res) => {
  // Stateless JWT — client should discard token
  res.status(200).json({ message: 'Logged out successfully' });
};

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }
    const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
    // In production, send email with reset link. Here we return it for testing.
    res.status(200).json({ message: 'Password reset token generated', resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Error processing forgot password', error: error.message });
  }
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'token and newPassword are required' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired reset token', error: error.message });
  }
};

// POST /auth/refresh-token
exports.refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken is required' });
    }
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired refresh token', error: error.message });
  }
};

// GET /auth/me
exports.getMe = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ id: user.id, username: user.username, email: user.email, role: user.role });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

// DELETE /auth/account
exports.deleteAccount = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const index = users.findIndex(u => u.id === decoded.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });
    users.splice(index, 1);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};
