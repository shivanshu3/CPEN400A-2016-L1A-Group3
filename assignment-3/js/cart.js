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
	window.products = initProductsVar(productsPrices);
	window.inactiveTime = 0;
	window.cartDisplayRunning = false;
	window.cartTotal = 0;
}

/**
 * Initializes the products global hashmap which is a map of <ProductName> to
 * <ProductPrice>
 * It requires an array of image paths as input. Each element of the array
 * should be an image path with the image name of the following format:
 * <product_name>_$<product_price>.<extension>
 * Returns a hashmap, which can be assigned to the global variable 'products'
 */
function initProductsVar(productsPrices) {
	var products = {};

	for (var i = 0; i < productsPrices.length; i++) {
		var imagePath = productsPrices[i];
		var productName = productNameFromImagePath(imagePath);
		var productPrice = productPriceFromImagePath(imagePath);
		
		// All quatities are initialized to 5, and all prices are initialized
		// to the product's respective price amount
		products[productName] = {
			'price' : productPrice,
			'quantity' : 5,
		};
	}

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
	if(cartDisplayRunning)
		return;

	inactiveTime += 1;
	displayInactiveTime(inactiveTime);

	if(inactiveTime > 300) {
		alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}

}

function displayInactiveTime(time) {
	var inactiveTimeSpan = $('#inactive_time_span');
	inactiveTimeSpan.text(time);
}

/**
 * Adds the given product to the cart.
 * If we run out of this product, then that product is not added to the cart.
 */
function addToCart(productName) {
	inactiveTime = 0;

	var itemQuantity = products[productName].quantity;

	if(itemQuantity === 0) {
		alert(productName + " is no longer in stock.");
		return;
	}

	products[productName].quantity = itemQuantity - 1;

	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined) {
		cart[productName] = 1;
		showRemoveButton(true, productName);
	}
	else
		cart[productName] = inCartQuantity + 1;

	cartTotal += products[productName].price;
	updateCartTotal(cartTotal);
	alert(productName + " was added to your cart.");
}

/**
 * Removes the given product from the cart if the user has
 * the item in his/her cart.
 */
function removeFromCart(productName) {
	inactiveTime = 0;

	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined)
		alert(productName + " is not in your cart.");
	else {
		if(inCartQuantity === 1) {
			delete cart[productName];
			showRemoveButton(false, productName);
		}
		else
			cart[productName] = inCartQuantity - 1;

		products[productName].quantity += 1;

		cartTotal -= products[productName].price;
		updateCartTotal(cartTotal);
		alert(productName + " was removed from your cart.");
	}
}

function updateCartTotal(cartTotal) {
	var cartButton = $('#cartButton');
	cartButton.text('Cart($' + cartTotal + ')');
}

/**
 * Shows the cart info the user by using alerts.
 */
function showCart() {
	cartDisplayRunning = true;
	var productsToDisplay = [];
	for(var item in cart) {
		productsToDisplay.push(item + ': ' + cart[item]);
	}

	showItemsWithInterval(0, productsToDisplay);
}

/**
 * Works in conjunction with the showCart function.
 */
function showItemsWithInterval(index, productsToDisplay) {
	if(productsToDisplay.length > index) {
		alert(productsToDisplay[index]);
		index += 1;

		if(productsToDisplay.length > index) {
			setTimeout(showItemsWithInterval, 5000, index, productsToDisplay);
			return;
		}
	}

	alert("Your entire shopping cart has been displayed.");
	cartDisplayRunning = false;
	inactiveTime = 0;
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

/**
 * This function displays the cart modal when user clicks on the cart button
 */
function showModal() {
	var modal = document.getElementById('cartModal');
	modal.style.display = "block";
}

/**
 * This function closes the modal when the user clicks on the x at the 
 * top right corner of the modal
 */
function modalClose() {
	var modal = document.getElementById('cartModal');
	modal.style.display = "none";
}
