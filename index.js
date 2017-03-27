const http = require('http');
const VKApi = require('node-vkapi');
const Database = require('./libs/db');
const config = require('./config');

// declare Vk api
const VK = new VKApi({
  app: {
    id: config.vk.app.id,
    secret: config.vk.app.secret
  }, 
  auth: {
    login: config.vk.auth.login, 
    pass: config.vk.auth.pass
  }
});

// declare mongo db instance
const mongo = new Database({
	url: config.db
});

let today = new Date();
today.setDate(today.getDate() + 1);

/**
 * template for one string
 * @param  {object} lecture
 * @return {string}
 */
const lectureLineTmp = lecture => 
	`${lecture.number} - ${lecture.name} - ${lecture.teacher} - ${lecture.place}`;

/**
 * convert data to message
 * @param  {object} data data from db
 * @return {string}      message, ready to send
 */
const convertToMessage = data => 
	!data && data.length !== 0 ? `Рассписание на завтра - ${ today.toDateString() }: \n\n ${ data.map(elem => lectureLineTmp(elem)).join('\n') }` : 'Завтра пар нет.';
 
 /**
  * post smth to chat
  * @param  {string} data - data to post
  * @param  {number} id - id to whom we should post
  * @return {[type]}      [description]
  */
const post = (data, id) => {
	VK.auth.user({
	  scope: ['offline', 'messages']
	}).then(token => {
		VK.call('messages.send', {
	  		chat_id: id,
	  		message: data,
	  		random_id: Math.random() * 100
	  }).then(res => {
	    console.log('res: ', res)})
	})
	.catch(error => {
	  console.log(error)});
}

let query = {
	date: today.toDateString()
}

mongo.retrive(query, 'timetable', (err, res) => {
	console.log('res: ', res);
	post(convertToMessage(res), config.vk.accounts.group);
});
