var Errors = require("../models/errors");
const MediaPlayersModel = require("../models/mediaplayers");

exports.GETMediaPlayers = (req, res, next) => {
    const mediaPlayers = MediaPlayersModel.getMediaPlayers();
    res.json(mediaPlayers);
};

exports.GETMediaPlayer = (req, res, next) => {
    const mediaPlayer = MediaPlayersModel.getMediaPlayerById(req.params.playerid);
    if (mediaPlayer.length === 0) {
        res.status(404).json(Errors.getError(101));
    }
    else res.json(mediaPlayer[0]);
};

exports.POSTMediaPlayer = (req, res, next) => {
    const mediaPlayer = MediaPlayersModel.getMediaPlayerById(req.params.playerid);
    if (mediaPlayer.length === 0) {
        res.status(404).json(Errors.getError(101));
    }
    else {
        const postedMediaPlayer = req.body;
        console.log("Call RemotePlayer: ",postedMediaPlayer);
        /* RemotePlayer communication and update code */
        res.json(mediaPlayer[0]);
    }
};