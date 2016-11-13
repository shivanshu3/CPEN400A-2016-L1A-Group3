/**
 * Sets up and initializes the global variables used in this app.
 */
function initGlobalVars() {
	window.cart = {};
	// These are the paths of product images
	window.productsPrices = [
		"images/Box1_$10.png",
		"images/Box2_$5.png",
		"images/Clothes1_$20.png",
		"images/Clothes2_$30.png",
		"images/Jeans_$50.png",
		"images/Keyboard_$20.png",
		"images/KeyboardCombo_$40.png",
		"images/Mice_$20.png",
		"images/PC1_$350.png",
		"images/PC2_$400.png",
		"images/PC3_$300.png",
		"images/Tent_$100.png"
	];
	//Global tempProducts is used to ensure we don't get undefined products var
	//when timeout/error status results in new call of initProductsVar()
	window.tempProducts = {}; //
	window.products = initProductsVar();
	window.inactiveTime = 0;
	window.cartTotal = 0;
	window.cartModal = null;
	window.cartItemPrices = [];
}

/**
 * Initializes the products global hashmap which is a map of <ProductName> to
 * <ProductPrice> and <ProductQuantity>
 * It fulfills this by making an AJAX call to the url https://cpen400a.herokuapp.com/products
 * Returns a list of objects comprising the products along with their prices and quantities,
 * which can be assigned to the global variable 'products'
 */
function initProductsVar() {
	var products = {};

	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://cpen400a.herokuapp.com/products");
	xhr.timeout = 2000; //2000 ms
	
	xhr.onload = function() {
		if(xhr.status == 200) {
			console.log("Request successful, status 200.");

			if (xhr.getResponseHeader('Content-Type').includes('application/json')) {
				var result = JSON.parse(xhr.responseText);

				//populating the products Object with each product, its price and quantity
				for(var item in result) {
					tempProducts[item] = {
						'price' : result[item].price,
						'quantity' : result[item].quantity,
					};
				}
			}
		} else {
			console.log("Received error code. Status " + xhr.status + ". Trying new AJAX call");
			setTimeout(function() { initProductsVar(); }, 2000);
		}
	};

	xhr.ontimeout = function() {
		console.log("Request timeout occurred. Trying new AJAX call.");
		setTimeout(function() { initProductsVar(); }, 2000);
	};

	xhr.onerror = function() {
		console.log("Error occurred on request: " + xhr.status + " Trying new AJAX call.");
		setTimeout(function() { initProductsVar(); }, 2000);
	};
	
	xhr.send();	
	products = tempProducts;
	return products;
}

/**
 * Given an image path like "images/Box1_$10.png", it returns the product
 * name.
 */
function productNameFromImagePath(imagePath) {
	// This is the full filename, ex:
	// "Box1_$10.png"
	var imageFileName = imagePath.match(/[\w\$]+\.\w+/)[0];

	// This is the filename without the extension, ex:
	// "Box1_$10"
	imageFileName = imageFileName.split('.')[0];

	// This is the product name, ex:
	// "Box1"
	var productName = imageFileName.split('_')[0];

	return productName;
}

/**
 * Given an image path like "images/Box1_$10.png", it returns the product
 * price.
 */
function productPriceFromImagePath(imagePath) {
	// This is the full filename, ex:
	// "Box1_$10.png"
	var imageFileName = imagePath.match(/[\w\$]+\.\w+/)[0];

	// This is the filename without the extension, ex:
	// "Box1_$10"
	imageFileName = imageFileName.split('.')[0];

	// This is the price of the product, ex: 10
	var productPrice = Number(imageFileName.split('_')[1].substring(1));

	return productPrice;
}

/**
 * Enhances the DOM and initializes the inactive timer.
 */
function initPage() {
	console.log('Initializing page...');

	// Initialization functions:
	setInterval(inactiveTimeTracking, 1000);
	initProducts();

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

	for (var i = 0; i < productsPrices.length; i++) {
		// This is a div with the class 'product':
		var productDiv = $('<div>');
		productDiv.addClass('product');

		// This is the path of the image, ex:
		// "images/Box1_$10.png"
		var imagePath = productsPrices[i];

		// This is the product name, ex:
		// "Box1"
		var productName = productNameFromImagePath(imagePath);

		// This is the price of the product with the dollar sign, ex:
		// "$10"
		var productPrice = '$' + productPriceFromImagePath(imagePath);

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
		alert("Hey there! Are you still planning to buy something?");
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
function addToCart(productName) {
	inactiveTime = 0;

	var itemQuantity = products[productName].quantity;

	if(itemQuantity === 0) {
		alert(productName + " is no longer in stock.");
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
	alert(productName + " was added to your cart.");
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
		alert(productName + " is not in your cart.");
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
		alert(productName + " was removed from your cart.");
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
