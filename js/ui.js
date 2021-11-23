// Recent Players filter button (UI)
// This will show or hide each row depending on whether they were last seen in the past day/week/month
const Filter = (period) => {
  // Change the button to display what was selected
  document.getElementById('recentPlayerButton').innerHTML = period;
  // Convert period parameter into a number of days. Assume 30 for month. Accuracy on this isn't hugely important.
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
  // Set the date to be the current date minus the period
  let date = new Date();
  date.setDate(date.getDate() - period);
  // Grab all our tr rows in the recentplayers table and iterate through
  let rows = document.getElementById('recentplayers').getElementsByTagName('tr');
  for (let r = 1; r < rows.length; r++) {
    // Reset moment so it doesnt just get stuck at "a few seconds" ago
    rows[r].getElementsByClassName('time')[0].innerHTML = moment(rows[r].getElementsByClassName('time')[0].getAttribute('time')).fromNow();
    // If the time is outside the filter range, hide
    new Date(rows[r].getElementsByClassName('time')[0].getAttribute('time')) < date ? rows[r].style.display = 'none' : rows[r].style.display = 'table-row';
  }
}

// This function calculates the height of some of the cols based on the height of the one thats probably the largest. This makes them uniform height.
const Resize = () => {
  document.getElementById('table-container-recentplayers').style.height = document.getElementById('chatlog-area').clientHeight - (0.5 * parseFloat(getComputedStyle(document.documentElement).fontSize)) + 'px';
  document.getElementById('table-container-playersonline').style.height = document.getElementById('chatlog-area').clientHeight + 'px';
}

// Call the above function when the window is resized in an aim to be more responsive.
window.onresize = Resize;

// Run functions on load
Filter('Day');
Resize();