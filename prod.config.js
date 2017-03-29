module.exports = {
	app: {
		db: process.env.PROD_MONGODB,
		schedule: process.env.SCHEDULE
	},
	args: {
			prod: '--prod',
			dev: '--dev',
			me: '--me'
		},
	vk: {
		app: {
			id: process.env.VK_APP_ID,
			secret: process.env.VK_APP_SECRET
		}, 
		auth: {
			login: process.env.VK_AUTH_LOGIN, 
			pass: process.env.VK_AUTH_PASS,
		},
		accounts: {
			me: process.env.VK_ACC_ME,
			group: process.env.VK_ACC_GROUP
		}
	}
}