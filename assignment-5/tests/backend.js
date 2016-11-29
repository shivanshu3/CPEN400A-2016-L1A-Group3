// Required modules:
var DatabaseDriver = require('../backend/DatabaseDriver.js');
var ProductsManager = require('../backend/ProductsManager.js');
var SynchSteps = require('synch-steps');

// Global config:
var dbDriver = new DatabaseDriver('localhost', 27017, 'UbcBookstore');
var productsManager = new ProductsManager(dbDriver);

var initSteps = new SynchSteps();

// Connect to the database first:
initSteps.step(function(next) {
	dbDriver.connect(function(err) {
		if (err) {
			console.log('Failed to connect to the database.');
			process.exit(1);
		}
		next();
	});
});

// Sets up the test environment:
before(function(done) {
	initSteps.execute(function() {
		done();
	});
});

describe('getAllProducts', function() {
	it('Should return a list of valid products', function(done) {
		done();
	});
});
