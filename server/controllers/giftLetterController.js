const GiftLetter = require('../models/GiftLetter');
const localDb = require('../utils/localDb');
const db = require('../config/db');

// GET /api/giftletters
exports.getGiftLetters = async (req, res) => {
  if (db.isConnected()) {
    try {
      const items = await GiftLetter.find();
      if (items.length > 0) return res.json(items);
      
      // Seed default if empty in MongoDB
      const defaults = localDb.getDefaultData('giftletters');
      await GiftLetter.insertMany(defaults);
      return res.json(defaults);
    } catch (err) {
      console.error('Error fetching giftletters from Mongo:', err);
    }
  }
  // Fallback to local file database
  res.json(localDb.read('giftletters'));
};

// POST /api/giftletters
exports.createGiftLetter = async (req, res) => {
  const { title, photoIndex, excerpt, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  if (db.isConnected()) {
    try {
      const newItem = new GiftLetter({ 
        title, 
        photoIndex: Number(photoIndex) || 0, 
        excerpt: excerpt || '', 
        content 
      });
      await newItem.save();
      return res.status(201).json(newItem);
    } catch (err) {
      console.error('Error saving giftletter to Mongo:', err);
    }
  }

  // Fallback to local file database
  const letters = localDb.read('giftletters');
  const newItem = { 
    id: Date.now(), 
    title, 
    photoIndex: Number(photoIndex) || 0, 
    excerpt: excerpt || '', 
    content 
  };
  letters.push(newItem);
  localDb.write('giftletters', letters);
  res.status(201).json(newItem);
};
