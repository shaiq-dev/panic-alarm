import { QuestionCircleOutlined } from '@ant-design/icons';

export default function UserCard({ alertId }) {
	const copy = () => {
		const el = document.createElement('textarea');
		el.value = alertId;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	};

	return (
		<div className="stats-container-user-api pa-flex-c">
			<h3 className="title">Alert ID</h3>
			<p>
				To be able to receive email alerts and connect the PanicAlarm Watch with
				the dashboard, you need to add the below unique alert id to your watch.
				If you dont't know how to add the alert id to the watch, see this
				tutorial.
			</p>
			<button className="alert-id-btn" onClick={copy}>
				{alertId}
			</button>
			<div className="user-api-warn pa-flex pa-ac">
				<QuestionCircleOutlined />
				<p>Don't Share this Alert ID with anyone.</p>
			</div>
		</div>
	);
}
