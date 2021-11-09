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