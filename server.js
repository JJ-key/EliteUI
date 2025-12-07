const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static('public'));

app.get('/Loader', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'Loader'));
});

app.get('/Example', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'Example'));
});

app.get('/api/loader-url', (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  res.json({ url: protocol + '://' + host + '/Loader' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('EliteUI server running on port ' + PORT);
});
