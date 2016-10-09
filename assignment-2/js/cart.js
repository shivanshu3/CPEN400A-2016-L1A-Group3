var cart = {};
var products = {
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
var inactiveTime = 0;
var cartDisplayRunning = false;
setInterval(inactiveTimeTracking, 1000);

function inactiveTimeTracking() {
	if(cartDisplayRunning)
		return;

	inactiveTime += 1;

	if(inactiveTime > 30) {
		alert("Hey there! Are you still planning to buy something?");
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