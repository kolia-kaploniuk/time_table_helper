const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const config = require('./../config');


class Database {
	constructor() {

		// defaul url
		this.url = config.db
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
	retrive (query, collection, callback = () => {}) {
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
