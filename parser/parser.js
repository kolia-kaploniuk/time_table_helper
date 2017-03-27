const xlsx = require('xlsx');

// должны быть приватными методами класса
const fixDateFormat = (str) => {
	let arr = str.split('.')
	arr.splice(1,0, arr.shift())
	return arr.join('.');
}

const defineLecture = str => 
	str.split('\n').length === 3

const defineDate = str => 
	str.split('.').length === 3

const findDate = (str, array, data) => {

	let number = Number(str.substring(1));
	let firstLetter = str.substring(0, 1);

	for (let i = number; i >= 0; i--) {
		if (array.indexOf(firstLetter + i) !== -1) {
			return {
				date: new Date(fixDateFormat(data[firstLetter + i].w)).toDateString(),
				index: i
			}
		}
	}
}

class Parser {
	constructor(opts) {
		this._file = opts.file;
	}

	// prototype method
	parse() {
		let file = xlsx.readFile(this._file),
			workbook = file.Sheets[file.SheetNames[0]];

		// get fileds with date
		let dateFileds = Object.keys(workbook).filter(key =>
			workbook[key].w && defineDate(workbook[key].w))
		
		// get all lectures
		let lectures = Object.keys(workbook)
			.filter(key =>
				workbook[key].w && defineLecture(workbook[key].w))
			.map(field => {
				let lecture = workbook[field].w.split('\n');
				let date = findDate(field, dateFileds, workbook);
				return {
					number: Number(field.substring(1)) - date.index,
					name: lecture[0],
					date: date.date,
					place: lecture[1],
					teacher: lecture[2]
				};
			})

		return lectures;
	}
}

module.exports = Parser;