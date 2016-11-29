// Required modules:
var chai = require('chai');
var DatabaseDriver = require('../backend/DatabaseDriver.js');
var ProductsManager = require('../backend/ProductsManager.js');
var SynchSteps = require('synch-steps');

// Global config:
var expect = chai.expect;
var dbDriver = new DatabaseDriver('localhost', 27017, 'UbcBookstore');
var productsManager = new ProductsManager(dbDriver);
var ObjectId = dbDriver.getObjectIdClass();

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
	it('Without price filter should return all products', function(done) {
		productsManager.getAllProducts(undefined, undefined, function(err, products) {
			expect(err).to.equal(null);
			expect(products.length).to.equal(12);

			var product = products[0];
			expect(product._id).to.be.an.instanceof(ObjectId);
			expect(product.name).to.equal('KeyboardCombo');
			expect(product.price).to.equal(28);
			expect(product.quantity).to.equal(2);
			expect(product.url).to.be.a('string');
			done();
		});
	});
});
