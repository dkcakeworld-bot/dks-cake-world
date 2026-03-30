const Branding = require('../models/Branding');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryHelper');

// Helper: get or create the singleton
const getBrandingDoc = async () => {
  let branding = await Branding.findOne();
  if (!branding) branding = await Branding.create({});
  return branding;
};

// GET /api/branding
const getBranding = async (req, res) => {
  try {
    const branding = await getBrandingDoc();
    res.json(branding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/branding/logo  [admin]
const updateLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Logo image is required.' });

    const branding = await getBrandingDoc();

    if (branding.logoPublicId) await deleteFromCloudinary(branding.logoPublicId);

    const result = await uploadToCloudinary(req.file.buffer, 'branding');
    branding.logoUrl = result.url;
    branding.logoPublicId = result.publicId;
    await branding.save();

    res.json(branding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/branding/menucard  [admin]
const updateMenuCard = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Menu card image is required.' });

    const branding = await getBrandingDoc();

    if (branding.menuCardPublicId) await deleteFromCloudinary(branding.menuCardPublicId);

    const result = await uploadToCloudinary(req.file.buffer, 'branding');
    branding.menuCardUrl = result.url;
    branding.menuCardPublicId = result.publicId;
    await branding.save();

    res.json(branding);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBranding, updateLogo, updateMenuCard };
