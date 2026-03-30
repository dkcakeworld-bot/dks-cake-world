const mongoose = require('mongoose');

const carouselSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required'],
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Carousel', carouselSchema);
