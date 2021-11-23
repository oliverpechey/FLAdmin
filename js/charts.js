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
    data: [],
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