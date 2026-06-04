const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');

router.get('/', photoController.getPhotos);
router.post('/upload', photoController.uploadPhoto);

module.exports = router;
