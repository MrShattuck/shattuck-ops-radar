fetch('https://api.weather.gov/alerts/active?area=MO')
  .then(response => response.json())
  .then(data => {
    const banner = document.getElementById('alert-banner');
    const logList = document.getElementById('storm-log');
    const logData = [];

    data.features.forEach(alert => {
      const event = alert.properties.event;
      const desc = alert.properties.headline;
      const timestamp = new Date(alert.properties.sent).toLocaleString();

      // Show alert
      banner.style.display = 'block';
      banner.textContent = `${event}: ${desc}`;

      // Add to log
      const li = document.createElement('li');
      li.textContent = `${timestamp} – ${event}`;
      logList.appendChild(li);

      logData.push({ timestamp, event });
    });

    // Save log to localStorage (you can expand this to a backend)
    localStorage.setItem('stormLog', JSON.stringify(logData));
  })
  .catch(err => console.error('Alert fetch failed:', err));
