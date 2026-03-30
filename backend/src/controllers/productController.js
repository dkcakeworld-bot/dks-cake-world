const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/category/:slug
const getProductsByCategory = async (req, res) => {
  try {
    const Category = require('../models/Category');
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: 'Category not found.' });

    const filter = { category: category._id };
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ name: 1 });

    res.json({ category, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products  [admin]
const createProduct = async (req, res) => {
  try {
    const { name, category, halfKg, oneKg, description, isVeg } = req.body;

    if (!name || !category || !halfKg || !oneKg) {
      return res.status(400).json({ error: 'Name, category, and both prices are required.' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'products');
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const product = await Product.create({
      name,
      category,
      prices: { halfKg: Number(halfKg), oneKg: Number(oneKg) },
      imageUrl,
      imagePublicId,
      description: description || '',
      isVeg: isVeg === 'false' || isVeg === false ? false : true,
    });

    const populated = await product.populate('category', 'name slug');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/products/:id  [admin]
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const { name, category, halfKg, oneKg, description, isVeg } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (halfKg !== undefined) product.prices.halfKg = Number(halfKg);
    if (oneKg !== undefined) product.prices.oneKg = Number(oneKg);
    if (description !== undefined) product.description = description;
    if (isVeg !== undefined) product.isVeg = isVeg === 'false' || isVeg === false ? false : true;

    if (req.file) {
      if (product.imagePublicId) {
        await deleteFromCloudinary(product.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'products');
      product.imageUrl = result.url;
      product.imagePublicId = result.publicId;
    }

    await product.save();
    const populated = await product.populate('category', 'name slug');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/products/:id  [admin]
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (product.imagePublicId) {
      await deleteFromCloudinary(product.imagePublicId);
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
};
