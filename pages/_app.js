import '../styles/styles.scss';
import { withApollo } from '@/server/ApolloProvider';

function App({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

export default withApollo(App);
