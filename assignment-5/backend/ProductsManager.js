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
 */
ProductsManager.prototype.getAllProducts = function() {
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
ProductsManager.listToObject = function() {
};
