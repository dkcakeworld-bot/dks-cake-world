const Feedback = require('../models/Feedback');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// GET /api/feedback
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('categoryId', 'name slug')
      .populate('productId', 'name')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/feedback  [public]
const createFeedback = async (req, res) => {
  try {
    const { customerName, categoryId, productId, feedbackText } = req.body;

    if (!customerName || !categoryId || !productId || !feedbackText) {
      return res.status(400).json({
        error: 'customerName, categoryId, productId, and feedbackText are required.',
      });
    }

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'feedback');
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const feedback = await Feedback.create({
      customerName,
      categoryId,
      productId,
      imageUrl,
      imagePublicId,
      feedbackText,
    });

    const populated = await feedback.populate([
      { path: 'categoryId', select: 'name slug' },
      { path: 'productId', select: 'name' },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/feedback/:id  [admin]
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Feedback not found.' });

    if (feedback.imagePublicId) {
      await deleteFromCloudinary(feedback.imagePublicId);
    }

    await feedback.deleteOne();
    res.json({ message: 'Feedback deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFeedbacks, createFeedback, deleteFeedback };
