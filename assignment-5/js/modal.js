/**
 * The Modal class represents a Modal window.
 * Currently, this only supports 1 model window at a time.
 */

/** PUBLIC METHODS **/

/**
 * The constructor.
 * It creates the modal window in the DOM, but is not active at this time.
 * The width of the modal is set to what's passed to the constructor.
 */
var Modal = function(width) {
	// Instance variables:
	this.width = width;
	this.itemsTable = null;
	this.footerDiv = null;

	// Create the main DOM elements:
	this.backgroundDiv = this.createBackgroundDiv();
	this.windowDiv = this.createWindowDiv();
	this.closeButton = this.createCloseButton();
	this.contentsDiv = this.createContentsDiv();

	// Hide them before we add them to the DOM:
	this.hide();

	// Add everything to the DOM:
	$('body').append(this.backgroundDiv);
	$('body').append(this.windowDiv);
	this.windowDiv.append(this.closeButton);
	this.windowDiv.append(this.contentsDiv);
};

/**
 * Shows the modal window.
 */
Modal.prototype.show = function() {
	// This will update the cart contents view:
	this.refreshView();

	this.backgroundDiv.css('display', 'block');
	this.windowDiv.css('display', 'block');
	var _this = this;

	// Esc key handler:
	$(document).on('keyup.modal', function(e) {
		if (e.keyCode == 27) {
			_this.hide();
		}
	});
};

/**
 * Hides the modal window.
 */
Modal.prototype.hide = function() {
	this.backgroundDiv.css('display', 'none');
	this.windowDiv.css('display', 'none');

	// Unbind the esc key handler:
	$(document).unbind('keyup.modal');
};

/**
 * Returns true if the modal window is visible, false otherwise.
 */
Modal.prototype.isVisible = function() {
	return this.backgroundDiv.css('display') == 'block';
};

/** PRIVATE METHODS **/

/**
 * Creates a grey translucent div which covers the entire screen
 * to block user input to the underlying elements.
 */
Modal.prototype.createBackgroundDiv = function() {
	var backgroundDiv = $('<div>');
	backgroundDiv.css('background-color', 'grey');
	backgroundDiv.css('opacity', 0.5);
	backgroundDiv.css('position', 'fixed');
	backgroundDiv.css('z-index', 1000);
	backgroundDiv.css('top', 0);
	backgroundDiv.css('bottom', 0);
	backgroundDiv.css('left', 0);
	backgroundDiv.css('right', 0);

	return backgroundDiv;
};

/**
 * Creates a window div in the center of the screen on top of the
 * background div. This is the main div inside of which everything else goes.
 */
Modal.prototype.createWindowDiv = function() {
	var windowDiv = $('<div>');
	windowDiv.addClass('modal_window');
	windowDiv.width(this.width);
	windowDiv.css('position', 'fixed');
	windowDiv.css('top', '50%');
	windowDiv.css('left', '50%');
	windowDiv.css('transform', 'translate(-50%, -50%)');
	windowDiv.css('background-color', 'white');
	windowDiv.css('z-index', 1001);
	windowDiv.css('box-shadow', '6px 7px 30px 5px rgba(0,0,0,0.7)');
	windowDiv.css('border-radius', 10);
	windowDiv.css('box-sizing', 'border-box');
	windowDiv.css('padding', 20);

	return windowDiv;
};

/**
 * Creates a close button which can be placed inside the window div.
 */
Modal.prototype.createCloseButton = function() {
	var closeButton = $('<button>');
	closeButton.css('position', 'fixed');
	closeButton.css('right', -15);
	closeButton.css('top', -15);
	closeButton.css('height', 30);
	closeButton.css('width', 30);
	closeButton.css('background-color', 'black');
	closeButton.css('border-style', 'solid');
	closeButton.css('border-color', 'white');
	closeButton.css('border-radius', 15);
	closeButton.css('box-shadow', '0 4px 8px 0 rgba(0,0,0,0.2)');
	closeButton.css('color', 'white');
	closeButton.css('font-weight', 'bold');
	closeButton.css('outline', 'none');

	closeButton.text('X');

	var _this = this;
	closeButton.click(function() {
		_this.hide();
	});

	return closeButton;
};

/**
 * Creates a content div inside of which there is a heading, and table
 * for showing the items in the cart, and a footer with a checkout button
 * and a subtotal amount div.
 */
Modal.prototype.createContentsDiv = function() {
	var _this = this;
	var contentsDiv = $('<div>');

	var heading = $('<h1>');
	heading.text('Your Shopping Cart');
	heading.css('font-size', 24);

	this.itemsTable = $('<table>');
	this.itemsTable.width('100%');
	var tableHead = $('<thead>');
	tableHead.append('<tr><th>Item</th><th>Qty</th><th>Unit Cost</th>' +
		'<th>Total Cost</th><th></th><th></th></tr>');
	this.itemsTable.append(tableHead);
	this.itemsTable.append($('<tbody>'));

	this.footerDiv = $('<div>');
	this.footerDiv.css('margin-top', 20);
	var checkoutButton = $('<button>Checkout</button>');
	checkoutButton.height(30);
	checkoutButton.css('background-color', 'antiquewhite');
	checkoutButton.css('border-style', 'solid');
	checkoutButton.css('outline', 'none');
	checkoutButton.click(function() {
		_this.checkoutButtonClicked();
	});
	var subtotalDiv = $('<div><b>Subtotal:</b> $<span class="subtotal_span">-</span></div>');
	subtotalDiv.css('float', 'right');
	this.footerDiv.append(checkoutButton);
	this.footerDiv.append(subtotalDiv);

	contentsDiv.append(heading);
	contentsDiv.append(this.itemsTable);
	contentsDiv.append(this.footerDiv);

	return contentsDiv;
};

/**
 * Refreshes the DOM elements inside the content window.
 * Ex: The items table and the subtotal amount div.
 */
Modal.prototype.refreshView = function() {
	var _this = this;

	var itemsTableBody = this.itemsTable.find('tbody');
	itemsTableBody.empty();

	var createCellButton = function(text, bgColor, textColor) {
		var button = $('<td>');
		button.css('padding-left', 0);
		button.css('text-align', 'center');
		button.css('cursor', 'pointer');
		button.css('background-color', bgColor);
		button.css('color', textColor);
		button.css('user-select', 'none');
		button.css('font-weight', '900');
		button.width(30);
		button.text(text);
		return button;
	};

	for (var item in cart) {
		var row = $('<tr>');
		var totalCost = cart[item] * products[item].price;
		row.append('<td class="item_name">' + item + '</td>');
		row.append('<td class="item_quantity">' + cart[item] + '</td>');
		row.append('<td class="item_unit_cost">$' + products[item].price + '</td>');
		row.append('<td class="item_total_cost">$' + totalCost + '</td>');
		var plusButton = createCellButton('+', '#a6e4a6', 'green');
		(function() {
			var _row = row;
			plusButton.click(function() {
				_this.plusButtonClicked(_row);
			});
		})();
		row.append(plusButton);
		var minusButton = createCellButton(unescape('%u2013'), '#ff8e8e', 'red');
		(function() {
			var _row = row;
			minusButton.click(function() {
				_this.minusButtonClicked(_row);
			});
		})();
		row.append(minusButton);

		itemsTableBody.append(row);
	}

	this.updateSubtotal();
};

/**
 * This method is fired when the plus button inside the items table is clicked.
 */
Modal.prototype.plusButtonClicked = function(row) {
	var productName = row.find('.item_name').text();
	if (addToCart(productName)) {
		this.refreshView();
	}
};

/**
 * This method is fired when the minus button inside the items table is clicked.
 */
Modal.prototype.minusButtonClicked = function(row) {
	var productName = row.find('.item_name').text();
	if (removeFromCart(productName)) {
		this.refreshView();
	}
};

/**
 * Calculates and updates the subtotal amount value in the content window.
 */
Modal.prototype.updateSubtotal = function() {
	var subtotal = 0;
	for (var item in cart) {
		subtotal += (cart[item] * products[item].price);
	}

	var subtotalSpan = this.footerDiv.find('.subtotal_span');
	subtotalSpan.text(subtotal);
};

/**
 * This method runs when checkout button is clicked.
 * It synchronizes the local products state with the server by downloading
 * the products object.
 */
Modal.prototype.checkoutButtonClicked = function() {
	console.log("Confirming final prices and product availabilities. One moment...");

	var _this = this;

	initProductsVar(function(updatedProducts) {
		var productUpdatesText = '';

		// Record changes in product prices/quantities:
		for (var productName in cart) {
			var oldProduct = products[productName];
			var updatedProduct = updatedProducts[productName];

			// Product quantity checks:
			if (updatedProduct.quantity < cart[productName]) {
				productUpdatesText += productName + ' quantity will be reduced to ' +
					updatedProduct.quantity + ' due to limited stock.\n';
			}

			// Product price checks:
			if (updatedProduct.price != oldProduct.price) {
				productUpdatesText += productName + ' price will be changed to $' +
					updatedProduct.price + '\n';
			}
		}

		alert(productUpdatesText);

		// Update the cart and the rest of the program state:
		var oldCart = window.cart;
		window.cart = {};
		window.products = updatedProducts;
		window.cartTotal = 0;
		updateCartTotal(window.cartTotal);
		updateProductPriceLabels();
		for (var productName in oldCart) {
			var quantity = oldCart[productName];

			for (var i = 0; i < quantity; i++) {
				addToCart(productName, false);
			}
		}

		_this.refreshView();

		// Final checkout request to the /checkout endpoint:
		var checkoutRequest = $.post('http://localhost:3000/checkout', {
			cart: window.cart,
			total: window.cartTotal
		});
		checkoutRequest.done(function(result) {
			alert('Checkout successful: ' + result);
		});
		checkoutRequest.fail(function(err) {
			console.log(err);
			alert('/checkout error');
		});
	});
};
