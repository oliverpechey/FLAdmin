// MQTT Config
let client = mqtt.connect('ws://localhost:8080')

// Keep track of how many players are online
let player_count = 0;

// Subscribe to topics
client.on('connect', function () {
  client.subscribe('players', { qos: 0 });
  client.subscribe('chat', { qos: 0 });
  client.subscribe('load', { qos: 0 });
  client.subscribe('memory', { qos: 0 });
  client.publish('allplayers','true');
})

// On receiving message from MQTT broker
client.on('message', function (topic, message, packet) {
  // Which topic are we receiving a message on?
  switch (topic) {
    case 'players':
      ReceivePlayers(message);
      break;
    case 'chat':
      ReceiveChat(message);
      break;
    case 'load':
      ReceiveLoad(message);
      break;
    case 'memory':
      ReceiveMemory(message);
      break;
  }
})

// Inserts a player into the table as a row
const addRecentPlayer = (tbody, player) => {
  let newRow = tbody.insertRow();
  let date = new Date();

  let cellName = newRow.insertCell();
  let cellIP = newRow.insertCell();
  let cellRank = newRow.insertCell();
  let cellSystem = newRow.insertCell();
  let cellTime = newRow.insertCell();

  let textName = document.createTextNode(player.name);
  let textIP = document.createTextNode(player.ip);
  let textRank = document.createTextNode(player.rank);
  let textSystem = document.createTextNode(player.system);
  let textTime = document.createTextNode(moment(date.toISOString()).fromNow());

  cellName.appendChild(textName);
  cellName.classList.add('recentname');

  cellIP.appendChild(textIP);
  cellRank.appendChild(textRank);
  cellSystem.appendChild(textSystem);

  cellTime.appendChild(textTime);
  cellTime.classList.add('time');
  cellTime.setAttribute('time',date.toISOString());
}

// Inserts a player into the table as a row
const addOnlinePlayer = (tbody, player) => {
  let newRow = tbody.insertRow();

  let cellClientID = newRow.insertCell();
  let cellName = newRow.insertCell();
  let cellIP = newRow.insertCell();
  let cellRank = newRow.insertCell();
  let cellSystem = newRow.insertCell();
  let cellAction = newRow.insertCell();

  let textClientID = document.createTextNode(player.id);
  let textName = document.createTextNode(player.name);
  let textIP = document.createTextNode(player.ip);
  let textRank = document.createTextNode(player.rank);
  let textSystem = document.createTextNode(player.system);
  let newText = document.createTextNode('Filler');

  cellClientID.appendChild(textClientID);
  cellName.appendChild(textName);
  cellName.classList.add('onlinename');
  cellIP.appendChild(textIP);
  cellRank.appendChild(textRank);
  cellSystem.appendChild(textSystem);
  cellAction.appendChild(newText);
  player_count++;
}

// Handle the messages received on the /players topic
const ReceivePlayers = (message) => {
  let date = new Date();
  try {
    let players = JSON.parse(message.toString());
    for (const p of players) {
      // Check if player is already here, and if so update
      let tbody =  document.getElementById('playersonline').getElementsByTagName('tbody');
      let found = false;
      for (let r = 0; r < tbody[0].rows.length; r++) {
        if (tbody[0].rows[r].getElementsByClassName('onlinename')[0].innerHTML == p.name) {
          if (p.online) {
            // Update entry
            tbody[0].rows[r].children[0].innerHTML = p.id;
            tbody[0].rows[r].children[2].innerHTML = p.ip;
            tbody[0].rows[r].children[3].innerHTML = p.rank;
            tbody[0].rows[r].children[4].innerHTML = p.system;
            found = true;
          }
          else { // Remove entry
            tbody[0].rows[r].remove();
            player_count--;
          }
        }
      }
      // Otherwise add a new tr
      if (!found && p.online)
        addOnlinePlayer(tbody[0], p);

      // Recent Player List
      // Check if player is already here, and if so update
      tbody = document.getElementById('recentplayers').getElementsByTagName('tbody');
      found = false;
      for (let r = 0; r < tbody[0].rows.length; r++) {
        if (tbody[0].rows[r].getElementsByClassName('recentname')[0].innerHTML == p.name) {
          // Update entry 
          tbody[0].rows[r].children[0].innerHTML = p.name;
          tbody[0].rows[r].children[1].innerHTML = p.ip;
          tbody[0].rows[r].children[2].innerHTML = p.rank;
          tbody[0].rows[r].children[3].innerHTML = p.system;

          // Stores the real time in the attribute and sets the inner HTML to a nicely formatted date/time
          tbody[0].rows[r].children[4].setAttribute('time',date.toISOString());
          tbody[0].rows[r].children[4].innerHTML = moment(date.toISOString()).fromNow();
          found = true;
        }
      }
      // Otherwise add a new tr
      if (!found)
        addRecentPlayer(tbody[0], p);
      
      // Update list by setting filter to what it currently is
      Filter(document.getElementById('recentPlayerButton').innerText);
    }
  }
  catch (e) {
    console.log(`Error in /players topic: ${e}`);
  }

  // Since we have received a message about a player need to update the chat
  let player_item = {
    y: player_count,
    x: date.getTime()
  };
  player_data.datasets[0].data.push(player_item);
  playerChart.update();
}

// Handle receiving from /chat topic
const ReceiveChat = (message) => {
  try {
    let chat = JSON.parse(message.toString());
    let date = new Date();
    document.getElementById("chatlog-area").value += "\r\n[" + moment(date.toISOString()).format('HH:mm') + "] " + chat.from + " -> " + chat.to + ": " + chat.msg;

  }
  catch (e) {
    console.log(`Error in /chat topic: ${e}`);
  }
}

// Handle receiving from /load topic
const ReceiveLoad = (message) => {
  const d = new Date();
  if (!isNaN(message)) {
    let load_item = {
      y: '' + message,
      x: d.getTime()
    };
    load_data.datasets[0].data.push(load_item);
    loadChart.update();
  }
}

// Handle receiving from /memory topic
const ReceiveMemory = (message) => {
  const d = new Date();
  if (!isNaN(message)) {
    let memory_item = {
      y: '' + message,
      x: d.getTime()
    };
    memory_data.datasets[0].data.push(memory_item);
    memoryChart.update();
  }
}
