import { LineChartOutlined } from '@ant-design/icons';
import TodayWidgetIcon from 'assets/today.svg';

export default function StatsApp() {
	return (
		<div className="pa-stats-app">
			<div className="stats-container">
				<span className="stats-container-title-top">
					<LineChartOutlined className="title-top-icon" />
					PA Stats
				</span>

				{/* <div className="stats-container-today">
					<div className="today-widget">
						<TodayWidgetIcon />
						<span className="num">13</span>
					</div>
					<div className="today-text">Total Alerts Today</div>

					Single info
					<div className="today-widget-single auto">
						<span>8 Automatically Triggered Alerts</span>
					</div>

					<div className="today-widget-single">
						<span>5 Manually Triggered Alerts</span>
					</div>
				</div> */}
			</div>
		</div>
	);
}
