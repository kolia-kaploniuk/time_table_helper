const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const config = require('./../config');

// Mix-ins
// Abstract subclasses or mix-ins are templates for classes. An ECMAScript class can only have a single superclass, so multiple inheritance from tooling classes, for example, is not possible. The functionality must be provided by the superclass.

// A function with a superclass as input and a subclass extending that superclass as output can be used to implement mix-ins in ECMAScript:

// var calculatorMixin = Base => class extends Base {
//   calc() { }
// };

// var randomizerMixin = Base => class extends Base {
//   randomize() { }
// };

class Database {

	// constructor is a pseudo-method in a class literal 
	constructor() {

		// defaul url
		this.url = config.db
	}

	// generator method
	* [Symbol.iterator]() {
        for (let arg of this.args) {
            yield arg;
        }

        // Usage
        // for (let x of new IterableArguments('hello', 'world')) {
		//     console.log(x);
		// }
    }

	/**
	 * Insert in a given db connection
	 * @param  {array} - data - insert in a collection
	 * @param  {obj} - db
	 * @param  {string} - collection - name of the mongo-collection
	 * @param  {Function} callback
	 * @return {[type]}              [description]
	 */
	insert (data, collection, callback = () => {}) {
		MongoClient.connect(this.url, (err, db) => {
			db.collection(collection).insert(data, (err, res) => {
				callback(err, res);
				db.close();
			})
		})
	}

	retrive (query, collection, callback = () => {}) {
		// MongoClient.connect(this.url, (err, db) => {
		// 	db.collection(collection).find(query).toArray((err, res) => {
		// 		callback(err, res);
		// 		db.close();
		// 	})
		// })
		return new Promise((resolve, reject) => {
			MongoClient.connect(this.url, (err, db) => {
				db.collection(collection).find(query).toArray((err = {error: 'error'}, res) => {
					db.close();
					if (err) return reject(err);
					return res;
				})
			})
	    })
	}
	
	// todo: make an algorithm for updating only necessary data - with argument date - rewrite data for the date - with algorithm - cell - update onty this cell
	updateCollection (data, collection, callback = () => {}) {
		MongoClient.connect(this.url, (err, db) => {

			// todo: rewrite it
			db.collection(collection).remove();
			db.collection(collection).insert(data, (err, res) => {
					callback(err, res);
					db.close();
			})
		})
	}
}

module.exports = Database;