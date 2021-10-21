// Imports
require('dotenv').config();

// Start MQTT server
const aedes = require('aedes')();
const server = require('net').createServer(aedes.handle);
server.listen(process.env.MQTT_PORT, function () {
  console.log('MQTT listening on port', process.env.MQTT_PORT);
})

// Start MQTT Web Socket server (for browser)
const httpServer = require('http').createServer();
const WebSocket = require('ws');
const wsPort = process.env.MQTT_WS_PORT;

const wss = new WebSocket.Server({ server: httpServer })
wss.on('connection', function connection (ws) {
  const duplex = WebSocket.createWebSocketStream(ws);
  aedes.handle(duplex);
})

httpServer.listen(wsPort, function () {
  console.log('Websocket MQTT server listening on port', wsPort);
})

// MQTT Callbacks

aedes.on('clientError', function (client, err) {
  console.log('MQTT client error:', client.id, err.message, err.stack);
})

aedes.on('connectionError', function (client, err) {
  console.log('MQTT Cconnection error:', client, err.message, err.stack);
})

aedes.on('publish', function (packet, client) {
  if (packet && packet.payload) {
    console.log('Publish packet:', packet.payload.toString());
  }
  if (client) {
    console.log('Message from client', client.id);
  }
})

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id);
  }
})

aedes.on('client', function (client) {
  console.log('new client', client.id);
})