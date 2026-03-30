const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// IMPORTANT: specific routes must come before param routes

// GET /api/products/category/:slug  (public)
router.get('/category/:slug', getProductsByCategory);

// GET /api/products  (public)
router.get('/', getProducts);

// GET /api/products/:id  (public)
router.get('/:id', getProductById);

// POST /api/products  (admin)
router.post('/', protect, upload.single('image'), createProduct);

// PUT /api/products/:id  (admin)
router.put('/:id', protect, upload.single('image'), updateProduct);

// DELETE /api/products/:id  (admin)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
