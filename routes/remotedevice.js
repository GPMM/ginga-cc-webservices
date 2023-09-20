var express = require('express');
var RemoteDeviceController = require('../controllers/remotedevice');
var router = express.Router();

/* Remode media player API */
/* 8.3.9 */
router.post('/', RemoteDeviceController.POSTRemoteDevice);
router.delete('/:handle', RemoteDeviceController.DELETERemoteDevice);

module.exports = router;