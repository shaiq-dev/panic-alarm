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

export const sendAlertEmail = async (to, templateVars) => {
	console.log('Preparing Email');
	var mailOptions = {
		from: 'PanicAlarm Alerts <6cse10panicalarm@gmail.com>',
		to: to,
		subject: '[Important][PanicAlarm] Alerts',
		text: prepareEmailBody(templateVars),
	};

	await transporter.sendMail(mailOptions, (error, info) => {
		console.log('Sending');
		if (error) {
			console.log(error);
			return;
		}
		console.log('Email sent: ' + info.response);
	});
};

const prepareEmailBody = ({
	name,
	alertName,
	time,
	location,
	dateTime,
	pulse,
	locationUrl,
}) => {
	let template = `
	Dear ${name},
	${alertName} was trigerred from your watch at ${time} today. The approximate predicted location of the occurance is ${location}.

	[DIRECTIONS] ${locationUrl}
	[TIMESTAMP] ${dateTime} 
	[PULSE] ${pulse}

	-----------------------------------------
	6CSE10 IOT Project, Group 2
	Copyright  2021 Presidency University  All Rights Reserved
	This email was intended for ${name} . If you received this email by mistake please delete it or report it to panicalarm.vercel.app/contact
	`;
	return template;
};
