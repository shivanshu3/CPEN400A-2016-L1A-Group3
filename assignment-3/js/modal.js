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
	this.backgroundDiv = this.createBackgroundDiv();

	// Add everything to the DOM:
	$('body').append(this.backgroundDiv);
};

/**
 * Shows the modal window.
 */
Modal.prototype.show = function() {
};

/**
 * Hides the modal window.
 */
Modal.prototype.hide = function() {
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
