// Shared vars
const options = {
  plugins: {
    legend: {
      labels: {
        color: "#a1ecfb"
      }
    }
  },
  scales: {
    y: {
      min: 0,
      ticks: {
        color: "#a1ecfb",
        precision: 0
      }
    },
    x: {
      type: 'time',
      time: {
        displayFormats: {
          millisecond: 'HH:mm:ss',
          second: 'HH:mm:ss',
          minute: 'HH:mm'
        }
      },
      ticks: {
        color: "#a1ecfb",
        source: 'data',
        maxTicksLimit: 10,
        maxRotation: 0
      }
    }
  }
}

// Load Chart 
const load_data = {
  datasets: [{
    label: 'Server Load (ms)',
    backgroundColor: '#017682',
    borderColor: '#017682',
    data: [],
  }]
};

const load_config = {
  type: 'line',
  data: load_data,
  options: options
};

var loadChart = new Chart(
  document.getElementById('load-chart'),
  load_config
);

// Memory Chart
const memory_data = {
  datasets: [{
    label: 'Memory Usage (MB)',
    backgroundColor: 'rgb(35,191,170)',
    borderColor: 'rgb(35,191,170)',
    data: [],
  }]
};

const memory_config = {
  type: 'line',
  data: memory_data,
  options: options
};

var memoryChart = new Chart(
  document.getElementById('memory-chart'),
  memory_config
);

// Player Chart
const player_data = {
  datasets: [{
    label: 'Player Count',
    backgroundColor: 'rgb(129,197,215)',
    borderColor: 'rgb(129,197,215)',
    data: [0, 2, 2, 1, 0, 1, 3],
  }]
};

const player_config = {
  type: 'line',
  data: player_data,
  options: options
};

var playerChart = new Chart(
  document.getElementById('player-chart'),
  player_config
);

// MQTT Config
var client = mqtt.connect('ws://localhost:8080')

client.on('connect', function () {
  client.subscribe('players', { qos: 0 });
  client.subscribe('load', { qos: 0 });
  client.subscribe('memory', { qos: 0 });
})

client.on('message', function (topic, message, packet) {
  console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
  switch (topic) {
    case 'players':
      ReceivePlayers(message);
      break;
    case 'load':
      if (!isNaN(message)) {
        const d = new Date();
        var load_item = {
          y: '' + message,
          x: d.getTime()
        };
        load_data.datasets[0].data.push(load_item);
        loadChart.update();
      }
      break;
    case 'memory':
      if (!isNaN(message)) {
        const d = new Date();
        var memory_item = {
          y: '' + message,
          x: d.getTime()
        };
        memory_data.datasets[0].data.push(memory_item);
        memoryChart.update();
      }
      break;
  }
})

function addRecentPlayer(table, player) {
  let newRow = table.insertRow();

  let cellName = newRow.insertCell();
  let cellIP = newRow.insertCell();
  let cellRank = newRow.insertCell();
  let cellSystem = newRow.insertCell();

  let textName = document.createTextNode(player.name);
  let textIP = document.createTextNode(player.ip);
  let textRank = document.createTextNode(player.rank);
  let textSystem = document.createTextNode(player.system);

  cellName.appendChild(textName);
  cellIP.appendChild(textIP);
  cellRank.appendChild(textRank);
  cellSystem.appendChild(textSystem);
}

function addOnlinePlayer(table, player) {
  let newRow = table.insertRow();

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
  cellIP.appendChild(textIP);
  cellRank.appendChild(textRank);
  cellSystem.appendChild(textSystem);
  cellAction.appendChild(newText);
}

// Handle the messages received on the /players topic
function ReceivePlayers(message) {
  try {
    let players = JSON.parse(message.toString());

    for (const p of players) {

      // Check if player is already here, and if so update
      let table = document.getElementById('playersonline');
      let rows = table.getElementsByTagName('tr');
      let found = false;
      for (let r = 1; r < rows.length; r++) {
        if (rows[r].getElementsByClassName('onlinename')[0].innerHTML == p.name) {
          if (p.online) {
            // Update entry
            rows[r].children[0].innerHTML = p.id;
            rows[r].children[2].innerHTML = p.ip;
            rows[r].children[3].innerHTML = p.rank;
            rows[r].children[4].innerHTML = p.system;
            found = true;
          }
          else { // Remove entry
            rows[r].remove();
          }
        }
      }
      // Otherwise add a new tr
      if (!found && p.online)
        addOnlinePlayer(table, p);

      // Recent Player List
      // Check if player is already here, and if so update
      table = document.getElementById('recentplayers');
      rows = table.getElementsByTagName('tr');
      found = false;
      for (let r = 1; r < rows.length; r++) {
        if (rows[r].getElementsByClassName('recentname')[0].innerHTML == p.name) {
          // Update entry 
          rows[r].children[0].innerHTML = p.name;
          rows[r].children[1].innerHTML = p.ip;
          rows[r].children[2].innerHTML = p.rank;
          rows[r].children[3].innerHTML = p.system;

          var date = new Date();
          rows[r].children[4].innerHTML = date.toISOString();
          found = true;
        }
      }
      // Otherwise add a new tr
      if (!found)
        addRecentPlayer(table, p);
    }
  }
  catch (e) {
    console.log(`Error in /players topic: ${e}`);
  }
}

// Recent Players filter button (UI)
function Filter(period) {
  switch (period) {
    case 'day':
      period = 1;
      break;
    case 'week':
      period = 7;
      break;
    case 'month':
      period = 30;
      break;
  }

  var date = new Date();
  date.setDate(date.getDate() - period);

  var rows = document.getElementById('recentplayers').getElementsByTagName('tr');
  for (let r = 1; r < rows.length; r++) {
    var playerDate = new Date(rows[r].getElementsByClassName('time')[0].getAttribute('time'));
    if (playerDate < date)
      rows[r].style.display = 'none';
    else
      rows[r].style.display = 'table-row';
  }
}

Filter('day');