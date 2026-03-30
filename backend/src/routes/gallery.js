const express = require('express');
const router = express.Router();
const { getGallery, addGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// GET /api/gallery  (public)
router.get('/', getGallery);

// POST /api/gallery  (admin)
router.post('/', protect, upload.single('image'), addGalleryImage);

// DELETE /api/gallery/:id  (admin)
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
