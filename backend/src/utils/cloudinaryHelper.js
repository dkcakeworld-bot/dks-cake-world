const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} buffer - The file buffer from multer memoryStorage
 * @param {string} folder - The Cloudinary folder name (e.g. 'products', 'gallery')
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = 'general') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `dkcakeworld/${folder}`,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Deletes an image from Cloudinary by its public ID.
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
