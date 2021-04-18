import { ExportOutlined } from '@ant-design/icons';
import store from 'store';

import Logo from 'assets/logoWhite.svg';

export default function Header() {
	return (
		<header>
			<Logo className="logo" />
			{/* User Section */}
			<div className="user-info pa-flex pa-ac">
				<span className="greeting" title="Shaiq Kar">
					Hello {store.emojis[[~~(Math.random() * store.emojis.length)]]}, Shaiq
					Kar
				</span>
				{/* TODO: Implement Logout */}
				<a href="#" className="user-logout">
					<ExportOutlined />
				</a>
			</div>
		</header>
	);
}
