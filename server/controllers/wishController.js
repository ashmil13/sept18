const Wish = require('../models/Wish');
const localDb = require('../utils/localDb');
const db = require('../config/db');

// GET /api/wishes
exports.getWishes = async (req, res) => {
  if (db.isConnected()) {
    try {
      const items = await Wish.find().sort({ createdAt: -1 });
      return res.json(items);
    } catch (err) {
      console.error('Error fetching wishes from Mongo:', err);
    }
  }
  // Fallback to local file database (sorted descending by creation date)
  const wishes = localDb.read('wishes');
  wishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(wishes);
};

// POST /api/wishes
exports.createWish = async (req, res) => {
  const { name, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  if (db.isConnected()) {
    try {
      const newWish = new Wish({ name, message });
      await newWish.save();
      return res.status(201).json(newWish);
    } catch (err) {
      console.error('Error saving wish to Mongo:', err);
    }
  }

  // Fallback to local file database
  const wishes = localDb.read('wishes');
  const newWish = {
    id: Date.now().toString(),
    name,
    message,
    createdAt: new Date().toISOString()
  };
  wishes.unshift(newWish);
  localDb.write('wishes', wishes);
  res.status(201).json(newWish);
};
