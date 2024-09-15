const WebSocket = require('ws');
const fs = require('fs');
const envConfig = require('../config/env');
const appl = require('./appfiles');
const user = require('./userapi');

var remoteDeviceHandler = null;
var ginga = null;
saveFile({ devices:[] });

const gwss = new WebSocket.Server({ port: envConfig.client.gingaSockePort }, () => {
    console.log(`Ginga WebSocket iniciado na porta ${envConfig.client.gingaSockePort}`);
});

gwss.on('connection', function (connection) {
    console.log('ginga connected.');
	ginga = connection;
	ginga.on('message', message => handleMessage(message));
    ginga.on('close', () => {
        console.log('ginga disconnected.');
    });
});


function handleMessage(message) {
    const dataFromGinga = JSON.parse(message.toString());
	var service = dataFromGinga.service;
	
	if (service == 'remotedevice') {
		// message to remote device client
		remoteDeviceHandler(dataFromGinga.handle, dataFromGinga.message);
	}
	else if (service == 'appfiles') {
		// update path for application files api
		appl.setAppData(dataFromGinga.appid, dataFromGinga.path);
	}
	else if (service == 'userapi') {
		// update path for user data
		user.setUserData(dataFromGinga.path, dataFromGinga.currentUser, dataFromGinga.currentService)
	}
}


function sendMessage(uuid, msg) {
	if (ginga == null) {
		addToFile(uuid, msg);
		return;
	}

    ginga.send(JSON.stringify({
		service: 'remotedevice',
		handle: uuid,
		message: msg
	}));
}


function addToFile(uuid, msg) {
	let json_file = readFile();

	json_file.devices.push({ handle: uuid, deviceClass: msg.deviceClass, supportedTypes: msg.supportedTypes });
	saveFile(json_file);
}


function removeFromFile(uuid) {
	let json_file = readFile();
	let index = 0;
	while (json_file.devices[index].handle != uuid) {
		index++;
	}
	json_file.devices.splice(index, 1);
	saveFile(json_file);
}


function readFile() {
	let rawdata = fs.readFileSync(envConfig.client.remoteDeviceFilePath);
	let json_file = JSON.parse(rawdata);
	return json_file;
}


function saveFile(content) {
	fs.writeFile(envConfig.client.remoteDeviceFilePath,
		JSON.stringify(content, null, 4),
		'utf8',
		(err) => {
		   if (err) throw err;
		   console.log('remote device file updated');
		});
}


function updateCurrentUser(uid) {
	if (ginga == null) return;
	
    ginga.send(JSON.stringify({
		service: 'userapi',
		current: uid
	}));
}


function registerHandler(handler) {
	remoteDeviceHandler = handler;
}


module.exports = {
	registerHandler,
    sendMessage,
	removeFromFile,
	updateCurrentUser
}