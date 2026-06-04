const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');

router.get('/', timelineController.getTimeline);
router.post('/', timelineController.createTimeline);

module.exports = router;
