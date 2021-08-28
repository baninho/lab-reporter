const express = require('express');
const path = require('path');

const app = express();
const http = require('http');
const server = http.createServer(app);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('listening on :' + port);
});

