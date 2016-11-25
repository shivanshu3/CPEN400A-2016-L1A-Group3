// Required modules:
var SynchSteps = require('synch-steps');
var DatabaseDriver = require('./DatabaseDriver.js');

var dbDriver = new DatabaseDriver('localhost', 27017, 'UbcBookstore');

var productsDocument = {
	"KeyboardCombo": {
		"price": 28,
		"quantity": 2,
		"url": "https://cpen400a.herokuapp.com/images/KeyboardCombo.png"
	},
	"Mice": {
		"price": 5,
		"quantity": 6,
		"url": "https://cpen400a.herokuapp.com/images/Mice.png"
	},
	"PC1": {
		"price": 329,
		"quantity": 9,
		"url": "https://cpen400a.herokuapp.com/images/PC1.png"
	},
	"PC2": {
		"price": 366,
		"quantity": 2,
		"url": "https://cpen400a.herokuapp.com/images/PC2.png"
	},
	"PC3": {
		"price": 354,
		"quantity": 2,
		"url": "https://cpen400a.herokuapp.com/images/PC3.png"
	},
	"Tent": {
		"price": 40,
		"quantity": 3,
		"url": "https://cpen400a.herokuapp.com/images/Tent.png"
	},
	"Box1": {
		"price": 5,
		"quantity": 2,
		"url": "https://cpen400a.herokuapp.com/images/Box1.png"
	},
	"Box2": {
		"price": 5,
		"quantity": 10,
		"url": "https://cpen400a.herokuapp.com/images/Box2.png"
	},
	"Clothes1": {
		"price": 20,
		"quantity": 10,
		"url": "https://cpen400a.herokuapp.com/images/Clothes1.png"
	},
	"Clothes2": {
		"price": 29,
		"quantity": 8,
		"url": "https://cpen400a.herokuapp.com/images/Clothes2.png"
	},
	"Jeans": {
		"price": 33,
		"quantity": 10,
		"url": "https://cpen400a.herokuapp.com/images/Jeans.png"
	},
	"Keyboard": {
		"price": 19,
		"quantity": 4,
		"url": "https://cpen400a.herokuapp.com/images/Keyboard.png"
	}
}

var steps = new SynchSteps();

// Connect to the database first:
steps.step(function(next) {
   dbDriver.connect(function(err) {
      if (err) {
         console.log('Failed to connect to the database.');
         console.log(err);
         process.exit(1);
      }
      next();
   });
});

// Drop the Products collection:
steps.step(function(next) {
	var productsCollection = dbDriver.getCollection('Products');
	productsCollection.drop(function(err) {
		// 26 err code is 'collection not found' which is OK
		if ((err) && (err.code != 26)) {
         console.log('Failed to drop the Products collection');
         console.log(err);
         process.exit(1);
		}
		next();
	});
});

// Add the products document predefined in this file to the Products collection:
steps.step(function(next) {
	var productsCollection = dbDriver.getCollection('Products');
	productsCollection.insert(productsDocument, function(err, result) {
		if (err) {
			console.log('Failed to insert in the Products collection');
			console.log(err);
			process.exit(1);
		}
		next();
	});
});

steps.execute(function() {
	console.log('Successfully reset the UbcBookstore.Products');
	process.exit(0);
});
