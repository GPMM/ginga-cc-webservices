//var Errors = require("../models/errors");
const remotemediaplayersService = require('../service/remotemediaplayers');

exports.GETRemoteMediaPlayer = (req, res, next) => {
    const carouselid = req.params.carouselid;
    remotemediaplayersService.createWebSocket(carouselid);
    res.status(204).json();
};