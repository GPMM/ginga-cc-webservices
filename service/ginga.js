const WebSocket = require('ws');
const envConfig = require('../config/env');

var remoteDeviceHandler = null;
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
	    // sendServiceStatus(type, 'on');
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