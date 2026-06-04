const express = require('express');
const router = express.Router();
const giftLetterController = require('../controllers/giftLetterController');

router.get('/', giftLetterController.getGiftLetters);
router.post('/', giftLetterController.createGiftLetter);

module.exports = router;
