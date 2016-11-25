/**
 * This class handles everything to do with products such as:
 * - Retrieving all of them from the database
 * - Decrement the quantity of a given product
 */

/**
 * The constructor
 */
var ProductsManager = function(dbDriver) {
	// Instance variables:
	this.dbDriver = dbDriver;
};

/**
 * Returns a list of all products
 * If minPrice and maxPrice are not undefined, then they will be
 * used as price filters. These are inclusive.
 * Calls the given callback when its ready
 * First argument is err if any, the second argument is the list of products.
 */
ProductsManager.prototype.getAllProducts = function(minPrice, maxPrice, callback) {
	var filter = {};
	if ((minPrice != undefined) || (maxPrice != undefined)) {
		filter.price = {};
	}
	if (minPrice != undefined) {
		minPrice = Number(minPrice);
		if (isNaN(minPrice)) {
			callback(new Error('Illegal Input minPrice'), null);
			return;
		}
		filter.price.$gte = minPrice;
	}
	if (maxPrice != undefined) {
		maxPrice = Number(maxPrice);
		if (isNaN(maxPrice)) {
			callback(new Error('Illegal Input maxPrice'), null);
			return;
		}
		filter.price.$lte = maxPrice;
	}
	var productsCollection = this.dbDriver.getCollection('Products');
	productsCollection.find(filter).toArray(function(err, products) {
		callback(err, products);
	});
};

/**
 * It converts the given list of products to a single object like this:
 * {
 *		"KeyboardCombo": {
 *			"price": 28,
 *			"quantity": 2,
 *			"url": "foo"
 *		},
 *		...
 * }
 */
ProductsManager.listToObject = function(products) {
	var productsObject = {};

	for (var i = 0; i < products.length; i++) {
		var product = products[i];
		var singleProductObject = {
			price: product.price,
			quantity: product.quantity,
			url: product.url
		};
		productsObject[product.name] = singleProductObject;
	}

	return productsObject;
};

/**
 * Adds the given order to the Orders collection.
 * Also updates the corresponding product documents.
 *
 * Format of an order:
 * {
 *		"cart": {
 *			'productName1': 2,
 *			'productName2': 1,
 *			...
 *		},
 *		"total": 117
 * }
 */
ProductsManager.prototype.addOrder = function(order, callback) {
	var steps = new SynchSteps();

	var error = null;
	var _this = this;

	// Add to Orders collection:
	steps.step(function(next, stop) {
		var ordersCollection = this.dbDriver.getCollection('Orders');
		ordersCollection.insert(order, function(err, result) {
			if (err) {
				error = err;
				stop();
				return;
			}
			next();
		});
	});

	// Decrement items from corresponding products:
	steps.step(function(next, stop) {
		var decrementProductQuantity = function(index) {
			var productNames = Object.keys(order.cart);
			if (index == productNames.length) {
				next();
				return;
			}

			var productName = productNames[index];
			var productQuantity = order.cart[productName];
			_this.decrementProductQuantity(productName, productQuantity, function(err) {
				if (err) {
					stop();
					error = err;
					return;
				}
				decrementProductQuantity(index + 1);
			});
		};
		decrementProductQuantity(0);
	});

	steps.execute(function() {
		callback(error, {});
	});
};

module.exports = ProductsManager;
