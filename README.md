* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body {
  height: 100%;
  width: 100%;
  background-color: #000;
  font-family: Arial, sans-serif;
}
#radar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
header {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px 20px;
  border-radius: 8px;
  color: #00ffea;
  font-size: 18px;
  font-weight: bold;
  text-shadow: 0 0 5px #00ffea;
}
#alert-banner {
  position: absolute;
  top: 60px;
  left: 10px;
  z-index: 3;
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  display: none;
}
#storm-log-container {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 10px;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 3;
}
const banner = document.getElementById('alert-banner');
const logList = document.getElementById('storm-log');
const logData = [];

const areas = ['MO', 'KS'];

Promise.all(
  areas.map(area =>
    fetch(`https://api.weather.gov/alerts/active?area=${area}`).then(res => res.json())
  )
).then(results => {
  results.flatMap(r => r.features).forEach(alert => {
    const event = alert.properties.event;
    const desc = alert.properties.headline;
    const timestamp = new Date(alert.properties.sent).toLocaleString();
    const state = alert.properties.areaDesc;

    // Show alert (latest only)
    banner.style.display = 'block';
    banner.textContent = `${event} (${state}): ${desc}`;

    // Add to log
    const li = document.createElement('li');
    li.textContent = `${timestamp} – ${event} – ${state}`;
    logList.appendChild(li);

    logData.push({ timestamp, event, state });
  });

  // Optional: Save to localStorage (or expand to backend)
  localStorage.setItem('stormLog', JSON.stringify(logData));
}).catch(err => {
  console.error('Alert fetch failed:', err);
  banner.style.display = 'block';
  banner.textContent = '⚠️ Failed to load alerts';
});
