const path = require('path');
const fs = require('fs');
const ginga = require('./ginga');

var running_app_id = 100;
var base_path = null; 


function setAppData(appid, path) {
	running_app_id = appid;
	base_path = path;

	console.log(`Set application id ${running_app_id} in location ${base_path}.`);
}


function validateAppId(appid) {
	return appid == running_app_id;
}


function getFile(appid, fpath) {
	var file_path = fpath;
	if (base_path != null){
		file_path = path.join(base_path, fpath);
	}
	if (file_path.startsWith('file:')) {
		file_path = file_path.substring(7);
	}
	var file_name = path.parse(file_path).base;
	var file_ext = path.extname(file_name);
	
	var stat = fs.statSync(file_path);
	
	return {
		size: stat.size,
		mime: GetMime(file_ext),
		type: GetType(file_ext),
		name: file_name,
		path: file_path
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


function GetType(file_ext) {
	// video
	if (file_ext == '.mpeg') {
		return 'video';
	}
	else if (file_ext == '.mp4') {
		return 'video';
	}
	// audio
	else if (file_ext == '.mp3') {
		return 'audio';
	}
	else if (file_ext == '.ogg') {
		return 'audio';
	}
	// text
	else if (file_ext == '.txt') {
		return 'text';
	}
	// images
	else if (file_ext == '.jpeg' || file_ext == '.jpg') {
		return 'image';
	}
	else if (file_ext == '.png') {
		return 'image';
	}
	// 3D object
	else if (file_ext == '.obj') {
		return 'model';
	}
	// others
	else {
		return 'application';
	}
}


module.exports = {
	setAppData,
	validateAppId,
	getFile
}