// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();

var api = require('./routes/index');
var timestamp = require('./routes/api/timestamp');
var whoami = require('./routes/api/whoami');
var shorturl = require('./routes/api/shorturl');
var exercise = require('./routes/api/exercise');
var fileanalyse = require('./routes/api/fileanalyse');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
app.get("/exercise-tracker", function (req, res) {
  res.sendFile(__dirname + '/views/exercise-tracker.html');
});
app.get("/file-metadata", function (req, res) {
  res.sendFile(__dirname + '/views/file-metadata.html');
});

app.use('/api', api);
app.use('/api/timestamp', timestamp);
app.use('/api/whoami', whoami);
app.use('/api/shorturl', shorturl);
app.use('/api/exercise', exercise);
app.use('/api/fileanalyse', fileanalyse);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});