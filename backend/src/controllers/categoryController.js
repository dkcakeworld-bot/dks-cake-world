const Category = require('../models/Category');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/categories  [admin]
const createCategory = async (req, res) => {
  try {
    const { name, slug, order } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
    }

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'categories');
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const category = await Category.create({
      name,
      slug,
      imageUrl,
      imagePublicId,
      order: order || 0,
    });

    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A category with this slug already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/categories/:id  [admin]
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });

    const { name, slug, order } = req.body;

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (order !== undefined) category.order = order;

    if (req.file) {
      // Delete old image if exists
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'categories');
      category.imageUrl = result.url;
      category.imagePublicId = result.publicId;
    }

    await category.save();
    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'A category with this slug already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/categories/:id  [admin]
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found.' });

    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
