const express = require('express');
const router = express.Router();
const { getFeedbacks, createFeedback, deleteFeedback } = require('../controllers/feedbackController');
const protect = require('../middleware/protect');
const upload = require('../middleware/upload');

// GET /api/feedback  (public)
router.get('/', getFeedbacks);

// POST /api/feedback  (public — optional image)
router.post('/', upload.single('image'), createFeedback);

// DELETE /api/feedback/:id  (admin)
router.delete('/:id', protect, deleteFeedback);

module.exports = router;
