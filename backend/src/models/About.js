const mongoose = require('mongoose');

// Singleton — only one document ever exists
const aboutSchema = new mongoose.Schema(
  {
    ownerImageUrl: { type: String, default: '' },
    ownerImagePublicId: { type: String, default: '' },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('About', aboutSchema);
