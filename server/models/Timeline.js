const mongoose = require('mongoose');

const TimelineSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
  icon: String,
  photoIndex: Number
});

module.exports = mongoose.model('Timeline', TimelineSchema);
