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

module.exports = ProductsManager;
