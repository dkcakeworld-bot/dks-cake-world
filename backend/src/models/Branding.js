const mongoose = require('mongoose');

// Singleton — only one document ever exists
const brandingSchema = new mongoose.Schema(
  {
    logoUrl: { type: String, default: '' },
    logoPublicId: { type: String, default: '' },
    menuCardUrl: { type: String, default: '' },
    menuCardPublicId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Branding', brandingSchema);
