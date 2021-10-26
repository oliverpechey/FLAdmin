/* FLAdmin by Raikkonen (Oliver Pechey)
This is a node-js web application that can be used to manage FLServer.
This requires an MQTT server as well as FLHook 2.1.0 running the MQTT Plugin.
*/

// Imports and init
import playerParser from 'freelancer-save-parser';
import dotenv from 'dotenv';
dotenv.config();

// Grab recent players from save files
let parser = new playerParser.Parser().ParsePlayerFiles(process.env.SAVE_LOCATION, 30, 'LastSeen').SortPlayerFiles('LastSeen', 'Desc');

// MQTT Broker
import mqtt from './mqtt.js';

// Website
import website from './website.js';
website.Start(parser.players);

// FLServer monitor
import monitor from './monitor.js';
monitor.Init(mqtt);
