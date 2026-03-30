const Carousel = require('../models/Carousel');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// GET /api/carousel  (sorted by order)
const getCarousel = async (req, res) => {
  try {
    const slides = await Carousel.find().sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/carousel  [admin]
const addCarouselSlide = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    const { caption, order } = req.body;
    const result = await uploadToCloudinary(req.file.buffer, 'carousel');

    const slide = await Carousel.create({
      imageUrl: result.url,
      imagePublicId: result.publicId,
      caption: caption || '',
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/carousel/:id  [admin]
const updateCarouselSlide = async (req, res) => {
  try {
    const slide = await Carousel.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide not found.' });

    const { caption, order } = req.body;
    if (caption !== undefined) slide.caption = caption;
    if (order !== undefined) slide.order = Number(order);

    if (req.file) {
      if (slide.imagePublicId) await deleteFromCloudinary(slide.imagePublicId);
      const result = await uploadToCloudinary(req.file.buffer, 'carousel');
      slide.imageUrl = result.url;
      slide.imagePublicId = result.publicId;
    }

    await slide.save();
    res.json(slide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/carousel/:id  [admin]
const deleteCarouselSlide = async (req, res) => {
  try {
    const slide = await Carousel.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide not found.' });

    await deleteFromCloudinary(slide.imagePublicId);
    await slide.deleteOne();

    res.json({ message: 'Carousel slide deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCarousel, addCarouselSlide, updateCarouselSlide, deleteCarouselSlide };
