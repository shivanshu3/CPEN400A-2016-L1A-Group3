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
	// When no price filters are given, all products should be returned
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

	// Only products greater than the given min price filter should be returned.
	it('With only min price filter', function(done) {
		var minPrice = 40;
		productsManager.getAllProducts(minPrice, undefined, function(err, products) {
			var numExpectedProducts = 4;
			expect(err).to.equal(null);
			expect(products.length).to.equal(numExpectedProducts);

			for (var i = 0; i < numExpectedProducts; i++) {
				expect(products[i].price).to.be.at.least(minPrice);
			}
			done();
		});
	});

	// Only products lesser than the given max price filter should be returned.
	it('With only max price filter', function(done) {
		var maxPrice = 354;
		productsManager.getAllProducts(undefined, maxPrice, function(err, products) {
			var numExpectedProducts = 11;
			expect(err).to.equal(null);
			expect(products.length).to.equal(numExpectedProducts);

			for (var i = 0; i < numExpectedProducts; i++) {
				expect(products[i].price).to.be.at.most(maxPrice);
			}
			done();
		});
	});

	// Only products greater than the given min price filter and lesser than
	// the given max price filter should be returned.
	it('With min and max price filters', function(done) {
		var minPrice = 40;
		var maxPrice = 354;
		productsManager.getAllProducts(minPrice, maxPrice, function(err, products) {
			var numExpectedProducts = 3;
			expect(err).to.equal(null);
			expect(products.length).to.equal(numExpectedProducts);

			for (var i = 0; i < numExpectedProducts; i++) {
				expect(products[i].price).to.be.at.least(minPrice);
				expect(products[i].price).to.be.at.most(maxPrice);
			}
			done();
		});
	});
});

describe('listToObject', function() {
	it('Converts a products array to an associative array object', function(done) {
		productsManager.getAllProducts(undefined, undefined, function(err, products) {
			expect(err).to.equal(null);
			expect(products.length).to.equal(12);

			var productsObject = ProductsManager.listToObject(products);
			expect(productsObject).to.be.an('object');

			var productsObjectKeys = Object.keys(productsObject);
			expect(productsObjectKeys).to.have.length(12);

			var product = productsObject[productsObjectKeys[0]];
			expect(productsObjectKeys[0]).to.equal('KeyboardCombo');
			expect(product._id).to.be.undefined;
			expect(product.price).to.equal(28);
			expect(product.quantity).to.equal(2);
			expect(product.url).to.be.a('string');
			done();
		});
	});
});

describe('decrementProductQuantity', function() {
	it('Decrements the quantity by the given amount', function(done) {
		var oldQuantity;

		var steps = new SynchSteps();

		// Get the original quantity of keyboards:
		steps.step(function(next) {
			productsManager.getAllProducts(undefined, undefined, function(err, products) {
				var keyboard = ProductsManager.listToObject(products)['Keyboard'];
				oldQuantity = keyboard.quantity;
				next();
			});
		})

		// Decrement quantity by 2:
		.step(function(next) {
			productsManager.decrementProductQuantity('Keyboard', 2, function() {
				next();
			});
		})

		// Get the new quantity of keyboards:
		.step(function(next) {
			productsManager.getAllProducts(undefined, undefined, function(err, products) {
				var keyboard = ProductsManager.listToObject(products)['Keyboard'];
				newQuantity = keyboard.quantity;
				next();
			});
		})

		// Compare the new and old quantities:
		.step(function(next) {
			expect(oldQuantity - newQuantity).to.be.equal(2);
			next();
		})

		.execute(function() {
			done();
		});
	});
});
