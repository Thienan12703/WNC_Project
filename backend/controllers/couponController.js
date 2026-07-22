const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Admin
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expiryDate, isActive } = req.body;
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) {
    res.status(400);
    throw new Error('Coupon code already exists');
  }
  const coupon = new Coupon({ code, discountPercentage, expiryDate, isActive });
  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    coupon.code = req.body.code || coupon.code;
    coupon.discountPercentage = req.body.discountPercentage || coupon.discountPercentage;
    coupon.expiryDate = req.body.expiryDate || coupon.expiryDate;
    coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Apply a coupon
// @route   GET /api/coupons/apply/:code
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code });
  if (!coupon) {
    res.status(404);
    throw new Error('Mã giảm giá không tồn tại');
  }
  if (!coupon.isActive) {
    res.status(400);
    throw new Error('Mã giảm giá đã bị vô hiệu hóa');
  }
  if (new Date(coupon.expiryDate) < new Date()) {
    res.status(400);
    throw new Error('Mã giảm giá đã hết hạn');
  }
  res.json({ discountPercentage: coupon.discountPercentage });
});

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon, applyCoupon };
