const express = require('express');
const router = express.Router();

const wishRoutes = require('./wishRoutes');
const timelineRoutes = require('./timelineRoutes');
const reasonRoutes = require('./reasonRoutes');
const giftLetterRoutes = require('./giftLetterRoutes');
const photoRoutes = require('./photoRoutes');

router.use('/wishes', wishRoutes);
router.use('/timeline', timelineRoutes);
router.use('/reasons', reasonRoutes);
router.use('/giftletters', giftLetterRoutes);
router.use('/photos', photoRoutes);

module.exports = router;
