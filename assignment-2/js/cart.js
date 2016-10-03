var cart = {};
var products = {
	"Box1" : 10,
	"Box2" : 10,
	"Clothes1" : 10,
	"Clothes2" : 10,
	"Jeans" : 10,
	"Keyboard" : 10,
	"KeyboardCombo" : 10,
	"Mice" : 10,
	"PC1" : 10,
	"PC2" : 10,
	"PC3" : 10,
	"Tent" : 10, 
};

function addToCart(productName) {
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
	var inCartQuantity = cart[productName];

	if(inCartQuantity === undefined) {
		alert(productName + " is not in your cart.");
	} else {
		if(inCartQuantity === 1)
			delete cart[productName];
		else
			cart[productName] = inCartQuantity - 1;

		products[productName] += 1;

		alert(productName + " was removed from your cart.");
	}
}