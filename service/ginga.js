const WebSocket = require('ws');
const fs = require('fs');
const envConfig = require('../config/env');
const appl = require('./appfiles');
const user = require('./userapi');
const appState = require('./appState');

var appId = envConfig.client.appID;
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
		ginga = null;
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
		appId = dataFromGinga.appid;
	}
	else if (service == 'userapi') {
		// update path for user data
		user.setUserData(dataFromGinga.path, dataFromGinga.currentUser, dataFromGinga.currentService)
	}
	else if (service == 'node-map') {
		appState.setNodes(dataFromGinga.nodes);
	}
	else if (service == 'node-update') {
		appState.updateAppState(dataFromGinga);
	}
}


function sendMessage(uuid, msg) {
	if (ginga == null) return;

    ginga.send(JSON.stringify({
		service: 'remotedevice',
		handle: uuid,
		message: msg
	}));
}


function sendAction(msg) {
	if (ginga == null) return;

    ginga.send(JSON.stringify({
		service: 'node',
		action: msg
	}));
}


function addToFile(uuid, msg) {
	let json_file = readFile();

	json_file.devices.push({ handle: uuid, deviceClass: msg.deviceClass, supportedTypes: msg.supportedTypes });
	saveFile(json_file);
}


function removeFromFile(uuid) {
	let json_file = readFile();
	if (json_file.devices.length == 0) return;

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
	appId,
	registerHandler,
    sendMessage,
	sendAction,
	addToFile,
	removeFromFile,
	updateCurrentUser
}