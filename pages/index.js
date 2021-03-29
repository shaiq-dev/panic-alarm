import Head from 'next/head';
import store from '../store';

export default function Home({ title }) {
	return (
		<>
			<Head>
				<title>{title}</title>
			</Head>
		</>
	);
}

export async function getStaticProps(context) {
	return {
		props: {
			title: store.config.siteTitle,
		},
	};
}
