import { UserInputError } from 'apollo-server-errors';
import { ObjectId } from 'bson';
import { sendAlertEmail } from '@/server/Mailer';
import { ALERTSCONFIG } from 'utils/constants';

const alertResolver = {
	Query: {
		async getAlerts(_, { username }, context, info) {
			// TODO: Implement Cookie based authentication here

			const user = await context.db
				.collection('Users')
				.findOne({ username }, { $exists: true })
				.then((resp) => resp);

			if (!user) {
				throw new UserInputError("User Doesn'tExists", {
					errors: {
						username: 'This username is invalid',
					},
				});
			}

			return user.alerts;
		},
	},
	Mutation: {
		async addAlert(
			_,
			{ alertInput: { alertId, type, associatedIp, pulse, occuredAt } },
			context,
			info
		) {
			const ALERTS_MERGE_TIME = 3600; // 1 Hour

			const user = await context.db
				.collection('Users')
				.findOne({ _id: ObjectId(alertId) }, { $exists: true })
				.then((resp) => resp);

			if (!user)
				throw new UserInputError('Invalid ALert ID', {
					errors: {
						alert: "Either alertId is invalid or doesn't exist",
					},
				});

			//Prepare Email Template Vars
			const dmy = new Date(occuredAt)
				.toLocaleString('default', {
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				})
				.split(' ');

			const t = new Date(occuredAt).toLocaleString('en-US', {
				hour: 'numeric',
				hour12: true,
				minute: 'numeric',
			});

			const templateVars = {
				name: user.name,
				alertName: type === ALERTSCONFIG.AUTO ? 'An Automatic ' : 'A Manual',
				time: t,
				location: 'Bangalore',
				locationUrl: 'https://maps.google.com',
				dateTime: `${dmy[1]} ${dmy[0]}, ${dmy[2]}, ${t}`,
				pulse: type === ALERTSCONFIG.AUTO ? pulse : 'N/A',
			};

			if (user.alerts.length > 0) {
				let userAlerts = user.alerts;

				let lastAlertIndex = userAlerts.length;
				while (lastAlertIndex--) {
					if (userAlerts[lastAlertIndex].type == type) break;
				}

				if (lastAlertIndex > -1) {
					let lastAlert = userAlerts[lastAlertIndex];

					let timeDifference =
						(new Date() - new Date(lastAlert.firstOccurance)) / 1000;

					if (timeDifference > ALERTS_MERGE_TIME) {
						userAlerts.push({
							name: 'Panic Alert',
							firstOccurance: occuredAt,
							type: type,
							totalOccurances: 1,
							occurances: [{ occuredAt, pulse }],
							associatedIp: associatedIp,
						});
					} else {
						userAlerts[lastAlertIndex] = {
							name: lastAlert.name,
							firstOccurance: lastAlert.firstOccurance,
							type: lastAlert.type,
							totalOccurances: lastAlert.totalOccurances + 1,
							occurances: [...lastAlert.occurances, { occuredAt, pulse }],
							associatedIp: associatedIp,
						};
					}

					await context.db.collection('Users').updateOne(
						{ username: user.username },
						{
							$set: {
								alerts: userAlerts,
							},
						},
						{ returnOriginal: false },
						(err, docs) => {
							return docs;
						}
					);
					sendAlertEmail(user.email, templateVars);
				} else {
					await context.db.collection('Users').updateOne(
						{ username: user.username },
						{
							$set: {
								alerts: [
									...userAlerts,
									{
										name: 'Panic Alert',
										firstOccurance: occuredAt,
										type: type,
										totalOccurances: 1,
										occurances: [{ occuredAt, pulse }],
										associatedIp: associatedIp,
									},
								],
							},
						},
						{ returnOriginal: false },
						(_, docs) => {
							return docs;
						}
					);

					sendAlertEmail(user.email, templateVars);
				}
			} else {
				await context.db.collection('Users').updateOne(
					{ username: user.username },
					{
						$set: {
							alerts: [
								{
									name: 'Panic Alert',
									firstOccurance: occuredAt,
									type: type,
									totalOccurances: 1,
									occurances: [{ occuredAt, pulse }],
									associatedIp: associatedIp,
								},
							],
						},
					},
					{ returnOriginal: false },
					(_, docs) => {
						return docs;
					}
				);

				sendAlertEmail(user.email, templateVars);
			}

			return 'DONE';
		},
	},
};

export default alertResolver;
