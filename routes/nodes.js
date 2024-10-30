var express = require('express');
var nodesAPIController = require('../controllers/nodes');
var router = express.Router();

/* API for controlling a node of a running TV 3.0 Ginga-NCL */
/* C.6.4.9 */
router.post('/:appid/nodes/:nodeid', nodesAPIController.POSTNodes);

module.exports = router;