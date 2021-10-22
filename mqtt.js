// Imports
import dotenv from 'dotenv'
import aedes from 'aedes';
import net from 'net';
import http from 'http';
import ws from 'ws';

dotenv.config()

// Start MQTT server
const mqtt = aedes();
const server = net.createServer(mqtt.handle);
server.listen(process.env.MQTT_PORT, function () {
  console.log('MQTT listening on port', process.env.MQTT_PORT);
})

// Start MQTT Web Socket server (for browser)
const httpServer = http.createServer();
const wss = new ws.Server({ server: httpServer })
wss.on('connection', function connection(web) {
  const duplex = ws.createWebSocketStream(web);
  mqtt.handle(duplex);
})

httpServer.listen(process.env.MQTT_WS_PORT, function () {
  console.log('Websocket MQTT server listening on port', process.env.MQTT_WS_PORT);
})

// MQTT Callbacks

mqtt.on('clientError', function (client, err) {
  console.log('MQTT client error:', client.id, err.message, err.stack);
})

mqtt.on('connectionError', function (client, err) {
  console.log('MQTT Cconnection error:', client, err.message, err.stack);
})

mqtt.on('publish', function (packet, client) {
  if (packet && packet.payload) {
    console.log('Publish packet:', packet.payload.toString());
  }
  if (client) {
    console.log('Message from client', client.id);
  }
})

mqtt.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('subscribe from client', subscriptions, client.id);
  }
})

mqtt.on('client', function (client) {
  console.log('new client', client.id);
})

export default mqtt;