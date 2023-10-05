var express = require('express');
var appFilesController = require('../controllers/appfiles');
var router = express.Router();

/* Application Files API */
/* 8.3.9 */
router.get('/:appid/files', appFilesController.GETAppFile);

module.exports = router;