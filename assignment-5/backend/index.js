// Required modules:
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');

var app = express();

/** SETTING UP EXPRESS **/

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(multer());
// for parsing cookies:
app.use(cookieParser());

/** API ENDPOINTS **/

// Enable cross origin requests:
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// GET Params example:
app.get('/paramsexample/:name', function(req, res) {
   res.send(req.params);
   console.log('Params Example Served');
});

// GET query example:
app.get('/getexample', function(req, res) {
   res.send(req.query);
   console.log('Get Example Served');
});

// POST query example:
app.post('/postexample', function (req, res) {
   res.send(req.body);
   console.log('Post Example Served');
});

// GET cookie example
app.get('/cookies', function(req, res) {
   res.send(req.cookies);
   console.log('Cookies Example Served');
});

/** INITIATE THE SERVER BOOTUP SEQUENCE **/

var serverInitSteps = new SynchSteps();

// Connect to the database first:
serverInitSteps.step(function(next) {
   dbDriver.connect(function(err) {
      if (err) {
         console.log('Failed to connect to the database.');
         process.exit(1);
      }
      next();
   });
});

// Start the httpsServer:
serverInitSteps.step(function(next) {
   httpsServer = https.createServer(sslOptions, app);
   httpsServer.listen(3000, function() {
      console.log('Listening now...');
      rootDowngrade.rootStepComplete();
      next();
   });
});

serverInitSteps.execute();
