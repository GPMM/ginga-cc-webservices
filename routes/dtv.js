var express = require('express');
var dtvController = require('../controllers/dtv');
var router = express.Router();

/* User API */
router.get('/authorize', dtvController.GETAuthorize);
router.get('/token', dtvController.GETToken);
router.get('/current-service', dtvController.GETCurrentService);

module.exports = router;