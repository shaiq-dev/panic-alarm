import { UserInputError } from 'apollo-server-errors';
import { ObjectId } from 'bson';

const alertResolver = {
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
			}

			return 'DONE';
		},
	},
};

export default alertResolver;
