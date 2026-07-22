const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, updateCoupon, deleteCoupon, applyCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/:id').put(protect, admin, updateCoupon).delete(protect, admin, deleteCoupon);
router.route('/apply/:code').get(protect, applyCoupon);

module.exports = router;
