const Reason = require('../models/Reason');
const localDb = require('../utils/localDb');
const db = require('../config/db');

// GET /api/reasons
exports.getReasons = async (req, res) => {
  if (db.isConnected()) {
    try {
      const items = await Reason.find().sort({ id: 1 });
      if (items.length > 0) return res.json(items);
      
      // Seed default if empty in MongoDB
      const defaults = localDb.getDefaultData('reasons');
      await Reason.insertMany(defaults);
      return res.json(defaults);
    } catch (err) {
      console.error('Error fetching reasons from Mongo:', err);
    }
  }
  // Fallback to local file database
  res.json(localDb.read('reasons'));
};
