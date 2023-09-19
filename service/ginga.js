const WebSocket = require('ws');
const envConfig = require('../config/env');


const ginga = new WebSocket(envConfig.client.gingaSocketUrl);
ginga.on('message', message => handleMessage(message));

var remoteDeviceHandler = null;


function handleMessage(message) {
    const dataFromGinga = JSON.parse(message.toString());
	var service = dataFromGinga.service;
	
	if (service == 'remotedevice') {
		// message to remote device client
		remoteDeviceHandler(dataFromGinga.handle, dataFromGinga.message);
	}
}


function sendMessage(uuid, msg) {
    ginga.send(JSON.stringify({
		service: 'remotedevice',
		handle: uuid,
		message: msg
	}));
}


function registerHandler(type, handler) {
	if (type == 'remotedevice') {
		remoteDeviceHandler = handler;
	    sendServiceStatus(type, 'on');
	}
}


function sendServiceStatus(name, status) {
    ginga.send(JSON.stringify({
		service: name,
		status: status
	}));
}


module.exports = {
    registerHandler,
    sendMessage
}