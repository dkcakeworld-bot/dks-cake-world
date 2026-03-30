const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    feedbackText: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
