import nodemailer from 'nodemailer';
import Email from 'email-templates';

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		type: 'OAuth2',
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASS,
		clientId: process.env.OAUTH_CLIENT_ID,
		clientSecret: process.env.OAUTH_CLIENT_SECRET,
		refreshToken: process.env.OAUTH_REFRESH_TOKEN,
	},
});

const email = new Email({
	transport: transporter,
	send: true,
	preview: false,
});

export const sendAlertEmail = (to, templateVars) => {
	console.log('Here');
	email
		.send({
			template: 'alert',
			message: {
				from: 'PanicAlarm Alerts <6cse10panicalarm@gmail.com>',
				to,
			},
			locals: templateVars,
		})
		.then(() => console.log(`Alert has been sent to ${to}`))
		.catch(console.error);
};
