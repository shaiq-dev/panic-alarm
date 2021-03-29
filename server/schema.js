import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './graphql/typedefs';
import resolvers from './graphql/resolvers';

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

export default schema;
