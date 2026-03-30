const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Set httpOnly cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Logged in successfully.',
      token, // also send in body for non-cookie clients
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('adminToken');
  res.json({ message: 'Logged out successfully.' });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-passwordHash');
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, logout, getMe };
