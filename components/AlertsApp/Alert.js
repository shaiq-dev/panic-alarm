import CalIcon from 'assets/calIcon.svg';
import DirIcon from 'assets/directions.svg';
import ManualAlertIcon from 'assets/manualAlert.svg';
import AutoAlertIcon from 'assets/autoAlert.svg';
import { ALERTSCONFIG } from 'utils/constants';

export default function Alert() {
	return (
		<div className="single-alert-wrapper">
			{/* Left Side Icon */}
			<div className="single-alert-icon">
				<div className="icon">{getAlertIconType('auto')}</div>
			</div>

			{/* Alert Body */}
			<div className="single-alert-content">
				<div className="pa-flex pa-px-1">
					<div className="single-alert-name">Shaiq Pulse Alert</div>
					<div className="single-alert-time">11:37 AM</div>
				</div>
				<div className="pa-flex pa-px-1 pa-mb-05">
					<div className="single-alert-type">Press Alert</div>
				</div>
				<div className="single-alert-event">
					<div className="event-icon">
						<CalIcon />
					</div>
					<div className="event-content pa-flex-c">
						<span className="event-content-title">
							Manually Triggered Alert
						</span>
						<span className="event-content-info">
							Occured 14 Times, Last Occurance @ 11.45 AM
						</span>
					</div>
				</div>
				<div className="single-alert-footer">
					<div className="pa-flex-c pa-px-1">
						<div>
							This alert was triggered from{' '}
							<a href="https://link.com">192.168.10</a>
						</div>
						<div className="pa-flex pa-ac">
							<span>Location: Banglore Urban</span>
						</div>
					</div>
					<div className="pa-px-1 pa-flex pa-ac">
						<DirIcon />
						<a className="pa-ml-05" href="https://link.com">
							Get Directions
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

function getAlertIconType(iconType) {
	return iconType === ALERTSCONFIG.AUTO ? (
		<AutoAlertIcon />
	) : (
		<ManualAlertIcon />
	);
}
