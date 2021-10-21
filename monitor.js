var exec = require('child_process').exec;

exec('tasklist | find "FLServer.exe"', function(err, stdout, stderr) {
    // Server isn't running
    if(!stdout)
        StartServer(); 
    else {
        console.log("test");
        exports.memory = stdout.match(/[[0-9]{0,},[0-9]{0,}]{0,}/)[0].replace(',', '').replace('.', '');
    }
});

function StartServer() {
    
}