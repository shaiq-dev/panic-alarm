import { Popconfirm, Popover } from 'antd';
import {
	QuestionCircleOutlined,
	InfoCircleOutlined,
	RedoOutlined,
} from '@ant-design/icons';

import AlertCircle from 'assets/alertCircle.svg';
import AlertsAggregator from './AlertsAggregator';
import AlertsHelp from './AlertsHelp';

import { AlertsData } from 'utils/demoData';

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
				<div className="options pa-flex pa-ac">
					<div className="info">
						<Popover content={<AlertsHelp />}>
							<InfoCircleOutlined />
						</Popover>
					</div>
					<div className="online pa-flex pa-ac">
						<span className="dot"></span>
						<span>Online</span>
					</div>
					<div className="refresh">
						<RedoOutlined className="refresh-icon" />
						<span>Refresh</span>
					</div>
				</div>
			</div>

			{/* Alerts Scroll */}
			<div className="pa-flex-d pa-flex-1 pa-o-hidden pa-max-h-full">
				<div className="alerts-body">
					<div className="alerts-body-wrapper">
						{Object.keys(AlertsData).map((v) => (
							<AlertsAggregator date={v} data={AlertsData[v]} key={v} />
						))}
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
