import Alert from './Alert';

export default function AlertsAggregator({ date, data }) {
	return (
		<div className="alerts-aggregator">
			<div className="date-seperator">
				<div className="date-seperator-text">{date}</div>
			</div>
			{data.map((a) => (
				<Alert {...a} key={a.firstOccurance} />
			))}
		</div>
	);
}
