const appFilesService = require('../service/appfiles');

exports.GETAppFile = (req, res, next) => {
    if (!appFilesService.validateAppId(req.params.appid) || Object.keys(req.query).length == 0) {
		res.status(400).json(Errors.getError(305));
	}
	file_data = appFilesService.getFile(req.params.appid, req.query.path);
	
	res.setHeader('Content-Length', file_data.size);
	res.setHeader('Content-Type', file_data.mime);
	res.setHeader('Content-Disposition', `attachment; filename=${file_data.name}`);
	res.write(file_data.file, 'binary');
	res.end();
};
