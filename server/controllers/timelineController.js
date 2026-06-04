const Timeline = require('../models/Timeline');
const localDb = require('../utils/localDb');
const db = require('../config/db');

// GET /api/timeline
exports.getTimeline = async (req, res) => {
  if (db.isConnected()) {
    try {
      const items = await Timeline.find();
      if (items.length > 0) return res.json(items);
      
      // Seed default if empty in MongoDB
      const defaults = localDb.getDefaultData('timeline');
      await Timeline.insertMany(defaults);
      return res.json(defaults);
    } catch (err) {
      console.error('Error fetching timeline from Mongo:', err);
    }
  }
  // Fallback to local file database
  res.json(localDb.read('timeline'));
};

// POST /api/timeline
exports.createTimeline = async (req, res) => {
  const { title, date, description, icon, photoIndex } = req.body;
  
  if (db.isConnected()) {
    try {
      const newItem = new Timeline({ title, date, description, icon, photoIndex });
      await newItem.save();
      return res.status(201).json(newItem);
    } catch (err) {
      console.error('Error saving timeline item to Mongo:', err);
    }
  }

  // Fallback to local file database
  const timeline = localDb.read('timeline');
  const newItem = { id: Date.now().toString(), title, date, description, icon, photoIndex };
  timeline.push(newItem);
  localDb.write('timeline', timeline);
  res.status(201).json(newItem);
};
