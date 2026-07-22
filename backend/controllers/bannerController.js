const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(banners);
});

// @desc    Get all banners (Admin)
// @route   GET /api/banners/admin
// @access  Admin
const getAdminBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({}).sort({ createdAt: -1 });
  res.json(banners);
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Admin
const createBanner = asyncHandler(async (req, res) => {
  const { title1, title2, image, isActive } = req.body;
  const banner = new Banner({ title1, title2, image, isActive });
  const createdBanner = await banner.save();
  res.status(201).json(createdBanner);
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Admin
const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    banner.title1 = req.body.title1 || banner.title1;
    banner.title2 = req.body.title2 || banner.title2;
    banner.image = req.body.image || banner.image;
    banner.isActive = req.body.isActive !== undefined ? req.body.isActive : banner.isActive;
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (banner) {
    await banner.deleteOne();
    res.json({ message: 'Banner removed' });
  } else {
    res.status(404);
    throw new Error('Banner not found');
  }
});

module.exports = { getBanners, getAdminBanners, createBanner, updateBanner, deleteBanner };
