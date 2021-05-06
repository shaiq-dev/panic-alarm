import nodemailer from 'nodemailer';
import Email from 'email-templates';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASS,
	},
});

const email = new Email({
	transport: transporter,
	send: true,
	preview: false,
});

export const sendAlertEmail = (to, templateVars) => {
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
		.catch((e) => console.error(e));
};
