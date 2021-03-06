// Required modules:
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var SynchSteps = require('synch-steps');
var http = require('http');
var DatabaseDriver = require('./DatabaseDriver.js');
var ProductsManager = require('./ProductsManager.js');

/** GLOBAL DATA AND APP CONFIG **/

var app = express();
var httpServer = null;
var dbDriver = new DatabaseDriver('localhost', 27017, 'UbcBookstore');
var productsManager = new ProductsManager(dbDriver);

/** SETTING UP EXPRESS **/

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(multer());
// for parsing cookies:
app.use(cookieParser());
// Enable cross origin requests:
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept");
	next();
});

/** API ENDPOINTS **/

// GET /products
app.get('/products', function(req, res) {
	productsManager.getAllProducts(req.query.minPrice, req.query.maxPrice,
		function(err, products) {
		if (err) {
			console.log(err);
			res.status(400).send('An error occured');
		} else {
			var productsObject = ProductsManager.listToObject(products);
			res.send(productsObject);
		}
	});
});

// POST /checkout
app.post('/checkout', function (req, res) {
	productsManager.addOrder(req.body.order, function(err, result) {
		if (err) {
			console.log(err);
			res.status(400).send('An error occured');
		} else {
			res.send(result);
		}
	});
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

// Start the httpServer:
serverInitSteps.step(function(next) {
	httpServer = http.createServer(app);
	httpServer.listen(3000, function() {
		console.log('Listening now...');
		next();
	});
});

serverInitSteps.execute();
