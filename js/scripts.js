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
  client.publish('players', 'Test', { qos: 0, retain: false })
})

client.on('message', function (topic, message, packet) {
  console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
  switch (topic) {
    case 'players':
      console.log('players');
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

// Populate Recent Players on initial page load
/*function PopulateRecentPlayers(players) {
  for(const p of players) {
    var table = document.getElementById('recentplayers');
    var tr = table.insertRow();
    var name = tr.insertCell();
    var ip = tr.insertCell();
    var rank = tr.insertCell();
    var system = tr.insertCell();
    var lastseen = tr.insertCell();
    tbody.appendChild(tr);
  }
}*/

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
    if(playerDate < date)
      rows[r].style.display = 'none'; 
    else
      rows[r].style.display = 'table-row';
    }
}

Filter('day');