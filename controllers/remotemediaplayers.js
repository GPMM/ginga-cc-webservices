const remotemediaplayersService = require('../service/remotemediaplayers');

exports.GETRemoteMediaPlayer = (req, res, next) => {
    const carouselid = req.params.carouselid;
    response = remotemediaplayersService.createWebSocket(carouselid);
    res.status(200).json(response);
};