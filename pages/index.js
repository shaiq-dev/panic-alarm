import { useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import store from '../store';

import { useAuthDispatch, useAuthState } from 'context/auth';
import checkAuth from '@/server/Utils/checkAuth';

export default function Home() {
	const router = useRouter();
	const { authenticated, user } = useAuthState();

	return (
		<>
			<Head>
				<title>{store.config.siteTitle}</title>
			</Head>

			{authenticated && (
				<>
					<h1>Welcome</h1>
					{user.username}
				</>
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
