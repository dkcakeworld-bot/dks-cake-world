// Centralized config re-exports
const connectDB = require('./db');
const { cloudinary, connectCloudinary } = require('./cloudinary');

module.exports = {
  connectDB,
  cloudinary,
  connectCloudinary,
};
