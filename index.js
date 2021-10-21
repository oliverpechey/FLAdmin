/* FLAdmin by Raikkonen (Oliver Pechey)
This is a node-js web application that can be used to manage FLServer.
This requires an MQTT server as well as FLHook 2.1.0 running the MQTT Plugin.
*/

// Import libraries and init variables
var express = require("express");
const path = require("path");
var app = express();
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

// Links to modules and directories for use in html files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/js', express.static(__dirname + '/node_modules/mqtt/dist'));
app.use('/js', express.static(__dirname + '/node_modules/chartjs-adapter-date-fns/dist'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));

// Set pug to be our engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Set our root to be the index.pug file
app.get("/", (req, res) => {
  res.render("index", { title: "FLAdmin" });
});

// Standard http listening. TODO Need to implement https
app.listen(process.env.WEB_PORT,function(){
  console.log(`Live at Port ${process.env.WEB_PORT}`);
});