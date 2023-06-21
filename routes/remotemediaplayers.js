var express = require('express');
var RemoteMediaPlayersController = require('../controllers/remotemediaplayers');
var router = express.Router();

/* Remode media player API */
/* 8.3.9 */
router.get('/:carouselid', RemoteMediaPlayersController.GETRemoteMediaPlayer);

module.exports = router;