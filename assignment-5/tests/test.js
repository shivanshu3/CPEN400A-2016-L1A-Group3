// Sets up the test environment:
before(function(done) {
	// Wait for the DOM to load:
	$(function() {
		done();
	});
});

describe('addToCart', function() {
	it('Should add PC1 to cart', function(done) {
		expect(cart.PC1).to.be(undefined);
		addToCart('PC1');
		expect(cart.PC1).to.be(1);
		done();
	});
	it('Should add Tent to cart', function(done) {
		expect(cart.Tent).to.be(undefined);
		addToCart('Tent');
		expect(cart.Tent).to.be(1);
		done();
	});
});

describe('removeFromCart', function() {
	it('Should remove Mice from cart', function(done) {
		done();
	});
	it('Should remove KeyboardCombo from cart', function(done) {
		done();
	});
});
