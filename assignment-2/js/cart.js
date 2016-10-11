function initializePage() {
	console.log('Initializing page...');

	// Global variables:
	window.cart = {};
	window.products = {
		"Box1" : 5,
		"Box2" : 5,
		"Clothes1" : 5,
		"Clothes2" : 5,
		"Jeans" : 5,
		"Keyboard" : 5,
		"KeyboardCombo" : 5,
		"Mice" : 5,
		"PC1" : 5,
		"PC2" : 5,
		"PC3" : 5,
		"Tent" : 5,
	};
	window.inactiveTime = 0;
	window.cartDisplayRunning = false;

	// Initialization functions:
	setInterval(inactiveTimeTracking, 1000);
	initProducts();
}

function initProducts() {
	var products = $('#productList .product');
	for (var i = 0; i < products.length; i++) {
		// This is a div with the class 'product':
		var product = $(products[i]);

		// This is the path of the image, ex:
		// "images/Box1_$10.png"
		var imagePath = product.find('img').attr('src');

		// This is the full filename, ex:
		// "Box1_$10.png"
		var imageFileName = imagePath.match(/[\w\$]+\.\w+/)[0];

		// This is the filename without the extension, ex:
		// "Box1_$10"
		imageFileName = imageFileName.split('.')[0];

		// This is the product name, ex:
		// "Box1"
		var productName = imageFileName.split('_')[0];

		// This is the price of the product with the dollar sign, ex:
		// "$10"
		var productPrice = imageFileName.split('_')[1];

		console.log(productName);
		console.log(productPrice);
	}
}

function inactiveTimeTracking() {
	if(cartDisplayRunning)
		return;

	inactiveTime += 1;

	if(inactiveTime > 30) {
		// alert("Hey there! Are you still planning to buy something?");
		inactiveTime = 0;
	}

}

function addToCart(productName) {
	inactiveTime = 0;

	var itemQuantity = products[productName];

	if(itemQuantity === 0) {
		alert(productName + " is no longer in stock.");
		return;
	}

	products[productName] = itemQuantity - 1;

	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined)
		cart[productName] = 1;
	else
		cart[productName] = inCartQuantity + 1;

	alert(productName + " was added to your cart.");
}

function removeFromCart(productName) {
	inactiveTime = 0;

	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined)
		alert(productName + " is not in your cart.");
	else {
		if(inCartQuantity === 1)
			delete cart[productName];
		else
			cart[productName] = inCartQuantity - 1;

		products[productName] += 1;
		alert(productName + " was removed from your cart.");
	}
}

function showCart() {
	cartDisplayRunning = true;
	var productsToDisplay = [];
	for(var item in cart) {
		productsToDisplay.push(item + ': ' + cart[item]);
	}

	showItemsWithInterval(0, productsToDisplay);
}

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
