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
          ticks: {
            color: "#a1ecfb",
          }
        },
        x: {
          ticks: {
            color: "#a1ecfb",
          }
        }
    }
}

const labels = [
    '30m',
    '25m',
    '20m',
    '15m',
    '10m',
    '5m',
    'now'
  ];

// Load Chart 
  const load_data = {
    labels: labels,
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
    labels: labels,
    datasets: [{
      label: 'Memory Usage (MB)',
      backgroundColor: 'rgb(35,191,170)',
      borderColor: 'rgb(35,191,170)',
      data: [0, 100, 250, 432, 210, 30, 324],
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
    labels: labels,
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
    switch(topic) {
      case 'players':
        console.log('players');
        break;
      case 'load':
        if(!isNaN(message))
          load_data.datasets[0].data.push('' + message);
          loadChart.update();
          console.log(load_data.datasets[0].data);
        break;
      case 'memory':
        break;
    }
  })