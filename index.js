/* FLAdmin by Raikkonen (Oliver Pechey)
This is a node-js web application that can be used to manage FLServer.
This requires an MQTT server as well as FLHook 2.1.0 running the MQTT Plugin.
*/

// MQTT Broker
import mqtt from './mqtt.js';

// Website
import website from './website.js';

// FLServer monitor
import monitor from './monitor.js';
monitor.Init(mqtt);
