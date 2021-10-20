/* FLAdmin by Raikkonen (Oliver Pechey)
This is a node-js web application that can be used to manage FLServer.
This requires an MQTT server as well as FLHook 2.1.0 running the MQTT Plugin.
*/

// Import libraries and init variables
var express = require("express");
const path = require("path");
var app = express();

// Start MQTT server
const aedes = require('aedes')()
const server = require('net').createServer(aedes.handle)
const port = 1883
server.listen(port, function () {
  console.log('MQTT started and listening on port ', port)
})

// Links to modules and directories for use in html files
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/chart.js/dist'));
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
app.listen(3000,function(){
  console.log("Live at Port 3000");
});