const mongoose = require('mongoose');

const GiftLetterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  photoIndex: { type: Number, default: 0 },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true }
});

module.exports = mongoose.model('GiftLetter', GiftLetterSchema);
