import { Empty } from 'antd';

export default function AlertsEmpty() {
	return (
		<div className="pa-flex pa-jc pa-ac pa-h-full alerts-empty">
			<Empty
				// image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
				// imageStyle={{
				// 	height: 60,
				// }}
				description={<span style={{ fontWeight: 700 }}>No Alerts Here</span>}
			>
				<div className="alerts-empty-body">
					<p>
						It appears that there are no alerts generated or triggered for your
						ID. If this appears to be a problem please follow the instruction{' '}
						<a href="#">here</a> on how to configure your{' '}
						<strong>PanicAlarm Watch</strong>. If this didn't help please{' '}
						<a href="#">contact</a> us.
					</p>
				</div>
			</Empty>
		</div>
	);
}
