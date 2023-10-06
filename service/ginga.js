const WebSocket = require('ws');
const envConfig = require('../config/env');

var remoteDeviceHandler = null;
var appFileHandler = null;
var userAPIHandler = null;
var ginga = null;


const gwss = new WebSocket.Server({ port: envConfig.client.gingaSockePort }, () => {
    console.log(`Ginga WebSocket iniciado na porta ${envConfig.client.gingaSockePort}`);
});

gwss.on('connection', function (connection) {
    console.log('ginga connected.');
	ginga = connection;
	ginga.on('message', message => handleMessage(message));
    ginga.on('close', () => { gwss.close(); });
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
		appFileHandler(dataFromGinga.appid, dataFromGinga.path);
	}
	else if (service == 'userapi') {
		// update path for user data
		userAPIHandler(dataFromGinga.path, dataFromGinga.current);
	}
}


function sendMessage(uuid, msg) {
    ginga.send(JSON.stringify({
		service: 'remotedevice',
		handle: uuid,
		message: msg
	}));
}


function updateCurrentUser(uid) {
    ginga.send(JSON.stringify({
		service: 'userapi',
		current: uid
	}));
}


function registerHandler(type, handler) {
	if (type == 'remotedevice') {
		remoteDeviceHandler = handler;
	}
	else if (type == 'appfiles') {
		appFileHandler = handler;
	}
	else if (type == 'userapi') {
		userAPIHandler = handler;
	}
}


module.exports = {
    registerHandler,
    sendMessage,
	updateCurrentUser
}