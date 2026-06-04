const express = require('express');
const router = express.Router();
const wishController = require('../controllers/wishController');

router.get('/', wishController.getWishes);
router.post('/', wishController.createWish);

module.exports = router;
