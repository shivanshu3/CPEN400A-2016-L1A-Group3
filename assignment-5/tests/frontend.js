
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
	it('Should remove PC1 from cart', function(done) {
		expect(cart.PC1).to.be(1);
		removeFromCart('PC1');
		expect(cart.PC1).to.be(undefined);
		done();
	});
	it('Should remove Tent from cart', function(done) {
		expect(cart.Tent).to.be(1);
		removeFromCart('Tent');
		expect(cart.Tent).to.be(undefined);
		done();
	});
	it('Should not remove an item if it is not in cart', function(done) {
		var miceStock = products.Mice.quantity;
		var numMiceInCart = cart.Mice;
		expect(miceStock).to.be(0);
		expect(numMiceInCart).to.be.greaterThan(0);
		for (var i = 0; i < numMiceInCart; i++) {
			removeFromCart('Mice');
		}
		expect(cart.Mice).to.be(undefined);
		expect(products.Mice.quantity).to.be(numMiceInCart);
		// This operation shouldn't remove Mice from the cart because it doesn't
		// exist in our cart:
		removeFromCart('Mice');
		expect(cart.Mice).to.be(undefined);
		expect(products.Mice.quantity).to.be(numMiceInCart);
		done();
	});
});



describe('initGlobalVars', function() {

	it('Should set up global var', function(done) {
		initGlobalVars();
  		$(initPage);

		expect(cart).to.exist;
		expect(products).to.exist;
		expect(inactiveTime).to.equal(0);
		expect(cartTotal).to.equal(0);
		expect(cartModal).to.equal(null);
		expect(domain).to.equal('http://localhost:3000');

		done();
	});

});

describe('initPage', function() {


	it('products and cartModal should exist', function(done) {
		initPage();

		expect(inactiveTime).to.equal(0);
		expect(products).to.exist;
		expect(cartModal).to.exist;
		done();
	});

});

