import { gql, useMutation } from '@apollo/client';
import { ExportOutlined } from '@ant-design/icons';
import store from 'store';

import Logo from 'assets/logoWhite.svg';
import { Router } from 'next/router';

export default function Header({ name }) {
	const [logout, { loading }] = useMutation(LOGOUT_USER, {
		update(_, { data }) {
			Router.push('/auth/login?logout=true');
		},
		variables: {
			lKey: 'pa-lout',
		},
	});
	const handleLogout = () => {
		logout();
	};

	return (
		<header>
			<Logo className="logo" />
			{/* User Section */}
			<div className="user-info pa-flex pa-ac">
				<span className="greeting" title="Shaiq Kar">
					{/* Emoji Commented */}
					{/* {store.emojis[[~~(Math.random() * store.emojis.length)]]} */}
					Hello , {name}
				</span>
				{/* TODO: Implement Logout */}
				<a href="#" className="user-logout" onClick={handleLogout}>
					<ExportOutlined />
				</a>
			</div>
		</header>
	);
}

const LOGOUT_USER = gql`
	mutation logoutUser($lKey: String) {
		logoutUser(lkey: $lKey)
	}
`;
