//Imports
import child_process from 'child_process';
import dotenv from 'dotenv';

// Init variables
dotenv.config();
const restart_ram = process.env.RESTART_RAM;
const exec = child_process.exec;
let mqtt;

// Pass through the mqtt server so we can report ram in this file
const Init = (aedes) => {
    mqtt = aedes;
}

// Checks the server is running and how much ram it is using
const CheckServer = () => {
    exec('tasklist | find "FLServer.exe"', function (err, stdout, stderr) {
        // Server isn't running
        if (!stdout) {
            console.log('Server is not running.')
            StartServer();
        } 
        else {
            // Get the memory usage from the tasklist line and convert to MB
            let memory = parseInt(stdout.match(/[[0-9]{0,},[0-9]{0,}]{0,}/)[0].replace(',', '').replace('.', '')) / 1024;

            // If ram is over a certain amount, restart the server
            if (restart_ram > 0 && memory > restart_ram)
                RestartServer();

            memory = Math.round(memory).toString();

            // Publish ram uage to the memory topic
            mqtt.publish(
                {
                    cmd: 'publish',
                    qos: 0,
                    topic: 'memory',
                    payload: new Buffer.alloc(memory.length, memory),
                }
            );
        }
    });
}

// Starts FLServer
const StartServer = () => {
    exec(`cmd /c "cd /d "${process.env.FLServer}" && FLServer.exe /c"`, function (err, stdout, stderr) {
        if (!stdout || stderr)
            console.log('Couldn\'t start server:' + stderr);
    });
}

// Kills FLServer
const StopServer = () => {
    exec('taskkill /IM "FLServer.exe" /F', function (err, stdout, stderr) {
        if (!stdout || stderr)
            console.log('Couldn\'t stop server');
        else
            console.log('Server stopped');
    });
}

// Restarts FLServer
const RestartServer = () => {
    StopServer();
    StartServer();
}

// Check the server every 5 seconds
setInterval(CheckServer, 5000);

export default {Init}