import CalIcon from 'assets/calIcon.svg';
import DirIcon from 'assets/directions.svg';
import ManualAlertIcon from 'assets/manualAlert.svg';
import AutoAlertIcon from 'assets/autoAlert.svg';
import { ALERTSCONFIG } from 'utils/constants';
import { Popover } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

export default function Alert({
	name,
	firstOccurance,
	totalOccurances,
	associatedIp,
	occurances,
	type,
}) {
	const dateToTime = (d) =>
		new Date(d).toLocaleString('en-US', {
			hour: 'numeric',
			hour12: true,
			minute: 'numeric',
		});

	const alertDate = (d) => {
		let dmy = new Date(d)
			.toLocaleString('default', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
			.split(' ');
		return `${dmy[1]} ${dmy[0]}`;
	};

	var lastOccurance = dateToTime(occurances[occurances.length - 1].occuredAt);

	console.log(occurances);

	const occurancesContent = () => {
		return (
			<ul className="alert-occurances">
				{occurances.map((o) => (
					<li key={o.occuredAt}>
						{alertDate(o.occuredAt)}, {dateToTime(o.occuredAt)}
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="single-alert-wrapper">
			{/* Left Side Icon */}
			<div className="single-alert-icon">
				<div className={`icon ${type === ALERTSCONFIG.AUTO ? 'auto' : ''}`}>
					{getAlertIconType(type)}
				</div>
			</div>

			{/* Alert Body */}
			<div className="single-alert-content">
				<div className="pa-flex pa-px-1">
					<div className="single-alert-name">{name}</div>
					<div className="single-alert-time">
						{new Date(firstOccurance).toLocaleString('en-US', {
							hour: 'numeric',
							hour12: true,
							minute: 'numeric',
						})}
					</div>
				</div>
				<div className="pa-flex pa-px-1 pa-mb-05">
					<div className="single-alert-type">
						{type === ALERTSCONFIG.AUTO ? 'Automatic' : 'Push Button'} Alert
					</div>
				</div>
				<div
					className={`single-alert-event ${
						type === ALERTSCONFIG.AUTO ? 'auto' : ''
					}`}
				>
					<div className="event-icon">
						<CalIcon />
					</div>
					<div className="event-content pa-flex-c">
						<span className="event-content-title">
							{type === ALERTSCONFIG.AUTO ? 'Automatically' : 'Manually'}{' '}
							Triggered Alert
						</span>
						<span className="event-content-info">
							Occured {totalOccurances} Times, Last Occurance @ {lastOccurance}
						</span>
					</div>
					<div className="event-detail">
						<Popover
							placement="left"
							title={
								<h3
									style={{
										color: type === ALERTSCONFIG.AUTO ? '#f2484b' : '#ee7956',
										fontWeight: 700,
										fontSize: '14px',
									}}
								>
									Alert Occurances
								</h3>
							}
							content={occurancesContent}
						>
							<EllipsisOutlined />
						</Popover>
					</div>
				</div>
				<div className="single-alert-footer">
					<div className="pa-flex-c pa-px-1">
						<div>
							This alert was triggered from{' '}
							<a href="https://link.com">{associatedIp}</a>
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
