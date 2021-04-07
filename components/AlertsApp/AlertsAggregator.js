import Alert from './Alert';

export default function AlertsAggregator({ children }) {
	return (
		<div className="alerts-aggregator">
			<div className="date-seperator">
				<div className="date-seperator-text">Feburary 10, 2021</div>
			</div>

			{/* Single Alert */}
			<Alert />
		</div>
	);
}
