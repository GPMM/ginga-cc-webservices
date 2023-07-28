const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const envConfig = require('../config/env');

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
        connection.on('message', (message) => handleMessage(message, connection));
        connection.on('close', () => {
            wsServer.close();
        });
    });

    clients[uuid] = wsServer;

    const url = envConfig.client.webSocketUrl + ":" + port
    return createResponseBody(uuid, url);
}

const deleteWebSocket = (handle) => {
    let client = clients[handle];
    if (client) {
        client.clients.forEach((socket) => {
            socket.close();
        });
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

function broadcastMessage(json, connection) {
    const data = JSON.stringify(json);
    if (connection.readyState === WebSocket.OPEN) {
        connection.send(data);
    }
}

function handleMessage(message, connection) {
    const dataFromClient = JSON.parse(message.toString());
    broadcastMessage(dataFromClient, connection);
}

module.exports = {
    createWebSocket,
    deleteWebSocket
}