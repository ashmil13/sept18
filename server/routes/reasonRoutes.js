const express = require('express');
const router = express.Router();
const reasonController = require('../controllers/reasonController');

router.get('/', reasonController.getReasons);

module.exports = router;
