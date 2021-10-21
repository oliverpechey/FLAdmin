var exec = require('child_process').exec;
var parent = require.main.exports;

function checkServer() {
    exec('tasklist | find "FLServer.exe"', function(err, stdout, stderr) {
        // Server isn't running
        if(!stdout)
            StartServer(); 
        else {
            var memory = parseInt(stdout.match(/[[0-9]{0,},[0-9]{0,}]{0,}/)[0].replace(',', '').replace('.', '')) / 1024;
            memory = Math.round(memory).toString();
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
    
}

setInterval(checkServer,5000);