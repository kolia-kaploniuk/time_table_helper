const Parser = require('./parser');
const Database = require('./../libs/db');
const config = require('./../config');

let mongo = new Database({
	url: config.db
});

let parser = new Parser({

	// todo: get from command line or from this folder - fs module
	file: './ACY_TIMETABLE_2017-03-02_18-19.xls'
})

let data = parser.parse();

mongo.updateCollection(data, 'timetable', (err, res) => 
	console.log('res: ', res));