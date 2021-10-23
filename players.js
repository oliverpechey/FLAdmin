// Imports
import ini from '@nodecraft/ini';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Load systems and their internal ID from a file
let systems = ini.parse(fs.readFileSync('systems.ini', 'utf8'), {inlineArrays : true});

// Decodes the name string in the .fl files
String.prototype.hexDecode = function(){
    let i;
    let hexes = this.match(/.{1,4}/g) || [];
    let back = "";
    for(i = 0; i < hexes.length; i++) {
        back += String.fromCharCode(parseInt(hexes[i], 16));
    }
    return back;
}

// Used to grab all .fl files in a directory recursively
const traverseDir = (dir) => {
    let playerFiles = [];
    fs.readdirSync(dir).forEach(file => {
      let fullPath = path.join(dir, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
         playerFiles.push(...traverseDir(fullPath));
       } else if (fullPath.slice(-2) == 'fl') {
         playerFiles.push(fullPath);
       }  
    });
    return playerFiles;
}

// Load player stats into a map
const loadPlayerFiles = () => {
    let players = [];
    let playerFiles = traverseDir(process.env.SAVE_LOCATION, 0);
    for(const pf of playerFiles) {
        let config = ini.parse(fs.readFileSync(pf, 'utf8'), {inlineArrays : true});
		if(Object.keys(config).length != 0) {
            let p = {};
            p.name = config.Player.name.hexDecode();
            p.system = systems[config.Player.system];
            p.rank = parseInt(config.Player.rank);
            p.lastseen = fs.statSync(pf).mtime;
            players.push(p);
		}
    }
    return players;
};

export default {loadPlayerFiles}
