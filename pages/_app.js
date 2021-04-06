import App from 'next/app';
import '../styles/styles.scss';

import { withApollo } from '@/server/ApolloProvider';
import { AuthProvider } from 'context/auth';
import checkAuth from '@/server/Utils/checkAuth';

class PanicAlarmApp extends App {
	render() {
		const { Component, pageProps, user, authenticated } = this.props;
		return (
			<AuthProvider user={user} authenticated={authenticated}>
				<Component {...pageProps} />
			</AuthProvider>
		);
	}
}

PanicAlarmApp.getInitialProps = async (appCtx) => {
	let authenticated = false;
	let user = null;

	const request = appCtx.ctx.req;
	if (request && request.cookies) {
		const authToken = request.cookies.authToken;
		if (authToken) {
			try {
				user = checkAuth(authToken);
				authenticated = true;
			} catch (err) {
				console.log(err);
			}
		}
	}

	const appProps = await App.getInitialProps(appCtx);

	return { ...appProps, authenticated, user };
};

export default withApollo(PanicAlarmApp);
