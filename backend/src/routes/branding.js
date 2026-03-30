const express = require('express');
const router = express.Router();
const { getBranding, updateLogo, updateMenuCard } = require('../controllers/brandingController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// GET /api/branding  (public)
router.get('/', getBranding);

// PUT /api/branding/logo  (admin)
router.put('/logo', protect, upload.single('image'), updateLogo);

// PUT /api/branding/menucard  (admin)
router.put('/menucard', protect, upload.single('image'), updateMenuCard);

module.exports = router;
