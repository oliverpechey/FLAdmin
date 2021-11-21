// Recent Players filter button (UI)
function Filter(period) {
  document.getElementById('recentPlayerButton').innerHTML = period;

  switch (period) {
    case 'Day':
      period = 1;
      break;
    case 'Week':
      period = 7;
      break;
    case 'Month':
      period = 30;
      break;
  }

  var date = new Date();
  date.setDate(date.getDate() - period);

  var rows = document.getElementById('recentplayers').getElementsByTagName('tr');
  for (let r = 1; r < rows.length; r++) {
    var playerDate = new Date(rows[r].getElementsByClassName('time')[0].getAttribute('time'));

    // Reset moment so it doesnt just get stuck at "a few seconds" ago
    rows[r].getElementsByClassName('time')[0].innerHTML = moment(rows[r].getElementsByClassName('time')[0].getAttribute('time')).fromNow();

    // If the time is outside the filter range, hide
    if (playerDate < date)
      rows[r].style.display = 'none';
    else
      rows[r].style.display = 'table-row';
  }
}

// This function calculates the height of some of the cols based on the height of the one thats probably the largest. This makes them uniform height.
function Resize() {
  document.getElementById('table-container-recentplayers').style.height = document.getElementById('chatlog-area').clientHeight - (0.5 * parseFloat(getComputedStyle(document.documentElement).fontSize)) + 'px';
  document.getElementById('table-container-playersonline').style.height = document.getElementById('chatlog-area').clientHeight + 'px';
}

window.onresize = Resize;

// Run functions on load
Filter('Day');
Resize();