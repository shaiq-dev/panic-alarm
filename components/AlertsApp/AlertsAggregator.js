import Alert from './Alert';

export default function AlertsAggregator({ date, data }) {
	return (
		<div className="alerts-aggregator">
			<div className="date-seperator">
				<div className="date-seperator-text">{formateDate(date)}</div>
			</div>
			{data.reverse().map((a) => (
				<Alert {...a} key={a.firstOccurance} />
			))}
		</div>
	);
}

function formateDate(date) {
	let dmy = date.split(' ');
	return `${dmy[1]} ${dmy[0]}, ${dmy[2]}`;
}
