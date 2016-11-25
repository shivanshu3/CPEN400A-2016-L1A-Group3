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
 * Calls the given callback when its ready
 * First argument is err if any, the second argument is the list of products.
 */
ProductsManager.prototype.getAllProducts = function(callback) {
	var productsCollection = this.dbDriver.getCollection('Products');
	productsCollection.find({}).toArray(function(err, products) {
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
