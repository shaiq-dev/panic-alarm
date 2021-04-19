import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import store from '../store';
import { useAuthDispatch, useAuthState } from 'context/auth';
import checkAuth from '@/server/Utils/checkAuth';

import { Row, Col } from 'antd';
import Header from 'components/Header';
import StatsApp from 'components/StatsApp';
import AlertsApp from 'components/AlertsApp';
import Nav from 'components/Nav';

export default function Home() {
	const router = useRouter();
	const { authenticated, user } = useAuthState();
	const [alerts, setAlerts] = useState([]);
	const [alertsLoading, setAlertsLoading] = useState(true);

	return (
		<>
			<Head>
				<title>{store.config.siteTitle}</title>
			</Head>

			{authenticated && (
				<div className="pa-app">
					<Header />
					<section className="pa-app-main">
						<Row style={{ height: '100%' }}>
							<Col flex="68px">
								<Nav />
							</Col>
							<Col flex="360px">
								<StatsApp />
							</Col>
							<Col flex="auto">
								<AlertsApp user={user} />
							</Col>
						</Row>
					</section>
				</div>
			)}
		</>
	);
}

export const getServerSideProps = async ({ req, res }) => {
	try {
		const token = req.cookies.authToken;
		if (token) checkAuth(token);
		else throw new Error('Auth Token Missing');
	} catch (error) {
		res.writeHead(307, { Location: '/auth/login' }).end();
	}

	return { props: {} };
};
