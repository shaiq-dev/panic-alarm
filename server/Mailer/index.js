import nodemailer from 'nodemailer';
import Email from 'email-templates';
import path from 'path';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASS,
	},
});

const mailerRoot = path.join(process.cwd(), '/server/Mailer/emails');
const email = new Email({
	transport: transporter,
	send: true,
	preview: false,
	views: {
		root: mailerRoot,
	},
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
