const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// GET /api/about  (public)
router.get('/', getAbout);

// PUT /api/about  (admin — update content text and/or owner image)
router.put('/', protect, upload.single('image'), updateAbout);

module.exports = router;
