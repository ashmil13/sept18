const mongoose = require('mongoose');

const ReasonSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  icon: String
});

module.exports = mongoose.model('Reason', ReasonSchema);
