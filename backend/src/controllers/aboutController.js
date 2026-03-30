const About = require('../models/About');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// Helper: get or create the singleton
const getAboutDoc = async () => {
  let about = await About.findOne();
  if (!about) about = await About.create({});
  return about;
};

// GET /api/about
const getAbout = async (req, res) => {
  try {
    const about = await getAboutDoc();
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/about  [admin]
// Can update content text and/or owner image
const updateAbout = async (req, res) => {
  try {
    const about = await getAboutDoc();
    const { content } = req.body;

    if (content !== undefined) about.content = content;

    if (req.file) {
      if (about.ownerImagePublicId) {
        await deleteFromCloudinary(about.ownerImagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'about');
      about.ownerImageUrl = result.url;
      about.ownerImagePublicId = result.publicId;
    }

    await about.save();
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAbout, updateAbout };
