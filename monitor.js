var exec = require('child_process').exec;
var parent = require.main.exports;
require('dotenv').config();
var restart_ram = process.env.RESTART_RAM;

function checkServer() {
    exec('tasklist | find "FLServer.exe"', function(err, stdout, stderr) {
        // Server isn't running
        if(!stdout)
            StartServer(); 
        else {
            // Get the memory usage from the tasklist line and convert to MB
            var memory = parseInt(stdout.match(/[[0-9]{0,},[0-9]{0,}]{0,}/)[0].replace(',', '').replace('.', '')) / 1024;
            
            // If ram is over a certain amount, restart the server
            if(restart_ram > 0 && memory > restart_ram)
                RestartServer();

            memory = Math.round(memory).toString();

            // Publish ram uage to the memory topic
            parent.mqtt.aedes.publish(
                {
                    cmd: 'publish',
                    qos: 0,
                    topic: 'memory',
                    payload: new Buffer.alloc(memory.length,memory),
                }
            );
        }
    });
}

function StartServer() {
    exec(process.env.FLServer, function(err, stdout, stderr) {
        if(!stdout || stderr)
            console.log('Couldn\'t start server');
        else
            console.log('Server started');
    });
}

function StopServer() {
    exec('taskkill /IM "FLServer.exe" /F', function(err, stdout, stderr) {
        if(!stdout || stderr)
            console.log('Couldn\'t stop server');
        else
            console.log('Server stopped');
    });
}

function RestartServer() {
    StopServer();
    StartServer();
}

setInterval(checkServer,5000);