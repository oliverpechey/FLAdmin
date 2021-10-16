/* FLAdmin by Raikkonen (Oliver Pechey)
This is a node-js web application that can be used to manage FLServer.
This requires an MQTT server as well as FLHook 2.1.0 running the MQTT Plugin.
*/

var express = require("express");
var app = express();
var router = express.Router();

// Links to modules and directories for use in html file
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/images', express.static(__dirname + '/images'));

// Server up index.html on root
router.get("/",function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.use("/",router);

// Standard http listening. TODO Need to implement https
app.listen(3000,function(){
  console.log("Live at Port 3000");
});