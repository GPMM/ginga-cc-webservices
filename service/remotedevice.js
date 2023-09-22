const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const envConfig = require('../config/env');
const ginga = require('./ginga');

const clients = {};

const createWebSocket = (body) => {
    const server = http.createServer();
    const wsServer = new WebSocketServer({ server });
    const port = generateDynamicallyPort();
    const uuid = uuidv4();
	
    server.listen(port, () => {
        console.log(`WebSocket server is running on port ${port}`);
    });

    wsServer.on('connection', function (connection) {
        console.log(`${uuid} connected.`);
		
		connection.id = uuid;
        connection.on('message', (message) => handleMessage(message, connection));
        connection.on('close', () => {
            wsServer.close();
        });
		
		clients[uuid] = connection;
    });

    const url = envConfig.client.webSocketUrl + ":" + port
    return createResponseBody(uuid, url);
}

const deleteWebSocket = (handle) => {
    let client = clients[handle];
    if (client) {
		client.close();
        delete clients[handle];
    }
    return;
}

const generateDynamicallyPort = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

const createResponseBody = (uuid, url) => ({
    handle: uuid,
    url: url
});

ginga.registerHandler('remotedevice', function (handle, message) {
	let client = clients[handle];
	if (client) {
		client.send(JSON.stringify(message));
	}
});

function handleMessage(message, client) {
    const uuid = client.id;
	const dataFromClient = JSON.parse(message.toString());
	
	console.log(`client ${uuid} sent message.`);
	ginga.sendMessage(uuid, dataFromClient);
}

module.exports = {
    createWebSocket,
    deleteWebSocket
}