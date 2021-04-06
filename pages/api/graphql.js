import { ApolloServer } from 'apollo-server-micro';
import { MongoClient } from 'mongodb';
import Cookies from 'cookies';

import schema from '@/server/schema';

require('dotenv').config();

let db;

const apolloServer = new ApolloServer({
	schema,
	context: async ({ req, res }) => {
		if (!db) {
			try {
				const dbClient = new MongoClient(process.env.MONGO_DB_CON, {
					useNewUrlParser: true,
					useUnifiedTopology: true,
				});

				if (!dbClient.isConnected()) await dbClient.connect();
				db = dbClient.db('panicAlarmDevDb');
			} catch (e) {
				console.log('[ERROR] Connecting With DB Client', e);
			}
		}
		const cookies = new Cookies(req, res);

		return { db, cookies, res };
	},
});

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler({ path: '/api/graphql' });
