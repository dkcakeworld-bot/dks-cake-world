const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
