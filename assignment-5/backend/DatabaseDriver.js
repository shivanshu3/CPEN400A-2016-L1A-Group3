/**
 * This is the MongoDB Database Driver Class.
 */

//Required objects:
var mongo = require('mongodb');

/**
 * The constructor.
 * Initializes the driver with the hostname, port number, and the database name.
 */
var DatabaseDriver = function(hostname, portNumber, databaseName){
   //Instance variables:
   this.url = 'mongodb://'+hostname+':'+portNumber+'/'+databaseName;
   this.db = null;
};

/**
 * Connects to the database and calls the callback when done.
 */
DatabaseDriver.prototype.connect = function(callback) {
   var _this = this;

   mongo.MongoClient.connect(this.url, function(err, db) {
      _this.db = db;
      callback(err, db);
   });
};

/**
 * Returns the database connection.
 */
DatabaseDriver.prototype.getDatabaseConnection = function(){
   return this.db;
};

/**
 * Returns the collection object with the given name.
 */
DatabaseDriver.prototype.getCollection = function(collectionName){
   return this.db.collection(collectionName);
};

/**
 * Returns the ObjectId class.
 */
DatabaseDriver.prototype.getObjectIdClass = function(){
   return mongo.ObjectId;
};

/**
 * Returns the Binary class.
 */
DatabaseDriver.prototype.getBinaryClass = function(){
   return mongo.Binary;
};

module.exports = DatabaseDriver;
