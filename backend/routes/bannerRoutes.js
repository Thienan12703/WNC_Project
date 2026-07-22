const express = require('express');
const router = express.Router();
const { getBanners, getAdminBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBanners).post(protect, admin, createBanner);
router.route('/admin').get(protect, admin, getAdminBanners);
router.route('/:id').put(protect, admin, updateBanner).delete(protect, admin, deleteBanner);

module.exports = router;
