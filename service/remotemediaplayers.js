const { WebSocket, WebSocketServer } = require('ws');
const http = require('http');

const createWebSocket = (carouselid) => {
    const server = http.createServer();
    const wsServer = new WebSocketServer({ server });
    const port = generateDynamicallyPort();
    server.listen(port, () => {
        console.log(`WebSocket server is running on port ${port}`);
    });

    wsServer.on('connection', function (connection) {
        console.log(`${carouselid} connected.`);
        connection.on('message', (message) => handleMessage(message, connection));
    });
}

const generateDynamicallyPort = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

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
    createWebSocket
}