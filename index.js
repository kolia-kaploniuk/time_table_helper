const http = require('http');
const VKApi = require('node-vkapi');
const CronJob = require('cron').CronJob;
const Database = require('./libs/db');
const config = require('./config');

const prod = process.argv[2] === config.args.prod;
const me = process.argv[2] === config.args.me || process.argv[3] === config.args.me

// declare Vk api
const VK = new VKApi({
  app: {
    id: prod ? process.env.VK_APP_ID : config.vk.app.id,
    secret: prod ? process.env.VK_APP_SECRET : config.vk.app.secret
  }, 
  auth: {
    login: prod ? process.env.VK_AUTH_LOGIN : config.vk.auth.login, 
    pass: prod ? process.env.VK_AUTH_PASS : config.vk.auth.pass
  }
});

// declare mongo db instance
const mongo = new Database({
	url: prod ? process.env.PROD_MONGODB : config.app.db
});

// get tomorrow
const tomorrow = () => {
	let today = new Date();

	today.setDate(today.getDate() + 1);
	return today.toDateString()
}

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
	data && data.length !== 0 ? `Рассписание на завтра - ${ tomorrow() }: \n\n ${ data.map(elem => lectureLineTmp(elem)).join('\n') }` : 'Завтра пар нет.';
 
const uniqueID = () => Math.floor(Math.random() * 1000000000);

 /**
  * post smth to chat
  * @param  {string} data - data to post
  * @param  {number} id - id to whom we should post
  * @return {[type]}      [description]
  */
const post = (data, params) => {
	VK.auth.user({
	  scope: ['offline', 'messages']
	}).then(token => {
		VK.call('messages.send', Object.assign({
			message: data,
			random_id: uniqueID()
		}, params)).then(res => {
	    console.log('res: ', res)})
	  .catch(err => {
	    console.log('err: ', err)})
	})
	.catch(error => {
	  console.log(error)});
}

let query = {
	date: tomorrow()
}

let destination = me ? 
	{user_id: prod ? process.env.VK_ACC_ME : config.vk.accounts.me} :
	{chat_id: prod ? process.env.VK_ACC_GROUP : config.vk.accounts.group}

const postData = () => {
	mongo.get(query, 'timetable')
		.then(res => {
			console.log('res: ', res);
			post(convertToMessage(res), destination);
		}).catch(err => {
			console.log('err: ', err);
		});
	}

const getCurrentDate = () => new Date();

new CronJob(process.env.SCHEDULE, () => {
  	postData();
}, null, true, 'Europe/Kiev');
