// Imports and init
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import moment from 'moment';
const app = express();
const __dirname = path.resolve();
app.locals.moment = moment;
dotenv.config();

const Start = (players) => {
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
    res.render("index", { title: "FLAdmin", players: players });
  });

  // Standard http listening. TODO Need to implement https
  app.listen(process.env.WEB_PORT, function () {
    console.log(`Live at Port ${process.env.WEB_PORT}`);
  });
}

export default { Start };