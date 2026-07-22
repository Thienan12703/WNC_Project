const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title1: { type: String, required: true },
  title2: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
