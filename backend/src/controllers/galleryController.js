const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// GET /api/gallery
const getGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/gallery  [admin]
const addGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    const { description } = req.body;
    const result = await uploadToCloudinary(req.file.buffer, 'gallery');

    const item = await Gallery.create({
      imageUrl: result.url,
      imagePublicId: result.publicId,
      description: description || '',
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/gallery/:id  [admin]
const deleteGalleryImage = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Gallery image not found.' });

    await deleteFromCloudinary(item.imagePublicId);
    await item.deleteOne();

    res.json({ message: 'Gallery image deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGallery, addGalleryImage, deleteGalleryImage };
