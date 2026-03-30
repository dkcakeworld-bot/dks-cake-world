const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/protect');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

module.exports = router;
