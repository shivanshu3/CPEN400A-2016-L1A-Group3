/**
 * ENTRY POINTS:
 *
 * This file has 2 entry points:
 *		- initGlobalVars
 *			This one runs when this script is loaded. That is, we don't wait for
 *			the DOM to load in order to execute this function. It doesn't do much.
 *			Just initializes some global variables to some constant values.
 *			The reason why we execute this function before the DOM is ready is
 *			to make sure that the test scripts can see that the global variables
 *			exist, and so they don't crash when they are run.
 *
 *		- initPage
 *			This one runs after the DOM is done loading. It does most of the work
 *			of app initialization. It downloads the products from the Heroku app
 *			using AJAX. Then it constructs the product divs from that data and
 *			places these divs in the DOM, making them visible to the user.
 *			It also sets up the inactive time tracker, and the cart button click
 *			event listener.
 */

/**
 * Sets up and initializes the global variables used in this app.
 */
function initGlobalVars() {
	window.cart = {};
	// This var gets initialized later on during initPage using AJAX
	window.products = {};
	window.inactiveTime = 0;
	window.cartTotal = 0;
	window.cartModal = null;
	window.domain = 'http://localhost:3000';
}

/**
 * Gets the products hashmap which is a map of <ProductName> to
 * <ProductPrice> and <ProductQuantity>
 * It fulfills this by making an AJAX call to the /products endpoint
 * The map is passed to the callback function when it is ready.
 */
function initProductsVar(callback) {
	var productListXhr = new XMLHttpRequest();
	productListXhr.open("GET", window.domain + "/products");
	productListXhr.timeout = 2000; //2000 ms

	productListXhr.onload = function() {
		if(productListXhr.status == 200) {
			console.log("Request successful, status 200.");

			if (productListXhr.getResponseHeader('Content-Type').includes('application/json')) {
				var products = JSON.parse(productListXhr.responseText);
				return callback(products);
			}
		} else {
			console.log("Received error code. Status " + productListXhr.status + ". Trying new AJAX call");
			return initProductsVar(callback);
		}
	};

	productListXhr.ontimeout = function() {
		console.log("Request timeout occurred. Trying new AJAX call.");
		return initProductsVar(callback);
	};

	productListXhr.onerror = function() {
		console.log("Error occurred on request: " + productListXhr.status + " Trying new AJAX call.");
		return initProductsVar(callback);
	};

	productListXhr.send();
}

/**
 * Enhances the DOM and initializes the inactive timer.
 */
function initPage() {
	console.log('Initializing page...');

	// Initialization functions:
	setInterval(inactiveTimeTracking, 1000);
	initProductsVar(function(products) {
		window.products = products;
		initProducts();
	});

	// Cart button click handler:
	window.cartModal = new Modal(700);
	$('#cartButton').click(function() {
		window.cartModal.show();
		inactiveTime = 0;
		displayInactiveTime(inactiveTime);
	});
}

/**
 * Initializes all the .product divs.
 * Adds the cart image, price, title, and add and remove buttons to
 * all product divs.
 */
function initProducts() {
	var productListDiv = $('#productList');

	for (var productName in products) {
		// This is a div with the class 'product':
		var productDiv = $('<div>');
		productDiv.addClass('product');

		// This is the path of the image, ex:
		// "images/Box1_$10.png"
		var imagePath = products[productName].url;

		// This is the price of the product with the dollar sign, ex:
		// "$10"
		var productPrice = '$' + products[productName].price;

		// Add IDs to the product divs for easy retrieval later on:
		productDiv.attr('id', 'product_' + productName);

		// Preparing divs to be inserted into the product div:

		var productImage = $('<img>');
		productImage.attr('src', imagePath);

		var cartDiv = $('<div>');
		cartDiv.addClass('cart');
		var cartImage = $('<img>');
		cartImage.addClass('cartimg');
		cartImage.attr('src', 'images/cart.png');
		cartDiv.append(cartImage);

		var priceDiv = $('<div>');
		priceDiv.addClass('price')
		priceDiv.text(productPrice);

		// Anonymous function is used here to store productName in its closure:
		var addButton;
		(function() {
			var _productName = productName;
			addButton = $('<button>');
			addButton.addClass('add');
			addButton.text('Add');
			addButton.click(function() {
				addToCart(_productName);
			});
		})();

		// Anonymous function is used here to store productName in its closure:
		var removeButton;
		(function() {
			var _productName = productName;
			removeButton = $('<button>');
			removeButton.addClass('remove');
			removeButton.text('Remove');
			removeButton.click(function() {
				removeFromCart(_productName);
			});
		})();

		var titleHeading = $('<h5>');
		titleHeading.text(productName);

		// Insert all the divs and buttons created above to the product div:
		productDiv.append(productImage);
		productDiv.append(cartDiv);
		productDiv.append(priceDiv);
		productDiv.append(addButton);
		productDiv.append(removeButton);
		productDiv.append(titleHeading);

		// Insert this product div into the productList div:
		productListDiv.append(productDiv);
	}
}

/**
 * Updates the product price labels on the images in the home page.
 */
function updateProductPriceLabels() {
	$('.product').each(function() {
		var productName = $(this).attr('id').split('_')[1];
		var priceDiv = $(this).find('.price');
		priceDiv.text('$' + products[productName].price);
	});
}

/**
 * This function is called every second. It is used to keep track of how
 * long the user was inactive for.
 */
function inactiveTimeTracking() {
	if(window.cartModal.isVisible()) {
		return;
	}

	inactiveTime += 1;
	displayInactiveTime(inactiveTime);

	if(inactiveTime > 300) {
		console.log("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}

}

/**
 * Updates the inactive timer in the footer.
 */
function displayInactiveTime(time) {
	var inactiveTimeSpan = $('#inactive_time_span');
	inactiveTimeSpan.text(time);
}

/**
 * Adds the given product to the cart.
 * If we run out of this product, then that product is not added to the cart.
 * Returns true if the op is successful, false otherwise.
 */
function addToCart(productName, showAlert) {
	showAlert = (showAlert == undefined) ? true : showAlert;
	inactiveTime = 0;

	var itemQuantity = products[productName].quantity;

	if(itemQuantity === 0) {
		return false;
	}

	products[productName].quantity = itemQuantity - 1;

	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined) {
		cart[productName] = 1;
		showRemoveButton(true, productName);
	} else {
		cart[productName] = inCartQuantity + 1;
	}

	cartTotal += products[productName].price;
	updateCartTotal(cartTotal);
	return true;
}

/**
 * Removes the given product from the cart if the user has
 * the item in his/her cart.
 * Returns true if the op is successful, false otherwise.
 */
function removeFromCart(productName) {
	inactiveTime = 0;

	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined) {
		return false;
	} else {
		if(inCartQuantity === 1) {
			delete cart[productName];
			showRemoveButton(false, productName);
		} else {
			cart[productName] = inCartQuantity - 1;
		}

		products[productName].quantity += 1;

		cartTotal -= products[productName].price;
		updateCartTotal(cartTotal);
		return true;
	}
}

/**
 * Updates the total amount in the cart button.
 */
function updateCartTotal(cartTotal) {
	var cartButton = $('#cartButton');
	cartButton.text('Cart($' + cartTotal + ')');
}

/**
 * This function enables remove button visibility when hover over a given product, if
 * the product is currently in the shopper's cart.
 */
function showRemoveButton(show, productName) {
	var removeButton = $('#product_' + productName + ' button.remove');
	if (show) {
		removeButton.css('display', 'block');
	} else {
		removeButton.css('display', 'none');
	}
}
