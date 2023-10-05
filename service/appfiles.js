const path = require('path');
const fs = require('fs');
const ginga = require('./ginga');

var running_app_id = null;
var base_path = null; 


ginga.registerHandler('appfiles', function (appid, path) {
	running_app_id = appid;
	base_path = path;
});


function validateAppId(appid) {
	return appid == running_app_id;
}


function getFile(appid, fpath) {
	var file_path = path.join(base_path, fpath);
	var file_name = path.parse(file_path).base;
	var file_ext = path.extname(file_name);
	
	var stat = fs.statSync(file_path);
	var file = fs.readFileSync(file_path, 'binary');
	
	return {
		size: stat.size,
		mime: GetMime(file_ext),
		name: file_name,
		file: file
	}
}


function GetMime(file_ext) {
	// video
	if (file_ext == '.mpeg') {
		return 'video/mpeg';
	}
	else if (file_ext == '.mp4') {
		return 'video/mp4';
	}
	// audio
	else if (file_ext == '.mp3') {
		return 'audio/mpeg';
	}
	else if (file_ext == '.ogg') {
		return 'audio/ogg';
	}
	// text
	else if (file_ext == '.txt') {
		return 'text/plain';
	}
	// images
	else if (file_ext == '.jpeg' || file_ext == '.jpg') {
		return 'image/jpeg';
	}
	else if (file_ext == '.png') {
		return 'image/png';
	}
	// 3D object
	else if (file_ext == '.obj') {
		return 'model/obj';
	}
	// others
	else {
		return 'application/octet-stream';
	}
}


module.exports = {
	validateAppId,
	getFile
}