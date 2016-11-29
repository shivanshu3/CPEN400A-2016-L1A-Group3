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
	it('Should not add more items to the cart than in stock', function(done) {
		var stock = products.Mice.quantity;
		expect(stock).to.be.greaterThan(0);
		expect(cart.Mice).to.be(undefined);
		// Add all Mice which are in stock:
		for(var i = 0; i < stock; i++) {
			addToCart('Mice');
			expect(products.Mice.quantity).to.be(stock - 1 - i);
			expect(cart.Mice).to.be(i + 1);
		}
		// There should be no more Mice available in stock:
		expect(products.Mice.quantity).to.be(0);
		expect(cart.Mice).to.be(stock);
		// This operation shouldn't add any more Mice to the cart:
		addToCart('Mice');
		expect(products.Mice.quantity).to.be(0);
		expect(cart.Mice).to.be(stock);
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
