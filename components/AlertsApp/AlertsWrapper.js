import { gql, useQuery } from '@apollo/client';
import AlertsAggregator from './AlertsAggregator';
import AlertsEmpty from './AlertsEmpty';
import { Space, Spin } from 'antd';

export default function AlertsWrapper({ username }) {
	const { data, loading } = useQuery(FETCH_ALERTS_QUERY, {
		variables: {
			username,
		},
	});

	if (loading) {
		return (
			<Space size="middle">
				<Spin size="large" />
			</Space>
		);
	}

	if (data && data.getAlerts.length < 1) {
		return <AlertsEmpty />;
	}

	const alertsData = data.getAlerts.reduce((groups, alert) => {
		const date = new Date(alert.firstOccurance).toLocaleString('default', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		if (!groups[date]) {
			groups[date] = [];
		}
		groups[date].push(alert);
		return groups;
	}, {});

	return Object.keys(alertsData)
		.reverse()
		.map((v) => <AlertsAggregator date={v} data={alertsData[v]} key={v} />);
}

const FETCH_ALERTS_QUERY = gql`
	query getAlerts($username: String!) {
		getAlerts(username: $username) {
			name
			firstOccurance
			type
			totalOccurances
			occurances {
				occuredAt
				pulse
			}
			associatedIp
		}
	}
`;
