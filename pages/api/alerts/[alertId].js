import { createApolloFetch } from 'apollo-fetch';
import { ALERTSCONFIG } from 'utils/constants';
import store from 'store';

const fetch = createApolloFetch({
	uri: `${store.host}/api/graphql`,
});

const ADDALERT = `
	mutation addAlert(
		$alertId: String!
		$type: String!
		$associatedIp: String!
		$pulse: Int!
		$occuredAt: String!
	) {
		addAlert(
			alertInput: {
				alertId: $alertId
				type: $type
				associatedIp: $associatedIp
				pulse: $pulse
				occuredAt: $occuredAt
			}
		)
	}
`;

export default function alertHandler(req, res) {
	var { alertId, pulse } = req.query;
	const associatedIp = '192.168.1.0';
	let type = ALERTSCONFIG.AUTO;

	if (!pulse) {
		type = ALERTSCONFIG.MANUAL;
		pulse = 0;
	}

	fetch({
		query: ADDALERT,
		variables: {
			alertId,
			type,
			associatedIp,
			pulse: parseInt(pulse),
			occuredAt: String(new Date()),
		},
	});

	res.end('DONE');
}
