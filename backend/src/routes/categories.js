const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// GET /api/categories  (public)
router.get('/', getCategories);

// POST /api/categories  (admin)
router.post('/', protect, upload.single('image'), createCategory);

// PUT /api/categories/:id  (admin)
router.put('/:id', protect, upload.single('image'), updateCategory);

// DELETE /api/categories/:id  (admin)
router.delete('/:id', protect, deleteCategory);

module.exports = router;
