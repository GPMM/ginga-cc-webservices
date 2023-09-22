const remotedeviceService = require('../service/remotedevice');

exports.POSTRemoteDevice = (req, res, next) => {
    const body = req.body;
    if (!body) {
        res.status(400).json(Errors.getError(106));
    }
    response = remotedeviceService.createWebSocket(body);
    res.status(200).json(response);
};

exports.DELETERemoteDevice = (req, res, next) => {
    const handle = req.params.handle;
    if (!handle) {
        res.status(400).json(Errors.getError(105));
    }
    remotedeviceService.deleteWebSocket(handle);
    res.status(204).json();
};