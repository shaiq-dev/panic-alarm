export default function AlertsHelp() {
	return (
		<div className="info-help">
			<h4>How Alerts Work?</h4>
			<p>
				A single alert is an aggregation of multiple alerts combined together
				for the timeframe set in the alert settings. If alert timeframe is set
				to 1 hour and if first alert is reported at 10.00 AM, all the incoming
				alerts for the next hour will be grouped with it. You can get detailed
				information about all the reported alert events, including pulse rates
				for automatic alerts by hovering the three dots menu in the aggregated
				alert.{' '}
			</p>
		</div>
	);
}
