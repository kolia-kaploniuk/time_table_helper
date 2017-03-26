const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

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
		this.url = 'mongodb://localhost:27017/oneu'
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
	async insert (data, collection) {
		// , callback = () => {}
		let db = await MongoClient.connect(this.url);
		try {
	        return await db.collection(collection).insert(data);
	    } finally {
	        db.close();
	    }
		// MongoClient.connect(this.url, (err, db) => {
		// 	db.collection(collection).insert(data, (err, res) => {
		// 		callback(err, res);
		// 		db.close();
		// 	})
		// })
	}

	async retrive (query, collection) {
		let db = await MongoClient.connect(this.url);
		try {
			return await db.collection(collection).find(query).toArray();
		} finally {
			db.close();
		}
	}
}

module.exports = Database;