const http = require('http');
const VKApi = require('node-vkapi');
const Database = require('./libs/db');
const config = require('./config');

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
 
// VK.auth.user({
//   scope: ['offline', 'messages']
// }).then(token => {
// 	return VK.call('messages.send', {
//   		user_id: 50433305,
//   		message: 'hi from bot',
//   		random_id: Math.random() * 100
//   })
//   .then(res => {
//     console.log('res: ', res)
//   });
// }).then(link => {
 
// }).catch(error => {
//   // catching errors 
//   console.log(error);
// });

let mongo = new Database({
	url: config.db
});

let query = {
	date: new Date('05.10.2017').toDateString()
}

async function data() {
	try {
		return await mongo.retrive(query, 'timetable');
	} catch(err) {
		console.error('error when retriving data: ', err);
	}
}

let dat = data();

console.log('func: ', dat);

// console.log('lectures: ', data().lectures);






