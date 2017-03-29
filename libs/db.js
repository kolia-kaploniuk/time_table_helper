const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

class Database {
	constructor(args) {

		this.url = args.url
	}

	/**
	 * Insert in a given db connection
	 * @param  {array} - data - insert in a collection
	 * @param  {obj} - db
	 * @param  {string} - collection - name of the mongo-collection
	 * @param  {Function} callback
	 */
	insert (data, collection, callback = () => {}) {
		MongoClient.connect(this.url, (err, db) => {
			db.collection(collection).insert(data, (err, res) => {
				callback(err, res);
				db.close();
			})
		})
	}

	/**
	 * Retrive data from db
	 * @param  {object}   query
	 * @param  {string}   collection
	 * @param  {Function} callback 
	 */
	get (query, collection) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(this.url, (err, db) => {
				db.collection(collection).find(query).toArray((err = {error: 'error'}, res) => {
					db.close();
					if (err) return reject(err);
					return resolve(res);
				})
			})
	    })
	}
	
	/**
	 * Retrive data from db
	 * @param  {object}   query
	 * @param  {string}   collection
	 * @param  {Function} callback 
	 */
	updateCollection (data, collection, callback = () => {}) {
		MongoClient.connect(this.url, (err, db) => {
			db.collection(collection).remove();
			db.collection(collection).insert(data, (err, res) => {
				callback(err, res);
				db.close();
			})
		})
	}
}

module.exports = Database;
