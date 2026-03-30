const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    prices: {
      halfKg: {
        type: Number,
        required: [true, 'Half KG price is required'],
        min: 0,
      },
      oneKg: {
        type: Number,
        required: [true, 'One KG price is required'],
        min: 0,
      },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
