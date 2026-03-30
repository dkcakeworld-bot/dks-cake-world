const express = require('express');
const router = express.Router();
const {
  getCarousel,
  addCarouselSlide,
  updateCarouselSlide,
  deleteCarouselSlide,
} = require('../controllers/carouselController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// GET /api/carousel  (public)
router.get('/', getCarousel);

// POST /api/carousel  (admin)
router.post('/', protect, upload.single('image'), addCarouselSlide);

// PUT /api/carousel/:id  (admin)
router.put('/:id', protect, upload.single('image'), updateCarouselSlide);

// DELETE /api/carousel/:id  (admin)
router.delete('/:id', protect, deleteCarouselSlide);

module.exports = router;
