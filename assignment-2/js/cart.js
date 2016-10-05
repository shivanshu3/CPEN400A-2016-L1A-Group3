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
	var output = '';
	for(var item in cart) {
		output += item + ': ' + cart[item] + '\n';
	}

	if(!output)
		alert("Your cart is empty.");
	else
		alert("Your cart includes:" + '\n' + output);
}