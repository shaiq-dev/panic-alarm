import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import AlertCircle from 'assets/alertCircle.svg';
import AlertsAggregator from './AlertsAggregator';

export default function AlertsApp() {
	return (
		<div className="pa-alerts-app">
			{/* Header */}
			<div className="alerts-header">
				<div className="title pa-flex pa-ac">
					<div className="title-icon">
						<AlertCircle />
					</div>
					<h3>Alerts</h3>
				</div>
			</div>

			{/* Alerts Scroll */}
			<div className="pa-flex-d pa-flex-1 pa-o-hidden pa-max-h-full">
				<div className="alerts-body">
					<div className="alerts-body-wrapper">
						<AlertsAggregator />
					</div>
				</div>
			</div>

			{/* Alerts Footer */}
			<div className="alerts-footer">
				<div className="alerts-footer-wrapper">
					<div className="alerts-footer-content">
						For smooth functioning, you can delete the alerts you have seen
						<Popconfirm
							title="Are you sure to delete all the alerts?"
							icon={<QuestionCircleOutlined style={{ color: '#ef4537' }} />}
							okText="Yes"
							cancelText="No"
							overlayClassName="pa-alerts-delete-popover"
						>
							<button className="btn danger">Delete Alerts</button>
						</Popconfirm>
					</div>
				</div>
			</div>
		</div>
	);
}
