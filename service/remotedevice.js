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
            console.log(`${uuid} disconnected.`);
            // wsServer.close();
        });
		
		clients[uuid] = connection;
    });
	
	handleRegister(uuid, body);
    console.log(`Client ${uuid} registered.`);
    
    const url = envConfig.client.webSocketUrl + ":" + port
    return createResponseBody(uuid, url);
}

const deleteWebSocket = (handle) => {
    let client = clients[handle];
    if (client) {
		client.close();
        delete clients[handle];
        console.log(`Client ${uuid} unregistered.`);
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


ginga.registerHandler(function (handle, message) {
	let client = clients[handle];
	if (client) {
		client.send(JSON.stringify(message));
        console.log(`Message to ${handle}\n${JSON.stringify(message)}`);
	}
});


function handleRegister(uuid, body) {
	ginga.sendMessage(uuid, body);
}


function handleMessage(message, client) {
    const uuid = client.id;
	const dataFromClient = JSON.parse(message.toString());
	
	console.log(`client ${uuid} sent message\n ${message.toString()}`);
	ginga.sendMessage(uuid, dataFromClient);
}


module.exports = {
    createWebSocket,
    deleteWebSocket
}