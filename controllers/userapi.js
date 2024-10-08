var Errors = require("../models/errors");
const userService = require('../service/userapi');

exports.POSTUserList = (req, res, next) => {
	userService.getUserList(req.body)
	.then((response) => { res.status(200).json(response) })
};


exports.GETUserAttribute = (req, res, next) => {
	var uid = req.params.userid;
	var atname = null;
	if (Object.keys(req.query).length > 0) {
		atname = req.query.attribute;
	}
	userService.getUserAttribute(uid, atname)
	.then((response) => { res.status(200).json(response) })
};


exports.GETCurrentUser = (req, res, next) => {
	userService.getCurrentUser()
	.then((response) => { res.status(200).json(response) })
};


exports.POSTCurrentUser = (req, res, next) => {
    const body = req.body;
    if (!body) {
        res.status(400).json(Errors.getError(106));
    }
    userService.setCurrentUser(body.id);
    res.sendStatus(200);
};


exports.GETUserFile = (req, res, next) => {
    if (Object.keys(req.query).length == 0) {
		res.status(400).json(Errors.getError(105));
	}

	userService.checkConsent(req.query.path)
	.then((result) => {
		if (!result) {
			res.status(400).json(Errors.getError(305));
		}
		else {
			file_data = userService.getFile(req.query.path);
		
			res.setHeader('Content-Length', file_data.size);
			res.setHeader('Content-Type', file_data.mime);
			res.setHeader('Content-Disposition', `attachment; filename=${file_data.name}`);
			res.write(file_data.file, 'binary');
			res.end();
		}
	})
};