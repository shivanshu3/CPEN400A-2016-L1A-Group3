/**
 * The Modal class represents a Modal window.
 * Currently, this only supports 1 model window at a time.
 */

/** PUBLIC METHODS **/

/**
 * The constructor.
 * It creates the modal window in the DOM, but is not active at this time.
 */
var Modal = function() {
	// Instance variables:
	this.width = 700; // TODO: Do not hard code
	this.itemsTable = null;

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
 * Sets the given jQuery div as the content of the window.
 */
Modal.prototype.setContents = function() {
};

/** PRIVATE METHODS **/

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

Modal.prototype.createContentsDiv = function() {
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

	contentsDiv.append(heading);
	contentsDiv.append(this.itemsTable);

	return contentsDiv;
};

Modal.prototype.refreshView = function() {
	var _this = this;

	var createCellButton = function(text, color) {
		var button = $('<td>');
		button.css('padding-left', 0);
		button.css('text-align', 'center');
		button.css('cursor', 'pointer');
		button.css('background-color', color);
		button.css('user-select', 'none');
		button.width(30);
		button.text(text);
		return button;
	};

	for (var item in cart) {
		var row = $('<tr>');
		var totalCost = cart[item] * products[item].price;
		row.append('<td>' + item + '</td>');
		row.append('<td>' + cart[item] + '</td>');
		row.append('<td>' + products[item].price + '</td>');
		row.append('<td>' + totalCost + '</td>');
		var plusButton = createCellButton('+', '#a6e4a6');
		(function() {
			var _row = row;
			plusButton.click(function() {
				_this.plusButtonClicked(_row);
			});
		})();
		row.append(plusButton);
		var minusButton = createCellButton('-', '#ff8e8e');
		(function() {
			var _row = row;
			minusButton.click(function() {
				_this.minusButtonClicked(_row);
			});
		})();
		row.append(minusButton);

		this.itemsTable.append(row);
	}
};

Modal.prototype.plusButtonClicked = function(row) {
	console.log('+ clicked');
	console.log(row);
};

Modal.prototype.minusButtonClicked = function(row) {
	console.log('- clicked');
	console.log(row);
};
